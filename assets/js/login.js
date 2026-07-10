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
      if (!account) {
        errorMessage.textContent = 'Invalid email or password. If you just created an account, use the password you provided.';
        return;
      }

      // success — clear and redirect
      errorMessage.textContent = '';
      form.reset();
      // Could land on dashboard or home; use dashboard for signed-in users
      window.location.href = 'dashboard.html';
    });
  }
});
