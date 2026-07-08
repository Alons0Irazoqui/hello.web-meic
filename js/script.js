/* ==========================================================================
   MEIC — Manejamos tu Energía — Interacciones de la landing page
   ========================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preloader ---------- */
  (function preloader() {
    var fill = document.getElementById('preloaderFill');
    var progress = 0;
    var target = 0;
    var raf;

    document.body.classList.add('is-locked');

    function tick() {
      progress += (target - progress) * 0.12;
      if (fill) fill.style.width = Math.min(progress, 100) + '%';
      if (progress < target - 0.5) {
        raf = requestAnimationFrame(tick);
      }
    }

    target = 78;
    tick();

    window.addEventListener('load', finish);
    // Fallback por si el evento load tarda demasiado (recursos externos, etc.)
    var fallback = setTimeout(finish, 4000);

    function finish() {
      clearTimeout(fallback);
      target = 100;
      cancelAnimationFrame(raf);
      if (fill) fill.style.width = '100%';
      setTimeout(function () {
        document.body.classList.add('is-loaded');
        document.body.classList.remove('is-locked');
        if (window.location.hash) {
          var hashTarget = document.querySelector(window.location.hash);
          if (hashTarget) hashTarget.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
        window.removeEventListener('load', finish);
      }, reducedMotion ? 80 : 480);
    }
  })();

  /* ---------- Navbar: scroll state + mobile menu ---------- */
  (function navbar() {
    var nav = document.getElementById('navbar');
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    var links = menu ? menu.querySelectorAll('.navbar__link') : [];

    function onScroll() {
      if (window.scrollY > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function closeMenu() {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
    }
    function openMenu() {
      menu.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
      });
    }
    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    /* Resaltar enlace activo según sección visible */
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    if ('IntersectionObserver' in window && sections.length) {
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute('id');
          links.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(function (s) { navObserver.observe(s); });
    }
  })();

  /* ---------- Scroll reveal ---------- */
  (function reveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    items.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay) el.style.setProperty('--delay', delay);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- Contadores animados ---------- */
  (function counters() {
    var stats = document.querySelectorAll('.stat__number');
    if (!stats.length) return;

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reducedMotion) { el.textContent = target + suffix; return; }

      var startTime = null;
      var duration = 1600;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      stats.forEach(animateCount);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    stats.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- Tabs de servicios ---------- */
  (function tabs() {
    var buttons = document.querySelectorAll('.tabs__btn');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');

        buttons.forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        document.querySelectorAll('.tabs__panel').forEach(function (panel) {
          var isTarget = panel.id === 'panel-' + target;
          panel.classList.toggle('is-active', isTarget);
          panel.hidden = !isTarget;
        });
      });
    });
  })();

  /* ---------- Formulario de contacto -> WhatsApp ---------- */
  (function contactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var WHATSAPP_NUMBER = '527228058043';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var nombre = (data.get('nombre') || '').toString().trim();
      var telefono = (data.get('telefono') || '').toString().trim();
      var empresa = (data.get('empresa') || '').toString().trim();
      var servicio = (data.get('servicio') || '').toString().trim();
      var mensaje = (data.get('mensaje') || '').toString().trim();

      var lines = [
        'Hola MEIC, soy ' + nombre + '.',
        'Teléfono: ' + telefono
      ];
      if (empresa) lines.push('Empresa: ' + empresa);
      if (servicio) lines.push('Servicio de interés: ' + servicio);
      lines.push('Mensaje: ' + mensaje);

      var text = encodeURIComponent(lines.join('\n'));
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text, '_blank', 'noopener');
    });
  })();

  /* ---------- Botón volver arriba ---------- */
  (function backToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 720);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  })();

  /* ---------- Año dinámico en el footer ---------- */
  (function year() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  })();

})();
