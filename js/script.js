/* ===== CertPeptides — Main JavaScript ===== */

(function () {
  'use strict';

  /* ---------- AGE GATE ---------- */
  var ageGate = document.getElementById('age-gate');
  if (ageGate) {
    if (localStorage.getItem('como_age_verified') === 'true') {
      ageGate.remove();
    } else {
      ageGate.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    ageGate.querySelector('.btn-agree')?.addEventListener('click', function () {
      localStorage.setItem('como_age_verified', 'true');
      ageGate.style.opacity = '0';
      ageGate.style.transition = 'opacity 0.3s';
      setTimeout(function () {
        ageGate.remove();
        document.body.style.overflow = '';
      }, 300);
    });
    ageGate.querySelector('.btn-exit')?.addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });
  }

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
  document.querySelectorAll('.btn-add-cart[data-product]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast(btn.dataset.product + ' added to cart — for research use only.');
    });
  });

  /* ---------- QUANTITY BUTTONS (data-qty) ---------- */
  document.querySelectorAll('[data-qty]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.closest('.quantity-selector')?.querySelector('input');
      if (!input) return;
      var delta = parseInt(btn.dataset.qty);
      var next = parseInt(input.value) + delta;
      if (next >= 1) input.value = next;
    });
  });

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
    /* Store original DOM order (alphabetical) so "Default" can restore it */
    var grid = document.querySelector('.products-grid');
    var originalOrder = grid ? Array.from(grid.querySelectorAll('.product-card')) : [];

    /* Popularity scores – higher = more popular */
    var popularityMap = {
      'BPC-157 (5mg)': 100,
      'Tirzepatide (TZ) 10mg': 95,
      'Semaglutide (5mg)': 93,
      'Retatrutide (RT) 10mg': 90,
      'Sermorelin (2mg)': 88,
      'TB-500 (5mg)': 86,
      'Ipamorelin (5mg)': 85,
      'CJC-1295 DAC (2mg)': 84,
      'BPC-157 + TB-500 Blend': 83,
      'PT-141 (10mg)': 80,
      'GHK-Cu (50mg)': 78,
      'Epitalon (10mg)': 76,
      'NAD+ (500mg)': 74,
      'Tesamorelin (10mg)': 72,
      'MOTS-c (10mg)': 70,
      'AOD-9604 (5mg)': 68,
      'SS-31 (Elamipretide) (5mg)': 66,
      'Thymosin Alpha-1 (10mg)': 64,
      'Glutathione (1000mg)': 62,
      'KPV (13mg)': 60,
      'Selank (10mg)': 58,
      'Semax (10mg)': 56,
      'IGF-1 LR3 (1mg)': 55,
      'GHRP-2 (12mg)': 54,
      'Melanotan-2 (7mg)': 52,
      'Melanotan-1 (Afamelanotide) (10mg)': 50,
      'Cagrilintide (6mg)': 48,
      'DSIP (Delta Sleep Inducing Peptide) (5mg)': 46,
      'Growth Hormone Optimization Stack (Stack)': 44,
      'Glow Blend (70mg)': 42,
      'Klow Blend (80mg)': 40,
      'L-Carnitine (50ml)': 38,
      '5-Amino-1MQ (5mg)': 36,
      'HCG (Human Chorionic Gonadotropin) (10,000 IU)': 34,
      'HMG (Human Menopausal Gonadotropin) (75 IU)': 32,
      'Bacteriostatic Water (10ml)': 20,
      'Acetic Acid 0.6% (3ml)': 18
    };

    /* Latest additions – higher = newer */
    var latestnessMap = {
      'Cagrilintide (6mg)': 100,
      'Retatrutide (RT) 10mg': 99,
      'SS-31 (Elamipretide) (5mg)': 98,
      'MOTS-c (10mg)': 97,
      '5-Amino-1MQ (5mg)': 96,
      'Klow Blend (80mg)': 95,
      'Glow Blend (70mg)': 94,
      'Growth Hormone Optimization Stack (Stack)': 93,
      'NAD+ (500mg)': 92,
      'KPV (13mg)': 91,
      'Thymosin Alpha-1 (10mg)': 90,
      'IGF-1 LR3 (1mg)': 89,
      'L-Carnitine (50ml)': 88,
      'DSIP (Delta Sleep Inducing Peptide) (5mg)': 87,
      'Selank (10mg)': 86,
      'Semax (10mg)': 85,
      'Melanotan-1 (Afamelanotide) (10mg)': 84,
      'Melanotan-2 (7mg)': 83,
      'AOD-9604 (5mg)': 82,
      'GHRP-2 (12mg)': 81,
      'HCG (Human Chorionic Gonadotropin) (10,000 IU)': 80,
      'HMG (Human Menopausal Gonadotropin) (75 IU)': 79,
      'Glutathione (1000mg)': 78,
      'Tesamorelin (10mg)': 77,
      'Acetic Acid 0.6% (3ml)': 76,
      'Bacteriostatic Water (10ml)': 75
    };

    sortSelect.addEventListener('change', function () {
      if (!grid) return;
      var cards = Array.from(grid.querySelectorAll('.product-card'));
      var mode = sortSelect.value;

      if (mode === 'default') {
        /* Restore alphabetical DOM order */
        originalOrder.forEach(function (c) { grid.appendChild(c); });
        return;
      }

      cards.sort(function (a, b) {
        var nameA = (a.dataset.name || '').trim();
        var nameB = (b.dataset.name || '').trim();

        if (mode === 'price-asc') {
          return (parseFloat(a.dataset.price) || 0) - (parseFloat(b.dataset.price) || 0);
        }
        if (mode === 'price-desc') {
          return (parseFloat(b.dataset.price) || 0) - (parseFloat(a.dataset.price) || 0);
        }
        if (mode === 'popularity') {
          return (popularityMap[nameB] || 0) - (popularityMap[nameA] || 0);
        }
        if (mode === 'latest') {
          return (latestnessMap[nameB] || 0) - (latestnessMap[nameA] || 0);
        }
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
