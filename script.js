/* ============================================
   ISLA FUNGI — SCRIPT
   Cart · Mobile nav · Scroll reveals
   ============================================ */

(function () {
  'use strict';

  // ---------- PRODUCT DATA ----------
  const PRODUCTS = {
    melena: {
      id: 'melena',
      name: 'Melena de León',
      price: 15000,
      image: 'images/melena-de-leon.jpg',
      unit: '30 ml · Triple extracto'
    },
    cordyceps: {
      id: 'cordyceps',
      name: 'Cordyceps',
      price: 13000,
      image: 'images/cordyceps.jpg',
      unit: '30 ml · Triple extracto'
    }
  };

  // ---------- STATE ----------
  const STORAGE_KEY = 'isla_fungi_cart';
  let cart = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) { /* silent */ }
  }

  // ---------- HELPERS ----------
  const formatCLP = (n) => '$' + n.toLocaleString('es-CL');

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ---------- CART UI ----------
  const cartDrawer = $('#cartDrawer');
  const cartOverlay = $('#cartOverlay');
  const cartItemsEl = $('#cartItems');
  const cartCountEl = $('#cartCount');
  const cartTotalEl = $('#cartTotal');

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function addToCart(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    if (cart[productId]) {
      cart[productId].qty += 1;
    } else {
      cart[productId] = { ...product, qty: 1 };
    }
    saveCart();
    renderCart();
    bumpCount();
  }

  function updateQty(productId, delta) {
    if (!cart[productId]) return;
    cart[productId].qty += delta;
    if (cart[productId].qty <= 0) {
      delete cart[productId];
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(productId) {
    delete cart[productId];
    saveCart();
    renderCart();
  }

  function getCartTotals() {
    let count = 0, total = 0;
    Object.values(cart).forEach(item => {
      count += item.qty;
      total += item.qty * item.price;
    });
    return { count, total };
  }

  function bumpCount() {
    cartCountEl.classList.remove('bump');
    // Force reflow so animation restarts
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('bump');
  }

  function renderCart() {
    const { count, total } = getCartTotals();
    cartCountEl.textContent = count;
    cartTotalEl.textContent = formatCLP(total);

    const items = Object.values(cart);
    if (items.length === 0) {
      cartItemsEl.innerHTML = `
        <p class="cart-empty">
          Tu carrito está vacío.<br>
          <small>Añade algo rico de la isla 🏝️</small>
        </p>`;
      return;
    }

    cartItemsEl.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.unit}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" data-qty-down="${item.id}" aria-label="Disminuir">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-qty-up="${item.id}" aria-label="Aumentar">+</button>
          </div>
          <button class="cart-item-remove" data-remove="${item.id}">Eliminar</button>
        </div>
        <div class="cart-item-price">${formatCLP(item.qty * item.price)}</div>
      </div>
    `).join('');
  }

  // ---------- EVENT LISTENERS ----------
  // Add to cart buttons
  $$('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.add;
      addToCart(id);
      btn.classList.add('added');
      const originalText = btn.textContent;
      btn.textContent = '✓ Añadido';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = originalText;
      }, 1400);
      // Open cart briefly
      setTimeout(openCart, 300);
    });
  });

  // Cart drawer open/close
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Delegate cart item actions
  cartItemsEl.addEventListener('click', (e) => {
    const t = e.target;
    if (t.dataset.qtyUp) updateQty(t.dataset.qtyUp, +1);
    else if (t.dataset.qtyDown) updateQty(t.dataset.qtyDown, -1);
    else if (t.dataset.remove) removeFromCart(t.dataset.remove);
  });

  // Checkout — placeholder. Opens WhatsApp with order summary.
  $('#checkoutBtn').addEventListener('click', () => {
    const items = Object.values(cart);
    if (items.length === 0) {
      alert('Tu carrito está vacío — agrega un producto para continuar.');
      return;
    }
    const { total } = getCartTotals();
    const lines = items.map(i =>
      `• ${i.name} x${i.qty} — ${formatCLP(i.price * i.qty)}`
    ).join('%0A');
    const msg = `¡Hola Isla Fungi! 🏝️%0AQuiero hacer un pedido:%0A%0A${lines}%0A%0ATotal: *${formatCLP(total)}*%0A%0A¿Cómo seguimos?`;
    // Número WhatsApp Isla Fungi
    window.open(`https://wa.me/56945110536?text=${msg}`, '_blank');
  });

  // Close cart with ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart();
  });

  // ---------- MOBILE MENU ----------
  const menuToggle = $('#menuToggle');
  const navLinks = $('.nav-links');
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  // Close mobile menu when clicking a link
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- SCROLL REVEAL ----------
  const revealEls = $$('.product-card, .benefit-card, .ship-card, .trust-item, .section-head, .island-copy, .island-visual');
  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---------- NAV SHADOW ON SCROLL ----------
  const nav = $('#nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 20) nav.style.boxShadow = '0 4px 20px rgba(13, 74, 90, .08)';
    else nav.style.boxShadow = '';
    lastY = y;
  }, { passive: true });

  // ---------- INIT ----------
  renderCart();
})();
