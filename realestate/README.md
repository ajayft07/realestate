# Elite Estates

Multi-page real estate site with a Node.js and SQLite backend.

## Run locally

Install Node.js 22.13 or newer. Start VS Code Live Server for the pages on port 5500. Configure a verified Resend sender (`RESEND_API_KEY` and `FROM_EMAIL`) for customer confirmation emails. `ADMIN_PASSWORD` in `.env` is optional; if it is blank, the first visit to the owner dashboard on localhost will prompt you to create a password, stored as a salted hash in SQLite. Start the API on port 3000 by double-clicking `start-backend.cmd` in File Explorer; it runs in the background, so closing the admin browser tab will not stop it. Keep VS Code Live Server running while using the site at <http://127.0.0.1:5500>. If the backend computer restarts, double-click the launcher again. SQLite creates `data/elite-estates.sqlite` on first start. If a previous `data/submissions.json` exists, its records are imported once into SQLite.

Open <http://127.0.0.1:5500/admin.html> to set up or sign in to the owner dashboard. Booking requests appear as pending. The owner reviews each request and selects **Send confirmation email**; the booking is marked confirmed only after Resend accepts the message. Enquiries and newsletter subscribers are also available in the dashboard. If email is not configured, records are still saved and the dashboard shows the setup requirement.

## API

- `GET /api/health`
- `POST /api/enquiries` — `{ name, email, phone, type, message, consent }`
- `POST /api/bookings` — `{ name, email, phone, city, date, time, tourType, advisor, budget, interests, property, notes, source, consent }`
- `POST /api/subscribers` — `{ email }`
- `POST /api/admin/login` — owner password login (HTTP-only session cookie)
- `GET /api/admin/records` — protected dashboard data for bookings, enquiries, subscribers
- `POST /api/admin/bookings/:id/review` — mark a viewing request reviewed
- `POST /api/admin/bookings/:id/confirm` — send confirmation email and mark confirmed

Before production, serve the app over HTTPS, set `NODE_ENV=production`, use a strong owner password, back up the SQLite database, and configure a verified email sender.

## Property brochure

The property modal downloads `output/pdf/elite-estates-portfolio.pdf`. Regenerate it with `python scripts/generate_property_brochure.py` (ReportLab required).
