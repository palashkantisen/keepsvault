// ==============================
// PAGE TRANSLATION SYSTEM - PRIVACY PAGE
// ==============================

// Global state
let currentTranslations = null;
let isLoadingPageLanguage = false;

// Load page-specific language file
async function loadPageLanguage(languageCode) {
  if (isLoadingPageLanguage) return;
  
  try {
    isLoadingPageLanguage = true;
    console.log(`🌐 Loading page language: ${languageCode} for privacy page`);
    
    const response = await fetch(`assets/locales/pages/privacy-${languageCode}.json`);
    if (!response.ok) {
      throw new Error(`Page HTTP ${response.status}: ${response.statusText}`);
    }
    
    const pageTranslations = await response.json();
    console.log(`✅ Page language loaded: ${languageCode} for privacy (${Object.keys(pageTranslations).length} sections)`);
    return pageTranslations;
  } catch (error) {
    console.error(`❌ Failed to load page language ${languageCode}:`, error);
    
    // Fallback to English
    if (languageCode !== 'en') {
      console.log(`🔄 Falling back to English for page content`);
      return await loadPageLanguage('en');
    }
    
    throw error;
  } finally {
    isLoadingPageLanguage = false;
  }
}

// Get current language from shared system
function getCurrentLanguage() {
  return localStorage.getItem('kv-language') || 'en';
}

// Update page content only (navigation/footer handled by shared system)
function updatePageText() {
  if (!currentTranslations) return;
  
  // Update meta tags
  updateMetaTags();
  
  // Update main content
  updateMainContent();
}

// Update meta tags
function updateMetaTags() {
  if (!currentTranslations.meta) return;
  
  document.title = currentTranslations.meta.title;
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = currentTranslations.meta.description;
  }
  
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.content = currentTranslations.meta.title;
  }
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.content = currentTranslations.meta.description;
  }
}

// Update main content
function updateMainContent() {
  if (!currentTranslations) return;
  
  // Update Privacy page content
  if (currentTranslations.privacy) {
    updateElement('privacy-title', currentTranslations.privacy.title);
    updateElement('privacy-last-updated', currentTranslations.privacy.lastUpdated);
    updateElement('privacy-intro', currentTranslations.privacy.intro);
    
    // Information we collect
    updateElement('privacy-info-title', currentTranslations.privacy.infoWeCollect.title);
    updateElement('privacy-info-desc', currentTranslations.privacy.infoWeCollect.description);
    updateList('privacy-info-list', currentTranslations.privacy.infoWeCollect.list);
    
    // How we use information
    updateElement('privacy-use-title', currentTranslations.privacy.howWeUse.title);
    updateElement('privacy-use-desc', currentTranslations.privacy.howWeUse.description);
    updateList('privacy-use-list', currentTranslations.privacy.howWeUse.list);
    
    // Data security
    updateElement('privacy-security-title', currentTranslations.privacy.dataSecurity.title);
    updateElement('privacy-security-desc', currentTranslations.privacy.dataSecurity.description);
    updateList('privacy-security-list', currentTranslations.privacy.dataSecurity.list);
    
    // Your rights
    updateElement('privacy-rights-title', currentTranslations.privacy.yourRights.title);
    updateElement('privacy-rights-desc', currentTranslations.privacy.yourRights.description);
    updateList('privacy-rights-list', currentTranslations.privacy.yourRights.list);
    
    // Contact us
    updateElement('privacy-contact-title', currentTranslations.privacy.contactUs.title);
    updateElement('privacy-contact-desc', currentTranslations.privacy.contactUs.description);
  }
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

// Helper function to update list
function updateList(id, items) {
  const element = document.getElementById(id);
  if (element && items && Array.isArray(items)) {
    element.innerHTML = items.map(item => `<li>${item}</li>`).join('');
  }
}

// Initialize page language system
async function initPageLanguageSystem() {
  try {
    const currentLang = getCurrentLanguage();
    console.log(`🌐 Initializing page language system: ${currentLang} for privacy page`);
    
    // Load the initial page language
    const translations = await loadPageLanguage(currentLang);
    currentTranslations = translations;
    
    // Update page text
    updatePageText();
    
    console.log(`✅ Page language system initialized: ${currentLang} for privacy page`);
  } catch (error) {
    console.error('❌ Page language system initialization failed:', error);
    // Fallback to English
    try {
      const translations = await loadPageLanguage('en');
      currentTranslations = translations;
      updatePageText();
    } catch (fallbackError) {
      console.error('❌ Fallback to English failed:', fallbackError);
    }
  }
}

// Initialize page language system when DOM is ready
document.addEventListener('DOMContentLoaded', initPageLanguageSystem);

// Listen for language changes from shared system
window.addEventListener('languageChanged', async (event) => {
  const { language } = event.detail;
  console.log(`🌐 PRIVACY PAGE received language change: ${language}`);
  
  try {
    // Load page-specific content for the new language
    const translations = await loadPageLanguage(language);
    currentTranslations = translations;
    
    // Update page content
    updatePageText();
    
    console.log(`✅ PRIVACY PAGE updated for language: ${language}`);
  } catch (error) {
    console.error(`❌ Failed to update PRIVACY PAGE for language ${language}:`, error);
  }
});

// Export functions for global access
window.loadPageLanguage = loadPageLanguage;