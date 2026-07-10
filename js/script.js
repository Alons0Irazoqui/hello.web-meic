/* ==========================================================================
   MEIC — Manejamos tu Energía — Interacciones de la landing page
   ========================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preloader ---------- */
  (function preloader() {
    var fill = document.getElementById('preloaderFill');
    var ring = document.getElementById('preloaderRing');
    var percentEl = document.getElementById('preloaderPercent');
    var RING_CIRCUMFERENCE = 326.7;
    var progress = 0;
    var target = 0;
    var raf;
    var startTime = Date.now();
    var MIN_VISIBLE = reducedMotion ? 150 : 2200;

    document.body.classList.add('is-locked');

    function render(value) {
      var v = Math.min(value, 100);
      if (fill) fill.style.width = v + '%';
      if (ring) ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - v / 100);
      if (percentEl && percentEl.firstChild) percentEl.firstChild.textContent = Math.round(v);
    }

    function tick() {
      progress += (target - progress) * 0.12;
      render(progress);
      if (progress < target - 0.5) {
        raf = requestAnimationFrame(tick);
      }
    }

    target = 78;
    tick();

    window.addEventListener('load', requestFinish);
    // Fallback por si el evento load tarda demasiado (recursos externos, etc.)
    var fallback = setTimeout(requestFinish, 5000);

    function requestFinish() {
      clearTimeout(fallback);
      var elapsed = Date.now() - startTime;
      var wait = Math.max(MIN_VISIBLE - elapsed, 0);
      setTimeout(finish, wait);
    }

    function finish() {
      target = 100;
      cancelAnimationFrame(raf);
      render(100);
      setTimeout(function () {
        document.body.classList.add('is-loaded');
        document.body.classList.remove('is-locked');
        if (window.location.hash) {
          var hashTarget = document.querySelector(window.location.hash);
          if (hashTarget) hashTarget.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
        window.removeEventListener('load', requestFinish);
      }, reducedMotion ? 80 : 480);
    }
  })();

  /* ---------- Hero: partículas de fondo ---------- */
  (function heroParticles() {
    var canvas = document.getElementById('heroParticles');
    var hero = document.querySelector('.hero');
    if (!canvas || !hero || reducedMotion) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var width, height, dpr;
    var running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.min(120, Math.round((width * height) / 12000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.7 + 0.7
        });
      }
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(91, 196, 234, 0.7)';
        ctx.fill();
      }

      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 145) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(61, 209, 242, ' + (0.24 * (1 - dist / 145)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }

    resize();
    requestAnimationFrame(step);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        var wasRunning = running;
        running = entries[0].isIntersecting;
        if (running && !wasRunning) requestAnimationFrame(step);
      }, { threshold: 0 });
      io.observe(hero);
    }
  })();

  /* ---------- Hero: spotlight que sigue el cursor ---------- */
  (function heroSpotlight() {
    var hero = document.querySelector('.hero');
    var spot = document.getElementById('heroSpotlight');
    if (!hero || !spot || reducedMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      spot.style.setProperty('--spot-x', x + '%');
      spot.style.setProperty('--spot-y', y + '%');
      spot.style.opacity = '1';
    });
    hero.addEventListener('mouseleave', function () {
      spot.style.opacity = '0';
    });
  })();

  /* ---------- Hero: título con efecto de máquina de escribir ---------- */
  (function heroTypewriter() {
    var el = document.getElementById('heroType');
    if (!el || reducedMotion) return;

    var words = ['confiable', 'eficiente', 'segura', 'constante', 'rentable'];
    var wordIndex = 0;
    var charIndex = words[0].length;
    var deleting = true;
    var typeSpeed = 90;
    var deleteSpeed = 45;
    var holdTime = 2000;
    var timer;

    function step() {
      var current = words[wordIndex];

      if (deleting) {
        charIndex--;
        if (charIndex < 0) charIndex = 0;
      } else {
        charIndex++;
        if (charIndex > current.length) charIndex = current.length;
      }

      el.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex === current.length) {
        timer = setTimeout(function () { deleting = true; step(); }, holdTime);
        return;
      }
      if (deleting && charIndex === 0) {
        wordIndex = (wordIndex + 1) % words.length;
        deleting = false;
        timer = setTimeout(step, 260);
        return;
      }

      timer = setTimeout(step, deleting ? deleteSpeed : typeSpeed);
    }

    timer = setTimeout(step, 2400);
  })();

  /* ---------- Partículas ambientales fijas en toda la página (mobile + desktop) ---------- */
  (function ambientPageParticles() {
    if (reducedMotion) return;
    var canvas = document.getElementById('ambientParticles');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var width, height, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.min(75, Math.round((width * height) / 21000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.14,
          vy: -(Math.random() * 0.2 + 0.05),
          r: Math.random() * 1.8 + 0.6,
          a: Math.random() * 0.45 + 0.28
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(61, 209, 242, ' + p.a.toFixed(2) + ')';
        ctx.fill();
      }
      requestAnimationFrame(step);
    }

    resize();
    requestAnimationFrame(step);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
  })();

  /* ---------- Glow que sigue el cursor (global, desktop) ---------- */
  (function cursorGlow() {
    var el = document.getElementById('cursorGlow');
    if (!el || reducedMotion) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    var raf = null;
    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;

    function apply() {
      el.style.setProperty('--cx', mx + 'px');
      el.style.setProperty('--cy', my + 'px');
      raf = null;
    }

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      el.classList.add('is-active');
      if (!raf) raf = requestAnimationFrame(apply);
    });
    document.addEventListener('mouseleave', function () {
      el.classList.remove('is-active');
    });
  })();

  /* ---------- Botones magnéticos (desktop) ---------- */
  (function magneticButtons() {
    if (reducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var btns = document.querySelectorAll('.btn--lg');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transition = 'transform 0.2s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform = 'translate(' + (x * 0.16).toFixed(1) + 'px, ' + (y * 0.28).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform = 'translate(0, 0)';
      });
    });
  })();

  /* ---------- Tilt 3D en tarjetas (desktop) ---------- */
  (function cardTilt() {
    if (reducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var cards = document.querySelectorAll('.value-card, .service-card, .diff-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform 0.12s linear';
        card.style.transform = 'perspective(800px) rotateX(' + (-py * 6).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform = '';
      });
    });
  })();

  /* ---------- Ripple táctil en botones (mobile + desktop) ---------- */
  (function buttonRipple() {
    if (reducedMotion) return;
    var btns = document.querySelectorAll('.btn');
    btns.forEach(function (btn) {
      btn.addEventListener('pointerdown', function (e) {
        var r = btn.getBoundingClientRect();
        var size = Math.max(r.width, r.height) * 1.4;
        var span = document.createElement('span');
        span.className = 'btn__ripple';
        span.style.width = size + 'px';
        span.style.height = size + 'px';
        span.style.left = (e.clientX - r.left - size / 2) + 'px';
        span.style.top = (e.clientY - r.top - size / 2) + 'px';
        btn.appendChild(span);
        span.addEventListener('animationend', function () { span.remove(); });
      });
    });
  })();

  /* ---------- Parallax de imágenes según el scroll (mobile + desktop) ---------- */
  (function parallaxImages() {
    if (reducedMotion) return;

    var targets = [
      { el: document.querySelector('.about__media'), speed: 0.05 },
      { el: document.querySelector('#panel-electro .services-layout__media'), speed: 0.045 },
      { el: document.querySelector('#panel-maquinaria .services-layout__media'), speed: 0.045 },
      { el: document.querySelector('.commerce__media'), speed: 0.05 }
    ].filter(function (t) { return t.el; });
    if (!targets.length) return;

    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      targets.forEach(function (t) {
        var rect = t.el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var center = rect.top + rect.height / 2 - vh / 2;
        t.el.style.transform = 'translateY(' + (-center * t.speed).toFixed(1) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------- Parallax de fondos "fixed" (reemplazo real para mobile) ----------
     background-attachment:fixed no funciona en navegadores móviles (iOS Safari lo
     ignora, Android Chrome lo hace con jank), por eso antes solo se veía en desktop.
     Esto anima con transform la imagen real (antes invisible) dentro de cada
     sección, lo que sí funciona igual en touch que con mouse. ---------- */
  (function fixedBgParallax() {
    if (reducedMotion) return;

    var targets = [
      { section: document.querySelector('.hero'), img: document.querySelector('.hero__bg-img'), factor: 0.16 },
      { section: document.querySelector('.renewables'), img: document.querySelector('.renewables__img'), factor: 0.16 },
      { section: document.querySelector('.cta-banner'), img: document.querySelector('.cta-banner__img'), factor: 0.16 }
    ].filter(function (t) { return t.section && t.img; });
    if (!targets.length) return;

    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      var clampRange = vh * 0.75;
      targets.forEach(function (t) {
        var rect = t.section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var top = Math.max(-clampRange, Math.min(clampRange, rect.top));
        t.img.style.transform = 'translate3d(0, ' + (-top * t.factor).toFixed(1) + 'px, 0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------- Partículas ligeras reutilizables para secciones oscuras ---------- */
  function lightParticles(canvasId, containerSelector, options) {
    var canvas = document.getElementById(canvasId);
    var container = document.querySelector(containerSelector);
    if (!canvas || !container || reducedMotion) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var width, height, dpr;
    var running = true;
    var opts = options || {};
    var color = opts.color || 'rgba(61, 209, 242, 0.6)';
    var density = opts.density || 22000;
    var maxCount = opts.max || 60;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.min(maxCount, Math.round((width * height) / density));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy: -(Math.random() * 0.35 + 0.08),
          vx: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 1.4 + 0.5,
          a: Math.random() * 0.5 + 0.3
        });
      }
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, p.a.toFixed(2) + ')');
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    resize();
    requestAnimationFrame(step);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        var wasRunning = running;
        running = entries[0].isIntersecting;
        if (running && !wasRunning) requestAnimationFrame(step);
      }, { threshold: 0 });
      io.observe(container);
    }
  }
  lightParticles('commerceParticles', '.commerce', { color: 'rgba(61, 209, 242, 0.6)', density: 19000, max: 55 });
  lightParticles('footerParticles', '.footer', { color: 'rgba(91, 196, 234, 0.5)', density: 26000, max: 38 });

  /* ---------- Barra de progreso de scroll ---------- */
  (function scrollProgress() {
    var bar = document.getElementById('scrollProgressFill');
    if (!bar) return;

    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
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

  /* ---------- Stagger automático para grupos de tarjetas ---------- */
  (function staggerReveal() {
    var groups = document.querySelectorAll('[data-reveal-stagger]');
    groups.forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (child, i) {
        child.classList.add('stagger-item');
        child.style.setProperty('--delay', i * 90);
      });
    });
  })();

  /* ---------- Scroll reveal ---------- */
  (function reveal() {
    var items = document.querySelectorAll('[data-reveal], .stagger-item');
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
