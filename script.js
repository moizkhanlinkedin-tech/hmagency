/* =========================================================
   HM AGENCY — INTERACTION LAYER
   ========================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------
     1. HEADER: subtle solid state after scrolling past hero
     ----------------------------------------------------- */
  var header = document.getElementById('site-header');
  var onScrollHeader = function () {
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* -----------------------------------------------------
     2. MOBILE MENU: hamburger <-> X, slide-in panel
     ----------------------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var backdrop = document.getElementById('mobile-menu-backdrop');
  var mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    backdrop.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  backdrop.addEventListener('click', closeMenu);
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu automatically if resized back to desktop width
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) { closeMenu(); }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); }
  });

  /* -----------------------------------------------------
     3. SMOOTH SCROLL for internal anchors (with header offset)
     ----------------------------------------------------- */
  var headerH = function () {
    return document.getElementById('site-header').offsetHeight;
  };

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - (headerH() + 10);

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      // Update active nav link state
      document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('is-active'); });
      var match = document.querySelector('.nav-link[href="' + targetId + '"]');
      if (match) match.classList.add('is-active');
    });
  });

  /* -----------------------------------------------------
     4. SCROLL-SPY: highlight nav link for section in view
     ----------------------------------------------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinkFor = {};
  document.querySelectorAll('.nav-link').forEach(function (l) {
    navLinkFor[l.getAttribute('href')] = l;
  });

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('is-active'); });
        var link = navLinkFor['#' + entry.target.id];
        if (link) link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(function (s) { spyObserver.observe(s); });

  /* -----------------------------------------------------
     5. SCROLL-TRIGGERED REVEAL ANIMATIONS
     ----------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // slight stagger for elements revealed together
          var delay = Math.min(i * 60, 240);
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* -----------------------------------------------------
     6. HERO TYPING EFFECT
     ----------------------------------------------------- */
  var typedEl = document.getElementById('typed-text');
  var phrases = [
    'Websites that convert.',
    'Software that scales.',
    'Automation that never sleeps.',
    'Brands that compound.'
  ];

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
    } else {
      var phraseIdx = 0;
      var charIdx = 0;
      var deleting = false;

      var TYPE_SPEED = 55;
      var DELETE_SPEED = 30;
      var HOLD_TIME = 1500;

      function tick() {
        var current = phrases[phraseIdx];

        if (!deleting) {
          charIdx++;
          typedEl.textContent = current.slice(0, charIdx);
          if (charIdx === current.length) {
            deleting = true;
            setTimeout(tick, HOLD_TIME);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIdx--;
          typedEl.textContent = current.slice(0, charIdx);
          if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(tick, 300);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      }
      setTimeout(tick, 400);
    }
  }

  /* -----------------------------------------------------
     7. AI AUTOMATION CARD — expand/collapse capabilities list
     ----------------------------------------------------- */
  var aiToggle = document.getElementById('ai-expand-toggle');
  var aiPanel = document.getElementById('ai-expand-panel');
  var aiToggleLabel = aiToggle ? aiToggle.querySelector('span') : null;

  if (aiToggle && aiPanel) {
    aiToggle.addEventListener('click', function () {
      var isOpen = aiToggle.getAttribute('aria-expanded') === 'true';
      aiToggle.setAttribute('aria-expanded', String(!isOpen));
      aiPanel.classList.toggle('is-open', !isOpen);
      if (aiToggleLabel) {
        aiToggleLabel.textContent = isOpen ? 'View capabilities' : 'Hide capabilities';
      }
    });
  }

  /* -----------------------------------------------------
     8. CONTACT FORM (Formspree AJAX Integration)
     ----------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var formNote = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function (response) {
        if (response.ok) {
          formNote.textContent = "Thanks! Your message has been sent successfully.";
          form.reset();
        } else {
          response.json().then(function (data) {
            if (Object.hasOwn(data, 'errors')) {
              formNote.textContent = data.errors.map(function (error) { return error.message; }).join(", ");
            } else {
              formNote.textContent = "Oops! There was a problem submitting your form.";
            }
          });
        }
      }).catch(function (error) {
        formNote.textContent = "Oops! There was a problem submitting your form.";
      });
    });
  }

  /* -----------------------------------------------------
     9. FOOTER YEAR
     ----------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

})();