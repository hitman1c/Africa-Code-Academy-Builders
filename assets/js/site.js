// site-wide interactions: signup modal, accessibility helpers
document.addEventListener('DOMContentLoaded', () => {
  const openBtns = [
    document.getElementById('openSignupBtn'),
    document.getElementById('openSignupBtnNav'),
    document.getElementById('openSignupBtnCTA')
  ].filter(Boolean);

  const backdrop = document.getElementById('signupBackdrop');
  const modal = document.getElementById('signupModal');
  const closeBtn = document.getElementById('closeSignup');
  const cancelBtn = document.getElementById('cancelSignup');
  const signupForm = document.getElementById('signupForm');

  function openModal() {
    if (backdrop) backdrop.hidden = false;
    if (modal) modal.hidden = false;
    // trap focus: focus first input
    const first = modal.querySelector('input, textarea, button');
    if (first) first.focus();
  }

  function closeModal() {
    if (backdrop) backdrop.hidden = true;
    if (modal) modal.hidden = true;
  }

  openBtns.forEach(b => b.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Handle signup submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName')?.value.trim();
      const email = document.getElementById('signupEmail')?.value.trim().toLowerCase();
      const goal = document.getElementById('signupGoal')?.value.trim();
      const password = document.getElementById('signupPassword')?.value || '';
      const confirm = document.getElementById('signupPasswordConfirm')?.value || '';

      if (!name || !email || !goal || !password) {
        alert('Please complete all fields.');
        return;
      }
      if (password !== confirm) {
        alert('Passwords do not match.');
        return;
      }

      // Save account locally (demo only) — for production use an API
      try {
        const key = 'acaAccounts';
        const raw = localStorage.getItem(key);
        const accounts = raw ? JSON.parse(raw) : [];
        // prevent duplicate email
        const exists = accounts.find(a => a.email === email);
        if (exists) {
          alert('An account with that email already exists. Please login.');
          closeModal();
          window.location.href = 'login.html';
          return;
        }
        accounts.push({ name, email, goal, password, createdAt: Date.now() });
        localStorage.setItem(key, JSON.stringify(accounts));
        // flag for login page to show success + prefill
        localStorage.setItem('newAccountEmail', email);
        // redirect to login
        window.location.href = 'login.html';
      } catch (err) {
        console.error('Signup storage error', err);
        alert('Unable to create account locally.');
      }
    });
  }
});
