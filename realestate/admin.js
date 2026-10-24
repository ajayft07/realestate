(() => {
  const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const apiBase = location.port === '3000' ? '' : localHost ? `http://${location.hostname}:3000` : '';
  const loginPanel = document.getElementById('loginPanel');
  const dashboardPanel = document.getElementById('dashboardPanel');
  const loginForm = document.getElementById('loginForm');
  const setupPanel = document.getElementById('setupPanel');
  const setupForm = document.getElementById('setupForm');
  const loginAlert = document.getElementById('loginAlert');
  const setupHint = document.getElementById('setupHint');
  const dashboardAlert = document.getElementById('dashboardAlert');
  const recordList = document.getElementById('recordList');
  const search = document.getElementById('recordSearch');
  let data = { bookings: [], enquiries: [], subscribers: [] };
  let kind = 'bookings';

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const textOrDash = value => value ? escapeHtml(value) : '<span class="admin-muted">Not provided</span>';
  const formatDate = (date, time) => {
    if (!date) return 'Date unavailable';
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = (time || '00:00').split(':').map(Number);
    return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(year, month - 1, day, hour, minute));
  };
  async function request(url, options = {}) {
    let response;
    try {
      response = await fetch(`${apiBase}${url}`, { credentials: 'include', ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } });
    } catch (error) {
      if (error instanceof TypeError || /failed to fetch|networkerror/i.test(error.message || '')) {
        throw new Error('The backend is not reachable. Start it by double-clicking start-backend.cmd in the project folder, wait a few seconds, then refresh this page. Live Server alone cannot process admin logins.');
      }
      throw error;
    }
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result;
  }
  function showAlert(element, message, type = 'error') {
    element.textContent = message;
    element.className = `admin-alert ${type}`;
    element.hidden = false;
  }
  function enterDashboard() {
    loginPanel.hidden = true;
    dashboardPanel.hidden = false;
    refresh();
  }
  function renderStats(counts) {
    const items = [
      ['All viewings', counts.bookings, '⌂'],
      ['Needs review', counts.pending, '◷'],
      ['Confirmed', counts.confirmed, '✓'],
      ['Enquiries', counts.enquiries, '✉']
    ];
    document.getElementById('statsGrid').innerHTML = items.map(([label, value, icon]) => `<article class="admin-stat"><span class="admin-stat-icon">${icon}</span><span class="admin-stat-label">${label}</span><strong>${value}</strong></article>`).join('');
    document.getElementById('bookingTabCount').textContent = counts.bookings;
    document.getElementById('enquiryTabCount').textContent = counts.enquiries;
    document.getElementById('subscriberTabCount').textContent = counts.subscribers;
  }
  function bookingCard(booking) {
    const status = booking.status || 'pending';
    const interests = Array.isArray(booking.interests) && booking.interests.length ? booking.interests.join(', ') : '';
    const action = status === 'confirmed'
      ? `<button class="admin-secondary-button" type="button" data-action="confirm" data-id="${escapeHtml(booking.id)}">Resend confirmation</button>`
      : `<button class="admin-primary-button admin-send-button" type="button" data-action="confirm" data-id="${escapeHtml(booking.id)}">Send confirmation email <span aria-hidden="true">→</span></button>`;
    const review = status === 'pending' ? `<button class="admin-review-button" type="button" data-action="review" data-id="${escapeHtml(booking.id)}">Mark reviewed</button>` : '';
    return `<article class="admin-record booking-record">
      <div class="record-topline"><div><span class="record-reference">${escapeHtml(booking.reference)}</span><span class="record-date">Received ${escapeHtml(new Date(booking.createdAt).toLocaleString('en-IN'))}</span></div><span class="record-status status-${escapeHtml(status)}">${escapeHtml(status)}</span></div>
      <div class="booking-summary"><div><span class="record-label">CUSTOMER</span><h2>${textOrDash(booking.name)}</h2><a href="mailto:${escapeHtml(booking.email)}">${textOrDash(booking.email)}</a><p>${textOrDash(booking.phone)}${booking.city ? ` · ${escapeHtml(booking.city)}` : ''}</p></div><div><span class="record-label">REQUESTED VISIT</span><strong>${escapeHtml(formatDate(booking.date, booking.time))}</strong><p>${textOrDash(booking.tourType)}${booking.advisor ? ` · ${escapeHtml(booking.advisor)}` : ''}</p><p>${textOrDash(booking.property)}</p></div></div>
      <details class="record-details"><summary>Full request details</summary><div class="detail-grid">
        <div><span class="record-label">REFERENCE</span><p>${escapeHtml(booking.reference)}</p></div><div><span class="record-label">EMAIL</span><p>${textOrDash(booking.email)}</p></div><div><span class="record-label">PHONE</span><p>${textOrDash(booking.phone)}</p></div><div><span class="record-label">CITY</span><p>${textOrDash(booking.city)}</p></div>
        <div><span class="record-label">DATE &amp; TIME</span><p>${escapeHtml(formatDate(booking.date, booking.time))} IST</p></div><div><span class="record-label">TOUR FORMAT</span><p>${textOrDash(booking.tourType)}</p></div><div><span class="record-label">ADVISOR</span><p>${textOrDash(booking.advisor)}</p></div><div><span class="record-label">BUDGET</span><p>${textOrDash(booking.budget)}${booking.budget ? ' Cr' : ''}</p></div>
        <div class="detail-wide"><span class="record-label">PROPERTY INTERESTS</span><p>${textOrDash(interests)}</p></div><div class="detail-wide"><span class="record-label">SPECIFIC PROPERTY</span><p>${textOrDash(booking.property)}</p></div><div class="detail-wide"><span class="record-label">SPECIAL REQUESTS</span><p>${textOrDash(booking.notes)}</p></div><div><span class="record-label">REFERRAL SOURCE</span><p>${textOrDash(booking.source)}</p></div><div><span class="record-label">CONTACT CONSENT</span><p>${booking.consent ? 'Given' : 'Not recorded'}</p></div>
        ${booking.confirmationSentAt ? `<div><span class="record-label">CONFIRMATION SENT</span><p>${escapeHtml(new Date(booking.confirmationSentAt).toLocaleString('en-IN'))}</p></div>` : ''}
      </div></details>
      <div class="record-actions">${review}${action}<span class="record-action-status" id="action-${escapeHtml(booking.id)}" role="status"></span></div>
    </article>`;
  }
  function enquiryCard(item) {
    return `<article class="admin-record"><div class="record-topline"><div><span class="record-reference">${escapeHtml(item.type)}</span><span class="record-date">Received ${escapeHtml(new Date(item.createdAt).toLocaleString('en-IN'))}</span></div><span class="record-status status-new">${escapeHtml(item.status || 'new')}</span></div><div class="booking-summary"><div><span class="record-label">CUSTOMER</span><h2>${textOrDash(item.name)}</h2><a href="mailto:${escapeHtml(item.email)}">${textOrDash(item.email)}</a><p>${textOrDash(item.phone)}</p></div><div><span class="record-label">MESSAGE</span><p class="admin-message">${textOrDash(item.message)}</p><p>Consent: ${item.consent ? 'Given' : 'Not recorded'}</p></div></div></article>`;
  }
  function subscriberCard(item) {
    return `<article class="admin-record subscriber-record"><div><span class="record-label">NEWSLETTER SUBSCRIBER</span><h2>${escapeHtml(item.email)}</h2></div><span class="record-date">Joined ${escapeHtml(new Date(item.createdAt).toLocaleString('en-IN'))}</span></article>`;
  }
  function renderRecords() {
    const query = search.value.trim().toLowerCase();
    const records = data[kind] || [];
    const filtered = query ? records.filter(item => JSON.stringify(item).toLowerCase().includes(query)) : records;
    if (!filtered.length) {
      recordList.innerHTML = `<div class="admin-empty"><span>✧</span><h2>${records.length ? 'No matching records' : 'Nothing here yet'}</h2><p>${records.length ? 'Try another search.' : 'New submissions will appear here as customers send them.'}</p></div>`;
      return;
    }
    recordList.innerHTML = filtered.map(kind === 'bookings' ? bookingCard : kind === 'enquiries' ? enquiryCard : subscriberCard).join('');
  }
  async function refresh() {
    const refreshButton = document.getElementById('refreshButton');
    refreshButton.disabled = true;
    try {
      const result = await request('/api/admin/records'); data = result;
      renderStats(result.counts); renderRecords(); dashboardAlert.hidden = true;
      document.getElementById('mailNote').hidden = result.emailConfigured;
    } catch (error) {
      if (error.message.includes('sign in')) { dashboardPanel.hidden = true; loginPanel.hidden = false; return; }
      showAlert(dashboardAlert, error.message);
    } finally { refreshButton.disabled = false; }
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault(); loginAlert.hidden = true;
    try {
      await request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: new FormData(loginForm).get('password') }) });
      loginForm.reset(); enterDashboard();
    } catch (error) {
      showAlert(loginAlert, error.message);
      if (error.message.includes('not configured')) setupHint.hidden = false;
    }
  });
  setupForm.addEventListener('submit', async event => {
    event.preventDefault(); loginAlert.hidden = true;
    const form = new FormData(setupForm);
    const password = String(form.get('password') || '');
    if (password !== String(form.get('confirmPassword') || '')) {
      showAlert(loginAlert, 'The passwords do not match.');
      return;
    }
    const button = setupForm.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      await request('/api/admin/setup', { method: 'POST', body: JSON.stringify({ password }) });
      setupForm.reset(); setupPanel.hidden = true; loginForm.hidden = false;
      showAlert(loginAlert, 'Owner password created. Sign in to continue.', 'success');
    } catch (error) {
      showAlert(loginAlert, error.message);
    } finally { button.disabled = false; }
  });
  document.getElementById('logoutButton').addEventListener('click', async () => {
    try { await request('/api/admin/logout', { method: 'POST', body: '{}' }); } finally { dashboardPanel.hidden = true; loginPanel.hidden = false; }
  });
  document.getElementById('refreshButton').addEventListener('click', refresh);
  search.addEventListener('input', renderRecords);
  document.querySelectorAll('.admin-tab').forEach(tab => tab.addEventListener('click', () => {
    kind = tab.dataset.kind;
    document.querySelectorAll('.admin-tab').forEach(item => { const active = item === tab; item.classList.toggle('active', active); item.setAttribute('aria-selected', String(active)); });
    renderRecords();
  }));
  recordList.addEventListener('click', async event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    const status = document.getElementById(`action-${id}`);
    button.disabled = true;
    try {
      await request(`/api/admin/bookings/${encodeURIComponent(id)}/${action}`, { method: 'POST', body: '{}' });
      await refresh();
      showAlert(dashboardAlert, action === 'confirm' ? 'Confirmation email sent successfully.' : 'Request marked as reviewed.', 'success');
    } catch (error) {
      if (status) status.textContent = error.message;
      showAlert(dashboardAlert, error.message);
      button.disabled = false;
    }
  });

  request('/api/admin/session').then(result => {
    if (result.authenticated) enterDashboard();
    else if (!result.configured) {
      loginForm.hidden = true;
      setupPanel.hidden = !result.canSetup;
      setupHint.hidden = result.canSetup;
    } else {
      loginForm.hidden = false;
      setupPanel.hidden = true;
      setupHint.hidden = true;
    }
    document.getElementById('mailNote').hidden = result.emailConfigured;
  }).catch(error => showAlert(loginAlert, error.message));
})();
