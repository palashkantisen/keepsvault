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
    updateElement('waitlist-form-nameLabel', currentTranslations.waitlist.form?.nameLabel);
    updateElement('waitlist-form-emailLabel', currentTranslations.waitlist.form?.emailLabel);
    updateElement('waitlist-form-planLabel', currentTranslations.waitlist.form?.planLabel);
    updateElement('waitlist-form-freeLabel', currentTranslations.waitlist.form?.freeLabel);
    updateElement('waitlist-form-premiumLabel', currentTranslations.waitlist.form?.premiumLabel);
    updateElement('waitlist-form-notsureLabel', currentTranslations.waitlist.form?.notsureLabel);
    updateElement('waitlist-form-usageLabel', currentTranslations.waitlist.form?.usageLabel);
    updateElement('waitlist-form-countryLabel', currentTranslations.waitlist.form?.countryLabel);
    updateElement('waitlist-form-submitButton', currentTranslations.waitlist.form?.submitButton);
    
    // Update placeholders
    updatePlaceholder('g-name', currentTranslations.waitlist.form?.namePlaceholder);
    updatePlaceholder('g-email', currentTranslations.waitlist.form?.emailPlaceholder);
    updatePlaceholder('g-usage', currentTranslations.waitlist.form?.usagePlaceholder);
    
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

// Helper function to update placeholder
function updatePlaceholder(id, placeholder) {
  const element = document.getElementById(id);
  if (element && placeholder) {
    element.placeholder = placeholder;
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

// Page content update function
async function updatePageContent(languageCode) {
  console.log(`🌐 WAITLIST PAGE: Updating content for language: ${languageCode}`);
  
  try {
    // Load page-specific content for the new language
    const translations = await loadPageLanguage(languageCode);
    currentTranslations = translations;
    
    // Update page content
    updatePageText();
    
    console.log(`✅ WAITLIST PAGE updated for language: ${languageCode}`);
  } catch (error) {
    console.error(`❌ Failed to update WAITLIST PAGE for language ${languageCode}:`, error);
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