// THEME TOGGLE
const themeToggle = document.getElementById('theme-toggle');
let savedTheme = 'light';
try {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') savedTheme = stored;
} catch {
  // Storage may be unavailable in restricted browser contexts.
}
document.body.setAttribute('data-theme', savedTheme);

if (themeToggle) themeToggle.addEventListener('click', () => {
  const next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch {}
});

// AOS INITIALIZATION
if (typeof AOS !== 'undefined' && typeof AOS.init === 'function') {
  AOS.init({ duration: 800, once: true });
}

// SET SKILL BAR LEVELS
document.querySelectorAll('.skill-bar').forEach((bar) => {
  const level = bar.getAttribute('data-level') || '0%';
  bar.style.setProperty('--level', level);
});
