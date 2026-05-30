/* ============================================================
   main.js — Shared utilities for the entire storefront
   ============================================================
   Responsibilities:
     • API_BASE        : single place to change the backend URL
     • Cart helpers    : read, write, add, count
     • Auth helpers    : getToken, logout, updateNavAuth
     • Page guard      : requireLogin() — redirect if not logged in
   ============================================================ */

// ── 1. API Base URL ──────────────────────────────────────────
// Change this one line when you deploy your backend.
const API_BASE = 'http://localhost:5000/api';


// ── 2. Cart Helpers ──────────────────────────────────────────

/** Returns the current cart array from localStorage. */
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

/** Saves the cart array back to localStorage. */
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Adds a product to the cart (or increments quantity).
 * @param {string} id    - product _id
 * @param {string} title - product title
 * @param {number} price - product price
 */
function addToCart(id, title, price) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId: id, title, price, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`"${title}" added to cart ✓`);
}

/** Updates the cart item count badge in the navbar. */
function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
}


// ── 3. Auth Helpers ──────────────────────────────────────────

/** Returns the stored JWT token, or null if not logged in. */
function getToken() {
  return localStorage.getItem('token');
}

/** Logs the user out and redirects to login page. */
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

/**
 * Redirects to login if the user is not authenticated.
 * Call at the top of any page that requires login.
 */
function requireLogin() {
  if (!getToken()) {
    alert('Please log in to continue.');
    window.location.href = 'login.html';
  }
}

/**
 * Updates the nav "Login / Logout" link based on auth state.
 * Also shows the user's name if stored.
 */
function updateNavAuth() {
  const link = document.getElementById('auth-link');
  if (!link) return;

  if (getToken()) {
    link.textContent = 'Logout';
    link.href = '#';
    link.onclick = (e) => { e.preventDefault(); logout(); };
  } else {
    link.textContent = 'Login';
    link.href = 'login.html';
    link.onclick = null;
  }
}


// ── 4. Toast Notification ────────────────────────────────────

/**
 * Shows a brief toast message at the bottom of the screen.
 * @param {string} message
 * @param {number} duration - ms to show (default 2500)
 */
function showToast(message, duration = 2500) {
  // Remove any existing toast
  const old = document.getElementById('toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}


// ── 5. Run on every page load ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  updateCartCount();
});
