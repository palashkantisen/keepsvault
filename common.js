// Common JavaScript functions

// Initialize footer year
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

const lastUpdatedElement = document.getElementById('last-updated');
if (lastUpdatedElement) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  lastUpdatedElement.textContent = new Date().toLocaleDateString(undefined, options);
}

// Define constants for last updated dates
const LAST_UPDATED_PRIVACY = 'October 10, 2023';
const LAST_UPDATED_TERMS = 'October 10, 2023';
const MFA_PLANNED_DATE = 'Q4 2025';

// Set last updated dates
const lastUpdatedPrivacy = document.getElementById('last-updated-privacy');
const lastUpdatedTerms = document.getElementById('last-updated-terms');
const mfaPlanned = document.getElementById('mfa-planned');

if (lastUpdatedPrivacy) lastUpdatedPrivacy.textContent = LAST_UPDATED_PRIVACY;
if (lastUpdatedTerms) lastUpdatedTerms.textContent = LAST_UPDATED_TERMS;
if (mfaPlanned) mfaPlanned.textContent = MFA_PLANNED_DATE;

// Initialize expandable cards
function initExpandableCards() {
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('[data-toggle]');
    if (!toggleBtn) return;
    
    const card = toggleBtn.closest('[data-expand]');
    if (!card) return;
    
    // Find the expandable content div (either hidden or visible)
    const expandableContent = card.querySelector('div.muted');
    if (!expandableContent) return;
    
    // Toggle the hidden state
    expandableContent.hidden = !expandableContent.hidden;
    
    // Update button text and classes based on current state
    if (expandableContent.hidden) {
      toggleBtn.textContent = 'Read more';
      toggleBtn.classList.remove('expanded');
      card.classList.remove('expanded');
    } else {
      toggleBtn.textContent = 'Hide';
      toggleBtn.classList.add('expanded');
      card.classList.add('expanded');
    }
  });
}

// Call the function to initialize
initExpandableCards();

// Other shared scripts can be added here
