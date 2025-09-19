// assets/js/script.js
document.addEventListener('DOMContentLoaded', () => {
  const regForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (regForm) regForm.addEventListener('submit', validateRegistrationForm);
  if (loginForm) loginForm.addEventListener('submit', validateLoginForm);

  // live password strength meter (registration)
  const regPassword = document.getElementById('regPassword');
  const meterBar = document.getElementById('passwordMeterBar');
  if (regPassword && meterBar) {
    regPassword.addEventListener('input', () => updatePasswordMeter(regPassword.value, meterBar));
  }
});

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
}

function clearError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '';
  el.classList.remove('visible');
}

function clearAllErrors(prefixes) {
  prefixes.forEach(p => {
    document.querySelectorAll(`[id^="${p}"]`).forEach(el => {
      el.textContent = ''; el.classList.remove('visible');
    });
  });
}

function validateRegistrationForm(e) {
  e.preventDefault();
  clearAllErrors(['reg', 'regPasswordError']);
  let ok = true;

  const username = document.getElementById('regUsername').value.trim();
  const emailInput = document.getElementById('regEmail');
  const email = emailInput.value.trim();
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  if (username === '') { showError('regUsernameError', 'Username is required'); ok = false; }
  if (email === '') { showError('regEmailError', 'Email is required'); ok = false; }
  else if (!emailInput.checkValidity()) { showError('regEmailError', 'Invalid email format (example: abc@xyz.com)'); ok = false; }

  // password: min 8 chars, at least 1 number, at least 1 special char
  const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (password === '') { showError('regPasswordError', 'Password is required'); ok = false; }
  else if (!passRegex.test(password)) {
    showError('regPasswordError', 'Password must be 8+ chars and include at least one number and one symbol (!@#$%^&*)');
    ok = false;
  }

  if (role === '') { showError('regRoleError', 'Please select a role'); ok = false; }

  if (ok) {
    // If you have backend routes, form will POST to /register.
    // For now, allow form to submit normally to the configured action:
    e.target.submit();
  }
}

function validateLoginForm(e) {
  e.preventDefault();
  clearAllErrors(['login']);
  const emailInput = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword').value;
  let ok = true;

  if (emailInput.value.trim() === '') { showError('loginEmailError', 'Email is required'); ok = false; }
  else if (!emailInput.checkValidity()) { showError('loginEmailError', 'Enter a valid email'); ok = false; }

  if (password === '') { showError('loginPasswordError', 'Password is required'); ok = false; }

  if (ok) {
    e.target.submit();
  }
}

function updatePasswordMeter(pw, meterBar) {
  // simple scoring: length + digits + symbols
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[!@#$%^&*]/.test(pw)) score += 1;
  const percent = (score / 3) * 100;
  meterBar.style.width = percent + '%';
}
