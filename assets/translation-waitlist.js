// ==============================
// PAGE TRANSLATION SYSTEM - WAITLIST PAGE
// ==============================

// Global state
let currentTranslations = null;
let isLoadingPageLanguage = false;

// Load page-specific language file
async function loadPageLanguage(languageCode) {
  if (isLoadingPageLanguage) return;
  
  try {
    isLoadingPageLanguage = true;
    console.log(`🌐 Loading page language: ${languageCode} for waitlist page`);
    
    const response = await fetch(`assets/locales/pages/waitlist-${languageCode}.json`);
    if (!response.ok) {
      throw new Error(`Page HTTP ${response.status}: ${response.statusText}`);
    }
    
    const pageTranslations = await response.json();
    console.log(`✅ Page language loaded: ${languageCode} for waitlist (${Object.keys(pageTranslations).length} sections)`);
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
  
  // Update Waitlist page content
  if (currentTranslations.waitlist) {
    updateElement('waitlist-title', currentTranslations.waitlist.title);
    updateElement('waitlist-subtitle', currentTranslations.waitlist.subtitle);
    updateElement('waitlist-description', currentTranslations.waitlist.description);
    
    // Form elements
    updateElement('waitlist-form-title', currentTranslations.waitlist.form?.title);
    updateElement('waitlist-email-label', currentTranslations.waitlist.form?.emailLabel);
    updateElement('waitlist-email-placeholder', currentTranslations.waitlist.form?.emailPlaceholder);
    updateElement('waitlist-name-label', currentTranslations.waitlist.form?.nameLabel);
    updateElement('waitlist-name-placeholder', currentTranslations.waitlist.form?.namePlaceholder);
    updateElement('waitlist-submit-button', currentTranslations.waitlist.form?.submitButton);
    
    // Benefits section
    updateElement('waitlist-benefits-title', currentTranslations.waitlist.benefits?.title);
    updateList('waitlist-benefits-list', currentTranslations.waitlist.benefits?.list);
    
    // FAQ section
    updateElement('waitlist-faq-title', currentTranslations.waitlist.faq?.title);
    updateElement('waitlist-faq-q1', currentTranslations.waitlist.faq?.q1);
    updateElement('waitlist-faq-a1', currentTranslations.waitlist.faq?.a1);
    updateElement('waitlist-faq-q2', currentTranslations.waitlist.faq?.q2);
    updateElement('waitlist-faq-a2', currentTranslations.waitlist.faq?.a2);
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
    console.log(`🌐 Initializing page language system: ${currentLang} for waitlist page`);
    
    // Load the initial page language
    const translations = await loadPageLanguage(currentLang);
    currentTranslations = translations;
    
    // Update page text
    updatePageText();
    
    console.log(`✅ Page language system initialized: ${currentLang} for waitlist page`);
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
  console.log(`🌐 Page received language change: ${language}`);
  
  try {
    // Load page-specific content for the new language
    const translations = await loadPageLanguage(language);
    currentTranslations = translations;
    
    // Update page content
    updatePageText();
    
    console.log(`✅ Page updated for language: ${language}`);
  } catch (error) {
    console.error(`❌ Failed to update page for language ${language}:`, error);
  }
});

// Export functions for global access
window.loadPageLanguage = loadPageLanguage;