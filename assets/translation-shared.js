// ==============================
// SHARED TRANSLATION SYSTEM
// ==============================

// Supported languages
const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' }
];

// Global state
let sharedTranslations = null;
let currentLanguage = 'en';
let isLoadingLanguage = false;

// Load shared language file
async function loadSharedLanguage(languageCode) {
  if (isLoadingLanguage) return;
  
  try {
    isLoadingLanguage = true;
    console.log(`🌐 Loading shared language: ${languageCode}`);
    
    const response = await fetch(`assets/locales/shared-${languageCode}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const translations = await response.json();
    console.log(`✅ Shared language loaded: ${languageCode} (${Object.keys(translations).length} sections)`);
    return translations;
  } catch (error) {
    console.error(`❌ Failed to load shared language ${languageCode}:`, error);
    
    // Fallback to English
    if (languageCode !== 'en') {
      console.log(`🔄 Falling back to English for shared content`);
      return await loadSharedLanguage('en');
    }
    
    throw error;
  } finally {
    isLoadingLanguage = false;
  }
}

// Detect browser language
function detectBrowserLanguage() {
  try {
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = SUPPORTED_LANGUAGES.find(l => l.code === browserLang);
    return supportedLang ? supportedLang.code : 'en';
  } catch (error) {
    console.error('❌ Language detection failed:', error);
    return 'en';
  }
}

// Update navigation
function updateNavigation() {
  if (!sharedTranslations || !sharedTranslations.navigation) return;
  
  const navItems = {
    // Desktop navigation
    'nav-home': sharedTranslations.navigation.home,
    'nav-features': sharedTranslations.navigation.features,
    'nav-pricing': sharedTranslations.navigation.pricing,
    'nav-about': sharedTranslations.navigation.about,
    'nav-story': sharedTranslations.navigation.story,
    'nav-privacy': sharedTranslations.navigation.privacy,
    'nav-terms': sharedTranslations.navigation.terms,
    'nav-security': sharedTranslations.navigation.security,
    'nav-status': sharedTranslations.navigation.status,
    'nav-contact': sharedTranslations.navigation.contact,
    'nav-waitlist': sharedTranslations.navigation.waitlist,
    'nav-login': sharedTranslations.navigation.login,
    'nav-signup': sharedTranslations.navigation.waitlist,
    
    // Mobile navigation
    'nav-home-mobile': sharedTranslations.navigation.home,
    'nav-features-mobile': sharedTranslations.navigation.features,
    'nav-pricing-mobile': sharedTranslations.navigation.pricing,
    'nav-about-mobile': sharedTranslations.navigation.about,
    'nav-story-mobile': sharedTranslations.navigation.story,
    'nav-privacy-mobile': sharedTranslations.navigation.privacy,
    'nav-terms-mobile': sharedTranslations.navigation.terms,
    'nav-security-mobile': sharedTranslations.navigation.security,
    'nav-status-mobile': sharedTranslations.navigation.status,
    'nav-contact-mobile': sharedTranslations.navigation.contact,
    'nav-waitlist-mobile': sharedTranslations.navigation.waitlist,
    'nav-login-mobile': sharedTranslations.navigation.login,
    'nav-signup-mobile': sharedTranslations.navigation.waitlist
  };
  
  Object.entries(navItems).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  });
}

// Update footer
function updateFooter() {
  if (!sharedTranslations || !sharedTranslations.footer) return;
  
  updateElement('footer-copyright', sharedTranslations.footer.copyright);
  updateElement('footer-made-with', sharedTranslations.footer.madeWith);
  
  // Update footer links
  const footerLinks = {
    'footer-home': sharedTranslations.footer.home,
    'footer-features': sharedTranslations.footer.features,
    'footer-pricing': sharedTranslations.footer.pricing,
    'footer-about': sharedTranslations.footer.about,
    'footer-story': sharedTranslations.footer.story,
    'footer-privacy': sharedTranslations.footer.privacy,
    'footer-terms': sharedTranslations.footer.terms,
    'footer-security': sharedTranslations.footer.security,
    'footer-status': sharedTranslations.footer.status,
    'footer-contact': sharedTranslations.footer.contact
  };
  
  Object.entries(footerLinks).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element && text) {
      element.textContent = text;
    }
  });
}

// Helper function to update element text
function updateElement(id, text, isHTML = false) {
  const element = document.getElementById(id);
  if (element && text) {
    if (isHTML) {
      element.innerHTML = text;
    } else {
      element.textContent = text;
    }
  }
}

// Update language switcher UI
function updateLanguageSwitcher() {
  const switcher = document.querySelector('#languageSwitch');
  const switcherMobile = document.querySelector('#languageSwitch_m');
  
  if (switcher) {
    switcher.value = currentLanguage;
  }
  if (switcherMobile) {
    switcherMobile.value = currentLanguage;
  }
}

// Apply language (similar to applyTheme)
async function applyLanguage(langCode) {
  try {
    console.log(`🌐 Applying language: ${langCode}`);
    
    // Load the shared language
    const translations = await loadSharedLanguage(langCode);
    sharedTranslations = translations;
    currentLanguage = langCode;
    
    // Update shared content
    updateNavigation();
    updateFooter();
    updateLanguageSwitcher();
    
    console.log(`✅ Language applied: ${langCode}`);
  } catch (error) {
    console.error(`❌ Failed to apply language ${langCode}:`, error);
    // Fallback to English
    if (langCode !== 'en') {
      await applyLanguage('en');
    }
  }
}

// Initialize language system (following theme pattern)
function initLanguage() {
  try {
    const saved = localStorage.getItem('kv-language') || '';
    const detectedLang = detectBrowserLanguage();
    const initialLang = saved || detectedLang;
    
    if (initialLang) {
      applyLanguage(initialLang);
    }

    // Get both language selectors (desktop and mobile)
    const selectDesktop = document.getElementById('languageSwitch');
    const selectMobile = document.getElementById('languageSwitch_m');

    // Set initial values
    if (initialLang) {
      if (selectDesktop) selectDesktop.value = initialLang;
      if (selectMobile) selectMobile.value = initialLang;
    }

    // Add change listeners
    const onChange = async (e) => {
      const val = e.target.value;
      await switchLanguage(val);
      
      // Keep both selects in sync
      const otherId = e.target.id === 'languageSwitch' ? 'languageSwitch_m' : 'languageSwitch';
      const other = document.getElementById(otherId);
      if (other) other.value = val;
    };

    if (selectDesktop) selectDesktop.addEventListener('change', onChange);
    if (selectMobile) selectMobile.addEventListener('change', onChange);
  } catch (e) {
    console.error('Language init failed', e);
  }
}

// Switch language function for header
async function switchLanguage(languageCode) {
  console.log(`🌐 Switching to language: ${languageCode}`);
  await applyLanguage(languageCode);
  localStorage.setItem('kv-language', languageCode);
  
  // Notify page systems to update
  console.log(`🌐 Dispatching languageChanged event for: ${languageCode}`);
  const event = new CustomEvent('languageChanged', { 
    detail: { language: languageCode } 
  });
  window.dispatchEvent(event);
  console.log(`✅ languageChanged event dispatched for: ${languageCode}`);
  
  // Test if any listeners are attached
  console.log(`🔍 Event listeners count:`, window.addEventListener.toString());
}

// Export functions for global access
window.updateSharedNavigation = updateNavigation;
window.updateSharedFooter = updateFooter;
window.updateSharedLanguageSwitcher = updateLanguageSwitcher;
window.initLanguage = initLanguage;
window.applyLanguage = applyLanguage;
window.loadSharedLanguage = loadSharedLanguage;
window.switchLanguage = switchLanguage;
