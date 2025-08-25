// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

// Theme switcher
const select = document.getElementById('themeSwitch');
if (select) {
  select.addEventListener('change', () => {
    document.body.classList.remove('theme-blue', 'theme-emerald');
    if (select.value) document.body.classList.add(select.value);
  });
}

// “Not ready” note for login/signup
const notReady = () => {
  const box = document.getElementById('notReady');
  if (!box) return;
  box.hidden = false;
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
['loginBtn','signupBtn','signupBtn2','signupBtn3'].forEach(id=>{
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', notReady);
});

// Expand/Collapse “Read more” cards
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-toggle]');
  if (!t) return;
  const box = t.parentElement.querySelector('div[hidden],div[data-extra]');
  if (!box) return;
  box.hidden = !box.hidden;
  t.textContent = box.hidden ? 'Read more' : 'Hide';
});

// ==============================
// THEME HANDLING
// ==============================

const THEMES = ['theme-blue', 'theme-emerald'];

function applyTheme(val) {
  const el = document.documentElement; // apply class on <html>
  THEMES.forEach(c => el.classList.remove(c));
  if (val) el.classList.add(val);
}

(function initTheme() {
  try {
    const saved = localStorage.getItem('kv-theme') || '';
    if (saved) applyTheme(saved);

    const select = document.getElementById('themeSwitch');
    if (!select) return;

    if (saved) select.value = saved; // sync dropdown
    select.addEventListener('change', () => {
      const val = select.value;
      applyTheme(val);
      localStorage.setItem('kv-theme', val);
    });
  } catch (e) {
    console.error('Theme init failed', e);
  }
})();
