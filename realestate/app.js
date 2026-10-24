(() => {
  // Live Server hosts the pages on 5500; the Node API runs separately on 3000.
  const apiBase = location.port === '5500' ? `${location.protocol}//${location.hostname}:3000` : '';
  const api = async (path, payload) => {
    const response = await fetch(`${apiBase}${path}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Something went wrong. Please try again.');
    return result;
  };
  window.eliteApi = api;

  const nav = document.getElementById('mainNav');
  const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', updateNav, { passive: true }); updateNav();
  const menu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  window.toggleNav = () => {
    const open = menu?.classList.toggle('open') ?? false;
    hamburger?.classList.toggle('active', open);
    hamburger?.setAttribute('aria-expanded', String(open));
  };
  document.addEventListener('click', event => {
    if (menu?.classList.contains('open') && !menu.contains(event.target) && !hamburger?.contains(event.target)) window.toggleNav();
  });

  const reveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) reveal.forEach(el => el.classList.add('revealed'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    reveal.forEach(el => observer.observe(el));
  }

  document.querySelectorAll('.newsletter-form').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault(); const button = form.querySelector('button'); const email = form.querySelector('input[type="email"]');
    if (!email?.reportValidity()) return;
    button.disabled = true;
    let status = form.querySelector('.newsletter-status');
    if (!status) { status = document.createElement('span'); status.className = 'newsletter-status'; status.setAttribute('role', 'status'); form.after(status); }
    try { const result = await api('/api/subscribers', { email: email.value }); status.textContent = result.message; email.value = ''; }
    catch (error) { status.textContent = error.message; }
    finally { button.disabled = false; }
  }));
})();
