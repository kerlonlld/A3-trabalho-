/* ============================================================
   UNIQ — main.js  (Global JS)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initFadeIn();
  initToast();
  updateCartBadge();
  highlightActiveNav();
});

/* ─── Navbar scroll effect ─── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger / Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ─── Scroll progress bar ─── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

/* ─── Fade-in on scroll ─── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

/* ─── Toast notifications ─── */
let toastContainer;
function initToast() {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

function showToast(message, type = 'default', duration = 3000) {
  const icons = { default: '🛍️', success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.default}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ─── Cart (localStorage) ─── */
function getCart() {
  return JSON.parse(localStorage.getItem('uniq_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('uniq_cart', JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === product.id && i.color === product.color && i.size === product.size);
  if (idx > -1) {
    cart[idx].qty = (cart[idx].qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast(`"${product.name}" adicionado ao carrinho!`, 'success');
}

function removeFromCart(id, color, size) {
  let cart = getCart();
  cart = cart.filter(i => !(i.id === id && i.color === color && i.size === size));
  saveCart(cart);
}

function updateQty(id, color, size, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id && i.color === color && i.size === size);
  if (idx > -1) {
    cart[idx].qty = Math.max(1, (cart[idx].qty || 1) + delta);
    saveCart(cart);
  }
}

/* ─── Active nav link ─── */
function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ─── Format currency ─── */
function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
