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

// Caching system for loaded languages
const languageCache = new Map();
const loadingPromises = new Map();
const pageCache = new Map();
const pageLoadingPromises = new Map();

// Load shared language file with caching and deduplication
async function loadSharedLanguage(languageCode) {
  const startTime = performance.now();
  
  // Check cache first
  if (languageCache.has(languageCode)) {
    const duration = Math.round(performance.now() - startTime);
    logPerformance('shared', duration, true);
    console.log(`📦 Using cached shared language: ${languageCode}`);
    return languageCache.get(languageCode);
  }
  
  // Check if already loading
  if (loadingPromises.has(languageCode)) {
    console.log(`⏳ Waiting for existing shared language load: ${languageCode}`);
    return await loadingPromises.get(languageCode);
  }
  
  // Create loading promise
  const loadingPromise = (async () => {
    try {
      console.log(`🌐 Loading shared language: ${languageCode}`);
      
      const response = await fetch(`assets/locales/shared-${languageCode}.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const translations = await response.json();
      const duration = Math.round(performance.now() - startTime);
      logPerformance('shared', duration, false);
      
      console.log(`✅ Shared language loaded: ${languageCode} (${Object.keys(translations).length} sections)`);
      
      // Cache the result
      languageCache.set(languageCode, translations);
      
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
      // Clean up loading promise
      loadingPromises.delete(languageCode);
    }
  })();
  
  // Store the promise to prevent duplicate requests
  loadingPromises.set(languageCode, loadingPromise);
  
  return await loadingPromise;
}

// Load page-specific language file with caching and deduplication
async function loadPageLanguage(pageName, languageCode) {
  const startTime = performance.now();
  const cacheKey = `${pageName}-${languageCode}`;
  
  // Check cache first
  if (pageCache.has(cacheKey)) {
    const duration = Math.round(performance.now() - startTime);
    logPerformance('page', duration, true);
    console.log(`📦 Using cached page language: ${pageName}-${languageCode}`);
    return pageCache.get(cacheKey);
  }
  
  // Check if already loading
  if (pageLoadingPromises.has(cacheKey)) {
    console.log(`⏳ Waiting for existing page language load: ${pageName}-${languageCode}`);
    return await pageLoadingPromises.get(cacheKey);
  }
  
  // Create loading promise
  const loadingPromise = (async () => {
    try {
      console.log(`🌐 Loading page language: ${pageName}-${languageCode}`);
      
      const response = await fetch(`assets/locales/pages/${pageName}-${languageCode}.json`);
      if (!response.ok) {
        throw new Error(`Page HTTP ${response.status}: ${response.statusText}`);
      }
      
      const translations = await response.json();
      const duration = Math.round(performance.now() - startTime);
      logPerformance('page', duration, false);
      
      console.log(`✅ Page language loaded: ${pageName}-${languageCode} (${Object.keys(translations).length} sections)`);
      
      // Cache the result
      pageCache.set(cacheKey, translations);
      
      return translations;
    } catch (error) {
      console.error(`❌ Failed to load page language ${pageName}-${languageCode}:`, error);
      
      // Fallback to English
      if (languageCode !== 'en') {
        console.log(`🔄 Falling back to English for page content: ${pageName}`);
        return await loadPageLanguage(pageName, 'en');
      }
      
      throw error;
    } finally {
      // Clean up loading promise
      pageLoadingPromises.delete(cacheKey);
    }
  })();
  
  // Store the promise to prevent duplicate requests
  pageLoadingPromises.set(cacheKey, loadingPromise);
  
  return await loadingPromise;
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
    window.currentLanguage = langCode;
    
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

// Set up event delegation for language switching (works even if elements are added later)
document.addEventListener('change', async (e) => {
  if (e.target.id === 'languageSwitch' || e.target.id === 'languageSwitch_m') {
    const val = e.target.value;
    console.log(`🌐 Language switch triggered: ${val}`);
    
    // Call switchLanguage if it's available
    if (window.switchLanguage) {
      await window.switchLanguage(val);
      
      // Keep both selects in sync
      const otherId = e.target.id === 'languageSwitch' ? 'languageSwitch_m' : 'languageSwitch';
      const other = document.getElementById(otherId);
      if (other) other.value = val;
    } else {
      console.error('❌ switchLanguage function not available yet');
    }
  }
});

// Page content update registry
const pageUpdateRegistry = [];

// Register a page update function
function registerPageUpdate(updateFunction) {
  pageUpdateRegistry.push(updateFunction);
  console.log(`📝 Registered page update function. Total: ${pageUpdateRegistry.length}`);
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
  
  // Trigger all registered page updates
  console.log(`🌐 Triggering ${pageUpdateRegistry.length} page content updates for: ${languageCode}`);
  for (const updateFunction of pageUpdateRegistry) {
    try {
      await updateFunction(languageCode);
    } catch (error) {
      console.error(`❌ Page update failed:`, error);
    }
  }
  console.log(`✅ All page content updates completed for: ${languageCode}`);
}

// Performance monitoring
const performanceStats = {
  sharedLoads: 0,
  pageLoads: 0,
  cacheHits: 0,
  totalLoadTime: 0,
  startTime: Date.now()
};

// Cache management functions
function clearLanguageCache() {
  languageCache.clear();
  pageCache.clear();
  console.log('🧹 Language cache cleared');
}

function getCacheStats() {
  return {
    sharedLanguages: languageCache.size,
    pageLanguages: pageCache.size,
    totalCached: languageCache.size + pageCache.size,
    performance: {
      sharedLoads: performanceStats.sharedLoads,
      pageLoads: performanceStats.pageLoads,
      cacheHits: performanceStats.cacheHits,
      averageLoadTime: performanceStats.totalLoadTime / (performanceStats.sharedLoads + performanceStats.pageLoads) || 0,
      uptime: Date.now() - performanceStats.startTime
    }
  };
}

// Performance logging
function logPerformance(operation, duration, fromCache = false) {
  if (fromCache) {
    performanceStats.cacheHits++;
  } else if (operation === 'shared') {
    performanceStats.sharedLoads++;
  } else if (operation === 'page') {
    performanceStats.pageLoads++;
  }
  
  performanceStats.totalLoadTime += duration;
  
  console.log(`📊 ${operation} load: ${duration}ms ${fromCache ? '(cached)' : '(network)'}`);
}

// Debug function to see what's currently loaded
function getLoadedLanguages() {
  const loaded = {
    shared: Array.from(languageCache.keys()),
    pages: Array.from(pageCache.keys()),
    currentlyLoading: {
      shared: Array.from(loadingPromises.keys()),
      pages: Array.from(pageLoadingPromises.keys())
    }
  };
  
  console.log('📋 Currently loaded languages:', loaded);
  return loaded;
}

// Ensure no preloading - only load what's needed
function validateNoPreloading() {
  const loaded = getLoadedLanguages();
  const currentLang = localStorage.getItem('kv-language') || 'en';
  
  // Check if we have more than necessary loaded
  const expectedShared = [currentLang];
  const expectedPages = []; // Will be populated based on current page
  
  const extraShared = loaded.shared.filter(lang => !expectedShared.includes(lang));
  const extraPages = loaded.pages.filter(page => !expectedPages.includes(page));
  
  if (extraShared.length > 0 || extraPages.length > 0) {
    console.warn('⚠️ Unnecessary languages loaded:', { extraShared, extraPages });
  } else {
    console.log('✅ No unnecessary preloading detected');
  }
  
  return { extraShared, extraPages };
}

// Export functions for global access
window.updateSharedNavigation = updateNavigation;
window.updateSharedFooter = updateFooter;
window.updateSharedLanguageSwitcher = updateLanguageSwitcher;
window.initLanguage = initLanguage;
window.applyLanguage = applyLanguage;
window.loadSharedLanguage = loadSharedLanguage;
window.loadPageLanguage = loadPageLanguage;
window.switchLanguage = switchLanguage;
window.registerPageUpdate = registerPageUpdate;
window.clearLanguageCache = clearLanguageCache;
window.getCacheStats = getCacheStats;
window.getLoadedLanguages = getLoadedLanguages;
window.validateNoPreloading = validateNoPreloading;
