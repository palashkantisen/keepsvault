// ==============================
// PAGE TRANSLATION SYSTEM - INDEX PAGE
// ==============================

// Global state
let currentTranslations = null;
let isLoadingPageLanguage = false;

// Load page-specific language file
async function loadPageLanguage(languageCode) {
  if (isLoadingPageLanguage) return;
  
  try {
    isLoadingPageLanguage = true;
    console.log(`🌐 Loading page language: ${languageCode} for index page`);
    
    // Load only page-specific translations
    const response = await fetch(`assets/locales/pages/index-${languageCode}.json`);
    
    if (!response.ok) {
      throw new Error(`Page HTTP ${response.status}: ${response.statusText}`);
    }
    
    const pageTranslations = await response.json();
    
    console.log(`✅ Page language loaded: ${languageCode} for index (${Object.keys(pageTranslations).length} sections)`);
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
  if (!currentTranslations) {
    console.log('❌ No currentTranslations available for updateMainContent');
    return;
  }
  
  console.log('🔄 Updating main content with translations:', currentTranslations);
  
  // Update hero section
  if (currentTranslations.hero) {
    console.log('🔄 Updating hero section');
    updateElement('hero-kicker', currentTranslations.hero.kicker);
    updateElement('hero-title', currentTranslations.hero.title, true);
    updateElement('hero-subtitle', currentTranslations.hero.subtitle);
    updateElement('hero-try-free', currentTranslations.hero.tryFree);
    updateElement('hero-see-how', currentTranslations.hero.seeHow);
    updateElement('bar-privacy', currentTranslations.hero.privacyFirst);
    updateElement('bar-simple', currentTranslations.hero.simpleToUse);
    updateElement('bar-works', currentTranslations.hero.worksAnywhere);
  } else {
    console.log('❌ No hero translations found');
  }
  
  // Update How It Works section
  if (currentTranslations.howItWorks) {
    updateElement('how-title', currentTranslations.howItWorks.title);
    updateElement('step1-title', currentTranslations.howItWorks.step1.title);
    updateElement('step1-desc', currentTranslations.howItWorks.step1.description);
    updateElement('step2-title', currentTranslations.howItWorks.step2.title);
    updateElement('step2-desc', currentTranslations.howItWorks.step2.description);
    updateElement('step3-title', currentTranslations.howItWorks.step3.title);
    updateElement('step3-desc', currentTranslations.howItWorks.step3.description);
  }
  
  // Update Features section
  if (currentTranslations.features) {
    updateElement('features-title', currentTranslations.features.title);
    
    // Cards & Stacks
    updateElement('feature-cards-title', currentTranslations.features.cardsStacks.title);
    updateElement('feature-cards-desc', currentTranslations.features.cardsStacks.description);
    updateElement('feature-cards-readmore', currentTranslations.features.cardsStacks.readMore);
    updateList('feature-cards-details', currentTranslations.features.cardsStacks.details);
    
    // Secure Sharing
    updateElement('feature-sharing-title', currentTranslations.features.secureSharing.title);
    updateElement('feature-sharing-desc', currentTranslations.features.secureSharing.description);
    updateElement('feature-sharing-readmore', currentTranslations.features.secureSharing.readMore);
    updateList('feature-sharing-details', currentTranslations.features.secureSharing.details);
    
    // Files & Notes
    updateElement('feature-files-title', currentTranslations.features.filesNotes.title);
    updateElement('feature-files-desc', currentTranslations.features.filesNotes.description);
    updateElement('feature-files-readmore', currentTranslations.features.filesNotes.readMore);
    updateList('feature-files-details', currentTranslations.features.filesNotes.details);
    
    // Smart Reminders
    updateElement('feature-reminders-title', currentTranslations.features.smartReminders.title);
    updateElement('feature-reminders-desc', currentTranslations.features.smartReminders.description);
    updateElement('feature-reminders-readmore', currentTranslations.features.smartReminders.readMore);
    updateList('feature-reminders-details', currentTranslations.features.smartReminders.details);
    
    // Works Anywhere
    updateElement('feature-anywhere-title', currentTranslations.features.worksAnywhere.title);
    updateElement('feature-anywhere-desc', currentTranslations.features.worksAnywhere.description);
    updateElement('feature-anywhere-readmore', currentTranslations.features.worksAnywhere.readMore);
    updateList('feature-anywhere-details', currentTranslations.features.worksAnywhere.details);
    
    // Privacy by Design
    updateElement('feature-privacy-title', currentTranslations.features.privacyByDesign.title);
    updateElement('feature-privacy-desc', currentTranslations.features.privacyByDesign.description);
    updateElement('feature-privacy-readmore', currentTranslations.features.privacyByDesign.readMore);
    updateList('feature-privacy-details', currentTranslations.features.privacyByDesign.details);
  }
  
  // Update Why KeepsVault section
  if (currentTranslations.whyKeepsVault) {
    updateElement('why-title', currentTranslations.whyKeepsVault.title);
    updateElement('why-privacy-title', currentTranslations.whyKeepsVault.privacy.title);
    updateElement('why-privacy-desc', currentTranslations.whyKeepsVault.privacy.description);
    updateElement('why-privacy-readmore', currentTranslations.whyKeepsVault.privacy.readMore);
    updateList('why-privacy-details', currentTranslations.whyKeepsVault.privacy.details);
    
    updateElement('why-security-title', currentTranslations.whyKeepsVault.security.title);
    updateElement('why-security-desc', currentTranslations.whyKeepsVault.security.description);
    updateElement('why-security-readmore', currentTranslations.whyKeepsVault.security.readMore);
    updateList('why-security-details', currentTranslations.whyKeepsVault.security.details);
    
    updateElement('why-simplicity-title', currentTranslations.whyKeepsVault.simplicity.title);
    updateElement('why-simplicity-desc', currentTranslations.whyKeepsVault.simplicity.description);
    updateElement('why-simplicity-readmore', currentTranslations.whyKeepsVault.simplicity.readMore);
    updateList('why-simplicity-details', currentTranslations.whyKeepsVault.simplicity.details);
  }
  
  // Update Data Protection section
  if (currentTranslations.dataProtection) {
    updateElement('data-protection-title', currentTranslations.dataProtection.title);
    updateList('data-protection-details', currentTranslations.dataProtection.details);
    updateElement('data-protection-learn-more', currentTranslations.dataProtection.learnMore);
  }
  
  // Update Testimonials section
  if (currentTranslations.testimonials) {
    updateElement('testimonials-title', currentTranslations.testimonials.title);
    updateElement('testimonial1-text', currentTranslations.testimonials.testimonial1.text);
    updateElement('testimonial1-author', currentTranslations.testimonials.testimonial1.author);
    updateElement('testimonial2-text', currentTranslations.testimonials.testimonial2.text);
    updateElement('testimonial2-author', currentTranslations.testimonials.testimonial2.author);
    updateElement('testimonial3-text', currentTranslations.testimonials.testimonial3.text);
    updateElement('testimonial3-author', currentTranslations.testimonials.testimonial3.author);
  }
  
  // Update Pricing section
  if (currentTranslations.pricing) {
    updateElement('pricing-title', currentTranslations.pricing.title);
    updateElement('pricing-free-title', currentTranslations.pricing.free.title);
    updateElement('pricing-free-desc', currentTranslations.pricing.free.description);
    updateElement('pricing-free-price', currentTranslations.pricing.free.price);
    updateList('pricing-free-features', currentTranslations.pricing.free.features);
    updateElement('signupBtn2', currentTranslations.pricing.free.button);
    
    updateElement('pricing-premium-title', currentTranslations.pricing.premium.title);
    updateElement('pricing-premium-desc', currentTranslations.pricing.premium.description);
    updateElement('pricing-premium-price', currentTranslations.pricing.premium.price);
    updateList('pricing-premium-features', currentTranslations.pricing.premium.features);
    updateElement('signupBtn3', currentTranslations.pricing.premium.button);
  }
  
  // Update About section
  if (currentTranslations.about) {
    updateElement('about-title', currentTranslations.about.title);
    updateElement('about-description', currentTranslations.about.description);
  }
  
  // Update Help/FAQ section
  if (currentTranslations.help) {
    updateElement('help-title', currentTranslations.help.title);
    updateElement('help-what-is-card-q', currentTranslations.help.whatIsCard.question);
    updateElement('help-what-is-card-a', currentTranslations.help.whatIsCard.answer);
    updateElement('help-how-to-share-q', currentTranslations.help.howToShare.question);
    updateElement('help-how-to-share-a', currentTranslations.help.howToShare.answer);
    updateElement('help-can-others-edit-q', currentTranslations.help.canOthersEdit.question);
    updateElement('help-can-others-edit-a', currentTranslations.help.canOthersEdit.answer);
    updateElement('help-is-info-safe-q', currentTranslations.help.isInfoSafe.question);
    updateElement('help-is-info-safe-a', currentTranslations.help.isInfoSafe.answer);
  }
  
  // Update Contact section
  if (currentTranslations.contact) {
    updateElement('contact-title', currentTranslations.contact.title);
    updateElement('contact-form-name-label', currentTranslations.contact.form.name);
    updateElement('contact-form-email-label', currentTranslations.contact.form.email);
    updateElement('contact-form-message-label', currentTranslations.contact.form.message);
    updateElement('contact-form-send', currentTranslations.contact.form.send);
    updateElement('contact-other-ways-title', currentTranslations.contact.otherWays.title);
    updateElement('contact-other-ways-email', currentTranslations.contact.otherWays.email);
    updateElement('contact-other-ways-response', currentTranslations.contact.otherWays.responseTime);
  }
}

// Helper function to update element text
function updateElement(id, text, isHTML = false) {
  const element = document.getElementById(id);
  if (element && text) {
    console.log(`🔄 Updating element ${id}: "${text}"`);
    if (isHTML) {
      element.innerHTML = text;
    } else {
      element.textContent = text;
    }
  } else {
    console.log(`❌ Element not found or no text: ${id}`, { element: !!element, text });
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
    console.log(`🌐 Initializing page language system: ${currentLang} for index page`);
    
    // Load the initial page language
    const translations = await loadPageLanguage(currentLang);
    currentTranslations = translations;
    
    console.log(`📄 Page translations loaded:`, currentTranslations);
    
    // Update page text
    updatePageText();
    
    console.log(`✅ Page language system initialized: ${currentLang} for index page`);
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
console.log(`🔧 INDEX PAGE: Attaching languageChanged event listener`);
window.addEventListener('languageChanged', async (event) => {
  const { language } = event.detail;
  console.log(`🌐 INDEX PAGE received language change: ${language}`);
  
  try {
    // Load page-specific content for the new language
    const translations = await loadPageLanguage(language);
    currentTranslations = translations;
    
    // Update page content
    updatePageText();
    
    console.log(`✅ INDEX PAGE updated for language: ${language}`);
  } catch (error) {
    console.error(`❌ Failed to update INDEX PAGE for language ${language}:`, error);
  }
});
console.log(`✅ INDEX PAGE: Event listener attached`);


// Initialize page language system when DOM is ready
document.addEventListener('DOMContentLoaded', initPageLanguageSystem);

// Export functions for global access
window.loadPageLanguage = loadPageLanguage;
