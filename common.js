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

// Other shared scripts can be added here
