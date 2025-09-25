// ==============================
// PAGE TRANSLATION SYSTEM - SECURITY PAGE
// ==============================

// Global state
let currentTranslations = null;

// Load page-specific language file
async function loadPageLanguage(languageCode) {
  try {
    console.log(`🌐 Loading page language: ${languageCode} for security page`);
    
    const response = await fetch(`assets/locales/pages/security-${languageCode}.json`);
    if (!response.ok) {
      throw new Error(`Page HTTP ${response.status}: ${response.statusText}`);
    }
    
    const pageTranslations = await response.json();
    console.log(`✅ Page language loaded: ${languageCode} for security (${Object.keys(pageTranslations).length} sections)`);
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
  
  // Update Security page content
  if (currentTranslations.security) {
    updateElement('security-title', currentTranslations.security.title);
    updateElement('security-last-updated', currentTranslations.security.lastUpdated);
    updateElement('security-intro', currentTranslations.security.intro);
    
    // Add more security sections as needed
    updateElement('security-encryption-title', currentTranslations.security.encryption?.title);
    updateElement('security-encryption-desc', currentTranslations.security.encryption?.description);
    
    updateElement('security-access-title', currentTranslations.security.access?.title);
    updateElement('security-access-desc', currentTranslations.security.access?.description);
    
    updateElement('security-monitoring-title', currentTranslations.security.monitoring?.title);
    updateElement('security-monitoring-desc', currentTranslations.security.monitoring?.description);
    
    updateElement('security-compliance-title', currentTranslations.security.compliance?.title);
    updateElement('security-compliance-desc', currentTranslations.security.compliance?.description);
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
    console.log(`🌐 Initializing page language system: ${currentLang} for security page`);
    
    // Load the initial page language
    const translations = await loadPageLanguage(currentLang);
    currentTranslations = translations;
    
    // Update page text
    updatePageText();
    
    console.log(`✅ Page language system initialized: ${currentLang} for security page`);
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
  console.log(`🌐 SECURITY PAGE: Updating content for language: ${languageCode}`);
  
  try {
    // Load page-specific content for the new language
    const translations = await loadPageLanguage(languageCode);
    currentTranslations = translations;
    
    // Update page content
    updatePageText();
    
    console.log(`✅ SECURITY PAGE updated for language: ${languageCode}`);
  } catch (error) {
    console.error(`❌ Failed to update SECURITY PAGE for language ${languageCode}:`, error);
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