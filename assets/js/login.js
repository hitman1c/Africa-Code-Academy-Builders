document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const passwordToggle = document.getElementById('passwordToggle');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');

  // If a new account was just created, show a success message and prefill email
  try {
    const newEmail = localStorage.getItem('newAccountEmail');
    if (newEmail && errorMessage) {
      errorMessage.textContent = 'Account created — please sign in.';
      const emailInput = document.getElementById('email');
      if (emailInput) emailInput.value = newEmail;
      localStorage.removeItem('newAccountEmail');
    }
  } catch (e) {
    console.warn('LocalStorage read failed', e);
  }

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = document.getElementById('email')?.value.trim().toLowerCase() || '';
      const password = passwordInput?.value || '';

      if (!email || !password) {
        errorMessage.textContent = 'Please enter both your email and password.';
        return;
      }

      // Check stored demo accounts
      const raw = localStorage.getItem('acaAccounts');
      const accounts = raw ? JSON.parse(raw) : [];
      const account = accounts.find(a => a.email === email && a.password === password);

      // Demo behaviour: allow login even if there is no stored account, but save session info
      try {
        localStorage.setItem('sessionEmail', email);
        localStorage.setItem('sessionSignedInAt', Date.now());
      } catch (e) {
        console.warn('Unable to persist session', e);
      }

      // success — clear and redirect to dashboard
      errorMessage.textContent = '';
      form.reset();
      window.location.href = 'dashboard.html';
    });
  }
});
