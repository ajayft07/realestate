import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, randomUUID, createHash, scryptSync, timingSafeEqual } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, 'data');
const dbFile = path.join(dataDir, 'elite-estates.sqlite');
const legacyFile = path.join(dataDir, 'submissions.json');
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };
const sessions = new Map();
const loginAttempts = new Map();

await mkdir(dataDir, { recursive: true });
const db = new DatabaseSync(dbFile);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY, reference TEXT NOT NULL UNIQUE, name TEXT NOT NULL, email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '', city TEXT NOT NULL DEFAULT '', date TEXT NOT NULL, time TEXT NOT NULL,
    tour_type TEXT NOT NULL DEFAULT '', advisor TEXT NOT NULL DEFAULT '', budget TEXT NOT NULL DEFAULT '',
    interests TEXT NOT NULL DEFAULT '[]', property TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '', consent INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL, confirmation_sent_at TEXT,
    UNIQUE(date, time, advisor)
  );
  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL, message TEXT NOT NULL, consent INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS app_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);
  CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries(created_at DESC);
`);

function json(res, status, value, extraHeaders = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders });
  res.end(JSON.stringify(value));
}
async function readBody(req, maxBytes = 20_000) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > maxBytes) throw Object.assign(new Error('Request too large.'), { status: 413 });
  }
  try { return JSON.parse(raw || '{}'); }
  catch { throw Object.assign(new Error('Invalid JSON.'), { status: 400 }); }
}
const clean = value => typeof value === 'string' ? value.trim().slice(0, 2000) : '';
const emailOk = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const htmlEscape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function cookieValue(req, key) {
  return (req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${key}=`))?.slice(key.length + 1) || '';
}
function sessionFor(req) {
  const token = cookieValue(req, 'ee_admin');
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) { sessions.delete(token); return null; }
  session.expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  return session;
}
function adminRequired(req, res) {
  if (sessionFor(req)) return true;
  json(res, 401, { error: 'Please sign in to the owner dashboard.' });
  return false;
}
function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const scheme = isProduction ? 'https' : 'http';
  if (origin === `${scheme}://${req.headers.host}`) return true;
  const configured = (process.env.CORS_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
  if (configured.includes(origin)) return true;
  return !isProduction && [`http://127.0.0.1:5500`, `http://localhost:5500`].includes(origin);
}
function securePasswordMatch(candidate, expected) {
  return timingSafeEqual(createHash('sha256').update(candidate).digest(), createHash('sha256').update(expected).digest());
}
function storedOwnerPassword() {
  return db.prepare("SELECT value FROM app_settings WHERE key = 'owner_password_hash'").get()?.value || '';
}
function ownerPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD || storedOwnerPassword());
}
function passwordHash(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString('base64url')}:${hash.toString('base64url')}`;
}
function storedPasswordMatches(candidate, value) {
  const [saltText, hashText] = value.split(':');
  if (!saltText || !hashText) return false;
  const salt = Buffer.from(saltText, 'base64url'), expected = Buffer.from(hashText, 'base64url');
  const actual = scryptSync(candidate, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
function isLoopback(req) {
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
}
function formatAppointment(date, time) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const istInstant = new Date(Date.UTC(year, month - 1, day, hour, minute) - 330 * 60 * 1000);
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(istInstant);
}
function publicBooking(row) {
  return { id: row.id, reference: row.reference, name: row.name, email: row.email, phone: row.phone, city: row.city, date: row.date, time: row.time, tourType: row.tour_type, advisor: row.advisor, budget: row.budget, interests: JSON.parse(row.interests || '[]'), property: row.property, notes: row.notes, source: row.source, consent: Boolean(row.consent), status: row.status, createdAt: row.created_at, confirmationSentAt: row.confirmation_sent_at };
}

if (existsSync(legacyFile)) {
  const oldStore = JSON.parse(await readFile(legacyFile, 'utf8'));
  if (!db.prepare('SELECT 1 FROM app_migrations WHERE name = ?').get('json-submissions-v1')) {
    db.exec('BEGIN IMMEDIATE');
    try {
      const addBooking = db.prepare(`INSERT OR IGNORE INTO bookings
        (id, reference, name, email, phone, city, date, time, tour_type, advisor, budget, interests, property, notes, source, consent, status, created_at, confirmation_sent_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      for (const b of oldStore.bookings || []) addBooking.run(b.id || randomUUID(), b.reference || `EE-${randomUUID().slice(0, 8).toUpperCase()}`, b.name || '', b.email || '', b.phone || '', b.city || '', b.date || '', b.time || '', b.tourType || '', b.advisor || '', String(b.budget || ''), JSON.stringify(b.interests || []), b.property || '', b.notes || '', b.source || '', 1, b.status || 'pending', b.createdAt || new Date().toISOString(), b.confirmationSentAt || null);
      const addEnquiry = db.prepare('INSERT OR IGNORE INTO enquiries (id,name,email,phone,type,message,consent,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)');
      for (const e of oldStore.enquiries || []) addEnquiry.run(e.id || randomUUID(), e.name || '', e.email || '', e.phone || '', e.type || '', e.message || '', 1, e.status || 'new', e.createdAt || new Date().toISOString());
      const addSubscriber = db.prepare('INSERT OR IGNORE INTO subscribers (id,email,created_at) VALUES (?,?,?)');
      for (const s of oldStore.subscribers || []) addSubscriber.run(s.id || randomUUID(), s.email || '', s.createdAt || new Date().toISOString());
      db.prepare('INSERT INTO app_migrations (name, applied_at) VALUES (?, ?)').run('json-submissions-v1', new Date().toISOString());
      db.exec('COMMIT');
      console.log('Imported existing submissions.json records into SQLite.');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
  }
}

