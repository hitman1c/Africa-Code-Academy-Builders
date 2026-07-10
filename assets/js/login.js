document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const passwordToggle = document.getElementById('passwordToggle');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');

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

      const email = document.getElementById('email')?.value.trim() || '';
      const password = passwordInput?.value || '';

      if (!email || !password) {
        errorMessage.textContent = 'Please enter both your email and password.';
        return;
      }

      errorMessage.textContent = '';
      form.reset();
      window.location.href = 'home.html';
    });
  }
});
