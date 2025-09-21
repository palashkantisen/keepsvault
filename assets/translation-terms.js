// ==============================
// PAGE TRANSLATION SYSTEM - TERMS PAGE
// ==============================

// Global state
let currentTranslations = null;
let isLoadingPageLanguage = false;

// Load page-specific language file
async function loadPageLanguage(languageCode) {
  if (isLoadingPageLanguage) return;
  
  try {
    isLoadingPageLanguage = true;
    console.log(`🌐 Loading page language: ${languageCode} for terms page`);
    
    const response = await fetch(`assets/locales/pages/terms-${languageCode}.json`);
    if (!response.ok) {
      throw new Error(`Page HTTP ${response.status}: ${response.statusText}`);
    }
    
    const pageTranslations = await response.json();
    console.log(`✅ Page language loaded: ${languageCode} for terms (${Object.keys(pageTranslations).length} sections)`);
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
  
  // Update Terms page content
  if (currentTranslations.terms) {
    updateElement('terms-title', currentTranslations.terms.title);
    updateElement('terms-last-updated', currentTranslations.terms.lastUpdated);
    updateElement('terms-intro', currentTranslations.terms.intro);
    
    // Add more terms sections as needed
    updateElement('terms-acceptance-title', currentTranslations.terms.acceptance?.title);
    updateElement('terms-acceptance-desc', currentTranslations.terms.acceptance?.description);
    
    updateElement('terms-service-title', currentTranslations.terms.service?.title);
    updateElement('terms-service-desc', currentTranslations.terms.service?.description);
    
    updateElement('terms-user-title', currentTranslations.terms.user?.title);
    updateElement('terms-user-desc', currentTranslations.terms.user?.description);
    
    updateElement('terms-privacy-title', currentTranslations.terms.privacy?.title);
    updateElement('terms-privacy-desc', currentTranslations.terms.privacy?.description);
    
    updateElement('terms-liability-title', currentTranslations.terms.liability?.title);
    updateElement('terms-liability-desc', currentTranslations.terms.liability?.description);
    
    updateElement('terms-changes-title', currentTranslations.terms.changes?.title);
    updateElement('terms-changes-desc', currentTranslations.terms.changes?.description);
    
    updateElement('terms-contact-title', currentTranslations.terms.contact?.title);
    updateElement('terms-contact-desc', currentTranslations.terms.contact?.description);
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
    console.log(`🌐 Initializing page language system: ${currentLang} for terms page`);
    
    // Load the initial page language
    const translations = await loadPageLanguage(currentLang);
    currentTranslations = translations;
    
    // Update page text
    updatePageText();
    
    console.log(`✅ Page language system initialized: ${currentLang} for terms page`);
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

// Page content update function
async function updatePageContent(languageCode) {
  console.log(`🌐 TERMS PAGE: Updating content for language: ${languageCode}`);
  
  try {
    // Load page-specific content for the new language
    const translations = await loadPageLanguage(languageCode);
    currentTranslations = translations;
    
    // Update page content
    updatePageText();
    
    console.log(`✅ TERMS PAGE updated for language: ${languageCode}`);
  } catch (error) {
    console.error(`❌ Failed to update TERMS PAGE for language ${languageCode}:`, error);
  }
}

// Register the page update function with the shared system
if (window.registerPageUpdate) {
  window.registerPageUpdate(updatePageContent);
} else {
  // Fallback: register when the shared system is ready
  window.addEventListener('DOMContentLoaded', () => {
    if (window.registerPageUpdate) {
      window.registerPageUpdate(updatePageContent);
    }
  });
}

// Export functions for global access
window.loadPageLanguage = loadPageLanguage;