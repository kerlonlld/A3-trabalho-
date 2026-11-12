import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, firebaseConfigError } from './firebase.js';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const message = document.getElementById('auth-message');
const loginButton = document.getElementById('login-submit');
const signupButton = document.getElementById('signup-submit');
const googleButton = document.getElementById('google-login');
const resetButton = document.getElementById('reset-password');
const signOutButton = document.getElementById('sign-out');
const signedInPanel = document.getElementById('signed-in-panel');
const forms = document.getElementById('auth-forms');

document.querySelectorAll('.login-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const showLogin = tab.dataset.tab === 'login';
    document.querySelectorAll('.login-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    loginForm.classList.toggle('active', showLogin);
    signupForm.classList.toggle('active', !showLogin);
    message.hidden = true;
  });
});

document.querySelectorAll('[data-toggle-password]').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.togglePassword);
    const icon = button.querySelector('i');
    input.type = input.type === 'password' ? 'text' : 'password';
    icon.className = input.type === 'password'
      ? 'fa-regular fa-eye'
      : 'fa-regular fa-eye-slash';
  });
});

function showMessage(text, type = 'error') {
  message.textContent = text;
  message.dataset.type = type;
  message.hidden = false;
}

function showAuthError(error) {
  const errors = {
    'auth/email-already-in-use': 'Este e-mail já possui uma conta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/invalid-email': 'Informe um endereço de e-mail válido.',
    'auth/operation-not-allowed': 'Este método de acesso ainda não foi habilitado no Firebase.',
    'auth/popup-closed-by-user': 'A janela de acesso com Google foi fechada.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/weak-password': 'A senha é fraca. Use pelo menos 6 caracteres.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Não existe conta para este e-mail.',
  };
  showMessage(errors[error.code] || `Não foi possível concluir o acesso: ${error.message}`);
}

function requireAuth() {
  if (auth) return true;
  showMessage(firebaseConfigError);
  return false;
}

async function withBusyButton(button, busyText, action) {
  const originalContent = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${busyText}`;
  message.hidden = true;

  try {
    await action();
  } catch (error) {
    showAuthError(error);
  } finally {
    button.disabled = false;
    button.innerHTML = originalContent;
  }
}

function getPersistence() {
  return document.getElementById('remember-me').checked
    ? browserLocalPersistence
    : browserSessionPersistence;
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requireAuth()) return;

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  void withBusyButton(loginButton, 'Entrando...', async () => {
    await setPersistence(auth, getPersistence());
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  });
});

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requireAuth()) return;

  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('cad-password').value;
  const confirmation = document.getElementById('cad-password2').value;

  if (password.length < 6) {
    showMessage('A senha precisa ter pelo menos 6 caracteres.');
    return;
  }
  if (password !== confirmation) {
    showMessage('As senhas não coincidem.');
    return;
  }

  void withBusyButton(signupButton, 'Criando conta...', async () => {
    await setPersistence(auth, getPersistence());
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    window.location.href = 'index.html';
  });
});

googleButton.addEventListener('click', () => {
  if (!requireAuth()) return;

  void withBusyButton(googleButton, 'Conectando...', async () => {
    await setPersistence(auth, getPersistence());
    await signInWithPopup(auth, new GoogleAuthProvider());
    window.location.href = 'index.html';
  });
});

resetButton.addEventListener('click', () => {
  if (!requireAuth()) return;

  const email = document.getElementById('login-email').value.trim();
  if (!email) {
    showMessage('Informe seu e-mail para receber o link de redefinição.');
    document.getElementById('login-email').focus();
    return;
  }

  void withBusyButton(resetButton, 'Enviando...', async () => {
    await sendPasswordResetEmail(auth, email);
    showMessage('Enviamos um link de redefinição para seu e-mail.', 'success');
  });
});

signOutButton.addEventListener('click', () => {
  if (!requireAuth()) return;
  void withBusyButton(signOutButton, 'Saindo...', async () => {
    await signOut(auth);
  });
});

if (auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      forms.hidden = true;
      signedInPanel.hidden = false;
      document.getElementById('signed-in-email').textContent = user.email;
    } else {
      forms.hidden = false;
      signedInPanel.hidden = true;
    }
  });
} else {
  showMessage(firebaseConfigError);
}