async function sendConfirmation(booking) {
  const apiKey = process.env.RESEND_API_KEY, from = process.env.FROM_EMAIL;
  if (!apiKey || !from) throw Object.assign(new Error('Email is not configured. Set RESEND_API_KEY and FROM_EMAIL in .env.'), { status: 503 });
  const appointment = formatAppointment(booking.date, booking.time);
  const property = booking.property || 'your selected Elite Estates property';
  const html = `<div style="font-family:Arial,sans-serif;color:#202033;max-width:600px;margin:auto"><div style="background:#0a0a1a;padding:28px 32px;color:#fff"><div style="font-size:12px;letter-spacing:3px;color:#f0c040">ELITE ESTATES</div><h1 style="font-family:Georgia,serif;font-weight:400;margin:16px 0 0">Your private viewing is confirmed</h1></div><div style="padding:30px 32px;background:#faf8f3"><p>Hello ${htmlEscape(booking.name)},</p><p>We’re pleased to confirm your private viewing request. Your advisor will be in touch if any final arrangements are needed.</p><div style="border-left:3px solid #d49a20;padding:4px 0 4px 16px;margin:24px 0"><p><b>Reference</b>: ${htmlEscape(booking.reference)}</p><p><b>Property</b>: ${htmlEscape(property)}</p><p><b>Appointment</b>: ${htmlEscape(appointment)} IST</p><p><b>Tour</b>: ${htmlEscape(booking.tour_type || 'Private viewing')}</p><p><b>Advisor</b>: ${htmlEscape(booking.advisor || 'Elite Estates')}</p></div><p>Thank you for choosing Elite Estates.</p><p style="color:#777;font-size:12px">This message confirms the viewing request listed above. Please reply to this email if you need to make a change.</p></div></div>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `booking-confirmation-${booking.id}-${randomUUID()}` },
    body: JSON.stringify({ from, to: [booking.email], subject: `Viewing confirmed: ${booking.reference}`, html, text: `Hello ${booking.name}, your private viewing is confirmed. Property: ${property}. Appointment: ${appointment} IST. Tour: ${booking.tour_type || 'Private viewing'}. Advisor: ${booking.advisor || 'Elite Estates'}. Reference: ${booking.reference}.` })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(result.message || `Email provider rejected the message (${response.status}).`), { status: 502 });
  return result.id || '';
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const isApiRequest = url.pathname.startsWith('/api/');
    if (isApiRequest && req.headers.origin && !originAllowed(req)) return json(res, 403, { error: 'Cross-origin API requests are not allowed.' });
    if (isApiRequest && req.headers.origin) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Vary', 'Origin');
    }
    if (isApiRequest && req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    if (url.pathname.startsWith('/api/admin/') && req.method === 'POST' && !originAllowed(req)) return json(res, 403, { error: 'Cross-origin admin requests are not allowed.' });
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { status: 'ok', service: 'Elite Estates API', database: 'sqlite' });

    if (url.pathname === '/api/admin/setup' && req.method === 'POST') {
      if (!isLoopback(req)) return json(res, 403, { error: 'Owner setup is only available from this computer.' });
      if (process.env.ADMIN_PASSWORD || storedOwnerPassword()) return json(res, 409, { error: 'Owner access has already been configured.' });
      const input = await readBody(req, 5000), password = typeof input.password === 'string' ? input.password : '';
      if (password.length < 12 || password.length > 200) return json(res, 400, { error: 'Choose a password between 12 and 200 characters.' });
      const result = db.prepare("INSERT OR IGNORE INTO app_settings (key, value) VALUES ('owner_password_hash', ?)").run(passwordHash(password));
      if (!result.changes) return json(res, 409, { error: 'Owner access has already been configured.' });
      return json(res, 201, { ok: true });
    }
    if (url.pathname === '/api/admin/login' && req.method === 'POST') {
      const now = Date.now(), ip = req.socket.remoteAddress || 'unknown', attempt = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
      if (attempt.resetAt <= now) { attempt.count = 0; attempt.resetAt = now + 15 * 60 * 1000; }
      if (attempt.count >= 8) return json(res, 429, { error: 'Too many sign-in attempts. Try again in 15 minutes.' });
      attempt.count++; loginAttempts.set(ip, attempt);
      const input = await readBody(req, 5000), candidate = typeof input.password === 'string' ? input.password : '', expected = process.env.ADMIN_PASSWORD;
      if (!ownerPasswordConfigured()) return json(res, 503, { error: 'Owner access is not configured. Set it up from this computer.' });
      const matches = expected ? securePasswordMatch(candidate, expected) : storedPasswordMatches(candidate, storedOwnerPassword());
      if (!matches) return json(res, 401, { error: 'The password is not correct.' });
      loginAttempts.delete(ip);
      const token = randomBytes(32).toString('hex'); sessions.set(token, { expiresAt: now + 8 * 60 * 60 * 1000 });
      return json(res, 200, { ok: true }, { 'Set-Cookie': `ee_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${isProduction ? '; Secure' : ''}` });
    }
    if (url.pathname === '/api/admin/session' && req.method === 'GET') return json(res, 200, { authenticated: Boolean(sessionFor(req)), configured: ownerPasswordConfigured(), canSetup: !process.env.ADMIN_PASSWORD && !storedOwnerPassword() && isLoopback(req), emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL) });
    if (url.pathname === '/api/admin/logout' && req.method === 'POST') {
      sessions.delete(cookieValue(req, 'ee_admin'));
      return json(res, 200, { ok: true }, { 'Set-Cookie': 'ee_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
    }
    if (url.pathname === '/api/admin/records' && req.method === 'GET') {
      if (!adminRequired(req, res)) return;
      const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all().map(publicBooking);
      const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all().map(row => ({ id: row.id, name: row.name, email: row.email, phone: row.phone, type: row.type, message: row.message, consent: Boolean(row.consent), status: row.status, createdAt: row.created_at }));
      const subscribers = db.prepare('SELECT id,email,created_at AS createdAt FROM subscribers ORDER BY created_at DESC').all();
      return json(res, 200, { bookings, enquiries, subscribers, emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL), counts: { bookings: bookings.length, pending: bookings.filter(b => b.status === 'pending' || b.status === 'reviewed').length, confirmed: bookings.filter(b => b.status === 'confirmed').length, enquiries: enquiries.length, subscribers: subscribers.length } });
    }
    const reviewMatch = url.pathname.match(/^\/api\/admin\/bookings\/([a-f0-9-]+)\/review$/i);
    if (reviewMatch && req.method === 'POST') {
      if (!adminRequired(req, res)) return;
      const result = db.prepare("UPDATE bookings SET status = 'reviewed' WHERE id = ? AND status != 'confirmed'").run(reviewMatch[1]);
      if (!result.changes) return json(res, 404, { error: 'Booking not found, or it has already been confirmed.' });
      return json(res, 200, { ok: true, status: 'reviewed' });
    }
    const confirmMatch = url.pathname.match(/^\/api\/admin\/bookings\/([a-f0-9-]+)\/confirm$/i);
    if (confirmMatch && req.method === 'POST') {
      if (!adminRequired(req, res)) return;
      const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(confirmMatch[1]);
      if (!booking) return json(res, 404, { error: 'Booking not found.' });
      try { await sendConfirmation(booking); }
      catch (error) { return json(res, error.status || 502, { error: error.message }); }
      const sentAt = new Date().toISOString();
      db.prepare("UPDATE bookings SET status = 'confirmed', confirmation_sent_at = ? WHERE id = ?").run(sentAt, booking.id);
      return json(res, 200, { ok: true, status: 'confirmed', confirmationSentAt: sentAt });
    }

    if (req.method === 'POST' && url.pathname === '/api/enquiries') {
      const input = await readBody(req), name = clean(input.name), email = clean(input.email), message = clean(input.message), type = clean(input.type), consent = input.consent === true;
      if (name.length < 2 || !emailOk(email) || message.length < 10 || !type || !consent) return json(res, 400, { error: 'Please provide valid details and consent.' });
      const id = randomUUID(), createdAt = new Date().toISOString();
      db.prepare('INSERT INTO enquiries (id,name,email,phone,type,message,consent,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)').run(id, name, email, clean(input.phone), type, message, 1, 'new', createdAt);
      return json(res, 201, { ok: true, id, message: 'Thanks, your enquiry has been received.' });
    }
    if (req.method === 'POST' && url.pathname === '/api/bookings') {
      const input = await readBody(req), name = clean(input.name), email = clean(input.email), date = clean(input.date), time = clean(input.time);
      if (name.length < 2 || !emailOk(email) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || input.consent !== true) return json(res, 400, { error: 'Please provide valid contact details, a date, time and consent.' });
      const [year, month, day] = date.split('-').map(Number), [hour, minute] = time.split(':').map(Number);
      const utcFields = new Date(Date.UTC(year, month - 1, day, hour, minute));
      if (utcFields.getUTCFullYear() !== year || utcFields.getUTCMonth() !== month - 1 || utcFields.getUTCDate() !== day || utcFields.getUTCHours() !== hour || utcFields.getUTCMinutes() !== minute) return json(res, 400, { error: 'Please choose a valid appointment date and time.' });
      const appointmentDate = new Date(utcFields.getTime() - 330 * 60 * 1000);
      if (appointmentDate <= new Date()) return json(res, 400, { error: 'Please choose a future viewing time.' });
      const id = randomUUID(), reference = `EE-${randomUUID().slice(0, 8).toUpperCase()}`, createdAt = new Date().toISOString();
      try {
        db.prepare(`INSERT INTO bookings (id,reference,name,email,phone,city,date,time,tour_type,advisor,budget,interests,property,notes,source,consent,status,created_at)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(id, reference, name, email, clean(input.phone), clean(input.city), date, time, clean(input.tourType), clean(input.advisor), clean(input.budget), JSON.stringify(Array.isArray(input.interests) ? input.interests.map(clean).slice(0, 12) : []), clean(input.property), clean(input.notes), clean(input.source), 1, 'pending', createdAt);
      } catch (error) {
        if (error.code === 'ERR_SQLITE_CONSTRAINT_UNIQUE') return json(res, 409, { error: 'That viewing slot has just been requested. Please choose another time.' });
        throw error;
      }
      return json(res, 201, { ok: true, id, reference, message: 'Your viewing request has been sent for owner review.' });
    }
    if (req.method === 'POST' && url.pathname === '/api/subscribers') {
      const input = await readBody(req), email = clean(input.email).toLowerCase();
      if (!emailOk(email)) return json(res, 400, { error: 'Enter a valid email address.' });
      try { db.prepare('INSERT INTO subscribers (id,email,created_at) VALUES (?,?,?)').run(randomUUID(), email, new Date().toISOString()); }
      catch (error) { if (error.code === 'ERR_SQLITE_CONSTRAINT_UNIQUE') return json(res, 200, { ok: true, message: 'You are already subscribed.' }); throw error; }
      return json(res, 201, { ok: true, message: 'You are subscribed.' });
    }
    if (url.pathname.startsWith('/api/')) return json(res, 404, { error: 'API route not found.' });
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Method not allowed.' });
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const pathParts = pathname.split('/').filter(Boolean);
    const privatePath = pathParts.some(part => part.startsWith('.')) || ['data', 'scripts', 'tmp'].includes(pathParts[0]?.toLowerCase());
    if (privatePath) return json(res, 404, { error: 'Not found.' });
    const file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(root + path.sep) || !existsSync(file)) return json(res, 404, { error: 'Not found.' });
    const content = await readFile(file), extension = path.extname(file);
    if (!['.html', '.css', '.js', '.pdf', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'].includes(extension.toLowerCase())) return json(res, 404, { error: 'Not found.' });
    res.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream', ...(extension === '.pdf' ? { 'Content-Disposition': `attachment; filename="${path.basename(file)}"` } : {}), 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
    if (req.method === 'HEAD') return res.end();
    res.end(content);
  } catch (error) { console.error(error); json(res, error.status || 500, { error: error.status ? error.message : 'Server error.' }); }
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other server (usually VS Code Live Server) and try again.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});
server.listen(port, () => console.log(`Elite Estates running at http://localhost:${port}`));
