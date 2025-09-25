// ==============================
// PAGE TRANSLATION SYSTEM - STORY PAGE
// ==============================

// Global state
let currentTranslations = null;

// Load page-specific language file
async function loadPageLanguage(languageCode) {
  try {
    
    const response = await fetch(`assets/locales/pages/story-${languageCode}.json`);
    if (!response.ok) {
      throw new Error(`Page HTTP ${response.status}: ${response.statusText}`);
    }
    
    const pageTranslations = await response.json();
    return pageTranslations;
  } catch (error) {
    
    // Fallback to English
    if (languageCode !== 'en') {
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
  
  // Update Story page content
  if (currentTranslations.story) {
    updateElement('story-title', currentTranslations.story.title);
    
    // Beginning section
    updateElement('story-beginning-title', currentTranslations.story.beginning.title);
    updateElement('story-beginning-p1', currentTranslations.story.beginning.p1);
    updateElement('story-beginning-p2', currentTranslations.story.beginning.p2);
    updateElement('story-beginning-p3', currentTranslations.story.beginning.p3);
    
    // Truth section
    updateElement('story-truth-title', currentTranslations.story.truth.title);
    updateElement('story-truth-p1', currentTranslations.story.truth.p1);
    updateElement('story-truth-p2', currentTranslations.story.truth.p2);
    updateList('story-truth-list', currentTranslations.story.truth.list);
    
    // Why section
    updateElement('story-why-title', currentTranslations.story.why.title);
    updateElement('story-why-p1', currentTranslations.story.why.p1);
    updateElement('story-why-p2', currentTranslations.story.why.p2);
    updateList('story-why-list', currentTranslations.story.why.list);
    
    // Mission section
    updateElement('story-mission-title', currentTranslations.story.mission.title);
    updateElement('story-mission-p1', currentTranslations.story.mission.p1);
    updateElement('story-mission-p2', currentTranslations.story.mission.p2);
    updateList('story-mission-list', currentTranslations.story.mission.list);
    
    // Transform section
    updateElement('story-transform-title', currentTranslations.story.transform.title);
    updateElement('story-transform-p1', currentTranslations.story.transform.p1);
    updateElement('story-transform-p2', currentTranslations.story.transform.p2);
    updateList('story-transform-list', currentTranslations.story.transform.list);
    
    // Join section
    updateElement('story-join-title', currentTranslations.story.join.title);
    updateElement('story-join-p1', currentTranslations.story.join.p1);
    updateElement('story-join-p2', currentTranslations.story.join.p2);
    updateElement('story-join-p3', currentTranslations.story.join.p3);
    updateElement('story-join-p4', currentTranslations.story.join.p4);
    updateElement('story-join-signature', currentTranslations.story.join.signature);
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
    console.log(`🌐 Initializing page language system: ${currentLang} for story page`);
    
    // Load the initial page language
    const translations = await loadPageLanguage(currentLang);
    currentTranslations = translations;
    
    // Update page text
    updatePageText();
    
    console.log(`✅ Page language system initialized: ${currentLang} for story page`);
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

// Listen for language changes from shared system (attach immediately)
// Page content update function
async function updatePageContent(languageCode) {
  console.log(`🌐 STORY PAGE: Updating content for language: ${languageCode}`);
  
  try {
    // Load page-specific content for the new language
    const translations = await loadPageLanguage(languageCode);
    currentTranslations = translations;
    
    // Update page content
    updatePageText();
    
    console.log(`✅ STORY PAGE updated for language: ${languageCode}`);
  } catch (error) {
    console.error(`❌ Failed to update STORY PAGE for language ${languageCode}:`, error);
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

// Initialize page language system when DOM is ready
document.addEventListener('DOMContentLoaded', initPageLanguageSystem);

// Export functions for global access
window.loadPageLanguage = loadPageLanguage;
