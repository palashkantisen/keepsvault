// ==============================
// INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Initialize "not ready" notices
  initNotReadyNotices();
});

// ==============================
// NOT READY NOTICES
// ==============================
function initNotReadyNotices() {
  const notReady = () => {
    const box = document.getElementById('notReady');
    if (!box) return;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Add click listeners to all login/signup buttons
  ['loginBtn', 'signupBtn', 'signupBtn2', 'signupBtn3', 'loginBtn_m', 'signupBtn_m'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', notReady);
  });
}
