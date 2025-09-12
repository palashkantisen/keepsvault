// Common JavaScript functions

// Initialize footer year
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

const lastUpdatedElement = document.getElementById('last-updated');
if (lastUpdatedElement) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  lastUpdatedElement.textContent = new Date().toLocaleDateString(undefined, options);
}

// Define constants for last updated dates
const LAST_UPDATED_PRIVACY = 'October 10, 2023';
const LAST_UPDATED_TERMS = 'October 10, 2023';
const MFA_PLANNED_DATE = 'Q4 2025';

// Set last updated dates
const lastUpdatedPrivacy = document.getElementById('last-updated-privacy');
const lastUpdatedTerms = document.getElementById('last-updated-terms');
const mfaPlanned = document.getElementById('mfa-planned');

if (lastUpdatedPrivacy) lastUpdatedPrivacy.textContent = LAST_UPDATED_PRIVACY;
if (lastUpdatedTerms) lastUpdatedTerms.textContent = LAST_UPDATED_TERMS;
if (mfaPlanned) mfaPlanned.textContent = MFA_PLANNED_DATE;

// ==============================
// THEME HANDLING
// ==============================
const THEMES = ['theme-blue', 'theme-amber', 'theme-emerald', 'theme-light'];

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

// Initialize mobile menu
function initMobileMenu() {
  const btn = document.querySelector('.menu-btn');
  const drawer = document.getElementById('menuDrawer');
  if (!btn || !drawer) return;

  const toggle = () => {
    const isHidden = drawer.hasAttribute('hidden');
    if (isHidden) {
      drawer.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  };

  btn.addEventListener('click', toggle);

  drawer.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !btn.contains(e.target)) {
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Call the functions to initialize
document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      initMobileMenu();
      initTheme(); // Reinitialize theme here
      // Initialize language after header is loaded
      if (window.initLanguage) {
        window.initLanguage();
      }
    });
  initExpandableCards();
});

// Other shared scripts can be added here
