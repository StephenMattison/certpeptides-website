/* ===== CertPeptides — Main JavaScript ===== */

(function () {
  'use strict';

  /* ---------- AGE GATE ---------- */
  const ageGate = document.getElementById('age-gate');
  if (ageGate) {
    if (localStorage.getItem('como_age_verified') === 'true') {
      ageGate.remove();
    } else {
      ageGate.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  window.ageAgree = function () {
    localStorage.setItem('como_age_verified', 'true');
    if (ageGate) {
      ageGate.style.opacity = '0';
      ageGate.style.transition = 'opacity 0.3s';
      setTimeout(function () {
        ageGate.remove();
        document.body.style.overflow = '';
      }, 300);
    }
  };

  window.ageExit = function () {
    window.location.href = 'https://www.google.com';
  };

  /* ---------- MOBILE MENU ---------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen
        ? '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    });
  }

  /* ---------- PRODUCT TABS ---------- */
  document.querySelectorAll('.tabs-nav button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabGroup = btn.closest('.product-tabs');
      tabGroup.querySelectorAll('.tabs-nav button').forEach(function (b) { b.classList.remove('active'); });
      tabGroup.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var target = tabGroup.querySelector('#' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* ---------- QUANTITY SELECTOR ---------- */
  document.querySelectorAll('.quantity-selector').forEach(function (qs) {
    var input = qs.querySelector('input');
    var minus = qs.querySelector('.qty-minus');
    var plus = qs.querySelector('.qty-plus');
    if (minus) minus.addEventListener('click', function () { if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1; });
    if (plus) plus.addEventListener('click', function () { input.value = parseInt(input.value) + 1; });
  });

  /* ---------- ADD TO CART (PLACEHOLDER) ---------- */
  window.addToCart = function (name) {
    showToast(name + ' added to cart — for research use only.');
  };

  /* ---------- TOAST NOTIFICATION ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3000);
  }
  window.showToast = showToast;

  /* ---------- CONTACT FORM ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.getElementById('form-success');
      if (success) {
        success.classList.add('show');
        contactForm.reset();
        setTimeout(function () { success.classList.remove('show'); }, 5000);
      }
    });
  }

  /* ---------- SCROLL TO TOP ---------- */
  var scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- FADE-IN ON SCROLL ---------- */
  var faders = document.querySelectorAll('.fade-on-scroll');
  if (faders.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    faders.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- PRODUCT FILTER (SHOP PAGE) ---------- */
  var filterSelect = document.getElementById('category-filter');
  var sortSelect = document.getElementById('sort-select');
  if (filterSelect) {
    filterSelect.addEventListener('change', function () {
      var val = this.value;
      document.querySelectorAll('.product-card[data-category]').forEach(function (card) {
        card.style.display = (val === 'all' || card.dataset.category === val) ? '' : 'none';
      });
      updateResultCount();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var grid = document.querySelector('.products-grid');
      if (!grid) return;
      var cards = Array.from(grid.querySelectorAll('.product-card'));
      cards.sort(function (a, b) {
        var pa = parseFloat(a.dataset.price) || 0;
        var pb = parseFloat(b.dataset.price) || 0;
        if (sortSelect.value === 'price-asc') return pa - pb;
        if (sortSelect.value === 'price-desc') return pb - pa;
        return 0;
      });
      cards.forEach(function (c) { grid.appendChild(c); });
    });
  }

  function updateResultCount() {
    var count = document.querySelectorAll('.product-card[data-category]:not([style*="display: none"])').length;
    var el = document.getElementById('result-count');
    if (el) el.textContent = count + ' product' + (count !== 1 ? 's' : '');
  }

  /* ---------- CAROUSEL (SIMPLE) ---------- */
  var carousel = document.querySelector('.carousel-track');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  if (carousel && prevBtn && nextBtn) {
    var scrollAmount = 310;
    prevBtn.addEventListener('click', function () {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  /* ---------- ACCOUNT TABS ---------- */
  document.querySelectorAll('.account-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.account-tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.account-panel').forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.getElementById('panel-' + tab.dataset.accountTab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- LOGIN FORM ---------- */
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.getElementById('login-success');
      if (success) {
        loginForm.style.display = 'none';
        success.classList.add('show');
      }
    });
  }

  /* ---------- REGISTER FORM ---------- */
  var registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pw = document.getElementById('reg-password').value;
      var confirm = document.getElementById('reg-confirm').value;
      if (pw !== confirm) {
        showToast('Passwords do not match. Please try again.');
        return;
      }
      var success = document.getElementById('register-success');
      if (success) {
        registerForm.style.display = 'none';
        success.classList.add('show');
      }
    });
  }

})();
