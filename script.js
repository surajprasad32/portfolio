// Theme toggle (persists per browser)
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function current() {
    return root.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');
  }
  function render() {
    btn.textContent = current() === 'dark' ? '☀' : '☽';
  }
  btn.addEventListener('click', function () {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    render();
  });
  prefersDark.addEventListener('change', render);
  render();
})();

// Abstract toggles
document.querySelectorAll('.abs-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const abs = btn.closest('.pub-body').querySelector('.abstract');
    const open = abs.hasAttribute('hidden');
    if (open) abs.removeAttribute('hidden'); else abs.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', String(open));
  });
});

// News expand
(function () {
  const list = document.getElementById('news-list');
  const btn = document.getElementById('news-more');
  btn.addEventListener('click', function () {
    const expanded = list.classList.toggle('expanded');
    btn.textContent = expanded ? 'Show less ↑' : 'Show all news ↓';
    btn.setAttribute('aria-expanded', String(expanded));
  });
})();

// Highlight current section in nav
(function () {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const map = new Map(links.map(function (a) { return [a.getAttribute('href').slice(1), a]; }));
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && map.has(e.target.id)) {
        links.forEach(function (a) { a.classList.remove('active'); });
        map.get(e.target.id).classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  map.forEach(function (_, id) { const el = document.getElementById(id); if (el) obs.observe(el); });
})();

document.getElementById('year').textContent = new Date().getFullYear();
