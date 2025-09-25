// ==============================
// PAGE TRANSLATION SYSTEM - PRIVACY PAGE
// ==============================

// Global state
let currentTranslations = null;

// Load page-specific language file
async function loadPageLanguage(languageCode) {
  try {
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
    updateElement('privacy-intro', currentTranslations.privacy.intro);
    
    // What we collect
    updateElement('privacy-collect-title', currentTranslations.privacy.collect.title);
    updateList('privacy-collect-list', currentTranslations.privacy.collect.list);
    
    // How we use it
    updateElement('privacy-use-title', currentTranslations.privacy.use.title);
    updateList('privacy-use-list', currentTranslations.privacy.use.list);
    
    // Sharing
    updateElement('privacy-sharing-title', currentTranslations.privacy.sharing.title);
    updateList('privacy-sharing-list', currentTranslations.privacy.sharing.list);
    
    // Storage and location
    updateElement('privacy-storage-title', currentTranslations.privacy.storage.title);
    updateList('privacy-storage-list', currentTranslations.privacy.storage.list);
    
    // Your rights (GDPR)
    updateElement('privacy-rights-title', currentTranslations.privacy.rights.title);
    updateList('privacy-rights-list', currentTranslations.privacy.rights.list);
    
    // Your choices
    updateElement('privacy-choices-title', currentTranslations.privacy.choices.title);
    updateList('privacy-choices-list', currentTranslations.privacy.choices.list);
    
    // Contact
    updateElement('privacy-contact-title', currentTranslations.privacy.contact.title);
    updateElement('privacy-contact-email', currentTranslations.privacy.contact.email);
    updateElement('privacy-last-updated', currentTranslations.privacy.contact.lastUpdated);
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

// Page content update function
async function updatePageContent(languageCode) {
  console.log(`🌐 PRIVACY PAGE: Updating content for language: ${languageCode}`);
  
  try {
    // Load page-specific content for the new language
    const translations = await loadPageLanguage(languageCode);
    currentTranslations = translations;
    
    // Update page content
    updatePageText();
    
    console.log(`✅ PRIVACY PAGE updated for language: ${languageCode}`);
  } catch (error) {
    console.error(`❌ Failed to update PRIVACY PAGE for language ${languageCode}:`, error);
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