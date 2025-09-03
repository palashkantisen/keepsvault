// ==============================
// INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Initialize theme switchers
  initTheme();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize expandable cards
  initExpandableCards();
  
  // Initialize "not ready" notices
  initNotReadyNotices();
});

// ==============================
// THEME HANDLING
// ==============================
const THEMES = ['theme-blue', 'theme-amber', 'theme-emerald'];

function applyTheme(val) {
  const el = document.documentElement; // apply class on <html>
  // First remove all themes
  THEMES.forEach(c => el.classList.remove(c));
  // Add the new theme if it's not the default blue
  if (val && val !== 'theme-blue') {
    el.classList.add(val);
  }
}

function initTheme() {
  try {
    const saved = localStorage.getItem('kv-theme') || '';
    if (saved) applyTheme(saved);

    // Get both theme selectors (desktop and mobile)
    const selectDesktop = document.getElementById('themeSwitch');
    const selectMobile = document.getElementById('themeSwitch_m');

    // Set initial values
    if (saved) {
      if (selectDesktop) selectDesktop.value = saved;
      if (selectMobile) selectMobile.value = saved;
    }

    // Add change listeners
    const onChange = (e) => {
      const val = e.target.value;
      applyTheme(val);
      localStorage.setItem('kv-theme', val);
      
      // Keep both selects in sync
      const otherId = e.target.id === 'themeSwitch' ? 'themeSwitch_m' : 'themeSwitch';
      const other = document.getElementById(otherId);
      if (other) other.value = val;
    };

    if (selectDesktop) selectDesktop.addEventListener('change', onChange);
    if (selectMobile) selectMobile.addEventListener('change', onChange);
  } catch (e) {
    console.error('Theme init failed', e);
  }
}

// ==============================
// MOBILE MENU
// ==============================
function initMobileMenu() {
  const btn = document.querySelector('.menu-btn');
  const drawer = document.getElementById('menuDrawer');
  
  if (!btn || !drawer) return;

  const toggle = () => {
    const isHidden = drawer.hasAttribute('hidden');
    
    if (isHidden) {
      // Open menu
      drawer.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      // Close menu
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  };

  btn.addEventListener('click', toggle);

  // Close drawer when clicking a link (better UX)
  drawer.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on resize back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==============================
// EXPANDABLE CARDS
// ==============================
function initExpandableCards() {
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('[data-toggle]');
    if (!toggleBtn) return;
    
    const card = toggleBtn.closest('[data-expand]');
    if (!card) return;
    
    // Find the expandable content div (either hidden or visible)
    const expandableContent = card.querySelector('div.muted');
    if (!expandableContent) return;
    
    // Toggle the hidden state
    expandableContent.hidden = !expandableContent.hidden;
    
    // Update button text and classes based on current state
    if (expandableContent.hidden) {
      toggleBtn.textContent = 'Read more';
      toggleBtn.classList.remove('expanded');
      card.classList.remove('expanded');
    } else {
      toggleBtn.textContent = 'Hide';
      toggleBtn.classList.add('expanded');
      card.classList.add('expanded');
    }
  });
}

// ==============================
// NOT READY NOTICES
// ==============================
function initNotReadyNotices() {
  const notReady = () => {
    const box = document.getElementById('notReady');
    if (!box) return;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Add click listeners to all login/signup buttons
  ['loginBtn', 'signupBtn', 'signupBtn2', 'signupBtn3', 'loginBtn_m', 'signupBtn_m'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', notReady);
  });
}
