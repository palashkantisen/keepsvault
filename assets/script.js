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

// ----- Theme handling (unchanged, but ensure both selects work) -----
const THEMES = ['theme-blue', 'theme-emerald'];
function applyTheme(val){
  const el = document.documentElement;
  THEMES.forEach(c=>el.classList.remove(c));
  if (val) el.classList.add(val);
}
(function initTheme(){
  const saved = localStorage.getItem('kv-theme') || '';
  if (saved) applyTheme(saved);
  const syncSelect = (sel) => { if (sel && saved) sel.value = saved; };
  syncSelect(document.getElementById('themeSwitch'));
  syncSelect(document.getElementById('themeSwitch_m'));
  const onChange = (e)=>{
    const v = e.target.value;
    applyTheme(v);
    localStorage.setItem('kv-theme', v);
    // keep both selects in sync
    const otherId = e.target.id === 'themeSwitch' ? 'themeSwitch_m' : 'themeSwitch';
    const other = document.getElementById(otherId);
    if (other) other.value = v;
  };
  const s1 = document.getElementById('themeSwitch');
  const s2 = document.getElementById('themeSwitch_m');
  if (s1) s1.addEventListener('change', onChange);
  if (s2) s2.addEventListener('change', onChange);
})();

// ----- Mobile menu toggle -----
(function(){
  const btn = document.querySelector('.menu-btn');
  const drawer = document.getElementById('menuDrawer');
  if (!btn || !drawer) return;

  const toggle = () => {
    const open = drawer.hasAttribute('hidden') ? false : true;
    if (open) {
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    }
  };
  btn.addEventListener('click', toggle);

  // Close drawer when clicking a link (better UX)
  drawer.addEventListener('click', (e)=>{
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      drawer.setAttribute('hidden','');
      btn.setAttribute('aria-expanded','false');
    }
  });

  // Close on resize back to desktop
  window.addEventListener('resize', ()=>{
    if (window.innerWidth > 820) {
      drawer.setAttribute('hidden','');
      btn.setAttribute('aria-expanded','false');
    }
  });
})();

// ----- Existing code you already have (year, not-yet-ready notice) -----
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
  const notReady = () => {
    const box = document.getElementById('notReady');
    if (!box) return;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  ['loginBtn','signupBtn','signupBtn2','signupBtn3','loginBtn_m','signupBtn_m'].forEach(id=>{
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', notReady);
  });
});
