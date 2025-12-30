/* Chen & Co. — Animaciones (sin librerías)
   Archivo: JS/animations.js
   Objetivo:
   - Smooth scroll para navegación interna (#anchors)
   - Reveal on scroll con IntersectionObserver (sin librerías)
   - Header: sombra al hacer scroll
   - Hero: entrada suave + badges escalonados
   - Timeline (“Nuestro proceso”): línea que se dibuja + pulso de dots + glow en steps

   Nota:
   - Se respeta prefers-reduced-motion: si el usuario pide menos movimiento,
     se minimizan transiciones/animaciones y se muestran elementos inmediatamente.
*/

(() => {
  // Marca que JS está activo:
  // - El CSS usa .js en <html> para aplicar el estado inicial de .animate-on-scroll
  // - Esto evita que el contenido quede oculto si el JS no carga.
  document.documentElement.classList.add('js');

  const SELECTORS = {
    header: 'header',
    animateOnScroll: '.animate-on-scroll',
    heroBadges: '.hero-badges .pill',
    heroLeft: '.section:first-of-type .container.grid.grid-2 > div:first-child',
    heroCard: '.hero-card',
    serviceCards: '.svc.card',
    timeline: '.timeline',
  };

  // Preferencia del usuario (accesibilidad):
  // si reduce motion está activo, evitamos animaciones innecesarias.
  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ====== 1) Smooth scroll ======
  // Convierte clicks en links internos (<a href="#id">) en scroll suave.
  // Compensa la altura del header sticky para que la sección no quede “tapada”.
  // Nota: no actualizamos el hash manualmente para evitar "saltos" del navegador;
  // el usuario igual navega correctamente y el scroll queda controlado.
  function initSmoothScroll() {
    const header = document.querySelector(SELECTORS.header);
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerH = header ? header.getBoundingClientRect().height : 0;
        const top = window.scrollY + target.getBoundingClientRect().top - headerH - 16;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      });
    });
  }

  // ====== 2) IntersectionObserver: animaciones on-scroll ======
  // - Observa elementos con .animate-on-scroll
  // - Al entrar al viewport: añade clases para activar fade/slide desde CSS
  // - Deja de observar el elemento (mejor rendimiento)
  function initScrollAnimations() {
    const nodes = document.querySelectorAll(SELECTORS.animateOnScroll);
    if (!nodes.length) return;

    // Si reduce motion, mostrar todo inmediatamente.
    if (prefersReducedMotion()) {
      nodes.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // El plan indica "aplicar fade-in y slide-up".
          // Doble requestAnimationFrame:
          // - asegura que el estado inicial (opacity/transform) haya pintado
          // - y luego dispara la transición visible.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.classList.add('is-visible', 'fade-in', 'slide-up');
              // “Nuestro proceso”: cuando el step entra, lo marcamos como activo para glow suave.
              if (el.classList.contains('step')) {
                el.classList.add('is-active');
              }
            });
          });
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    nodes.forEach((el) => observer.observe(el));
  }

  // ====== 3) Header: sombra al hacer scroll ======
  // Aplica/remueve la clase .header-scrolled según la posición del scroll.
  function initHeaderScroll() {
    const header = document.querySelector(SELECTORS.header);
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('header-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ====== 4) Hero: entrada + badges escalonados ======
  // Animaciones puntuales con estilos inline:
  // - No dependen de clases extra
  // - Son “above-the-fold”, así que se disparan al cargar.
  // Mantenimiento: si cambias la estructura del Hero en index.html,
  // revisa SELECTORS.heroLeft y SELECTORS.heroCard para evitar selectors rotos.
  function initHeroAnimations() {
    const heroLeft = document.querySelector(SELECTORS.heroLeft);
    const heroCard = document.querySelector(SELECTORS.heroCard);
    const badges = Array.from(document.querySelectorAll(SELECTORS.heroBadges));

    if (prefersReducedMotion()) return;

    // Entrada del contenido principal (columna izquierda)
    if (heroLeft) {
      heroLeft.style.opacity = '0';
      heroLeft.style.transform = 'translateY(14px)';
      heroLeft.style.transition = 'opacity .8s ease, transform .8s ease';
      requestAnimationFrame(() => {
        heroLeft.style.opacity = '1';
        heroLeft.style.transform = 'translateY(0)';
      });
    }

    // Entrada de la card derecha (visual del hero)
    if (heroCard) {
      heroCard.style.opacity = '0';
      heroCard.style.transform = 'translateX(18px)';
      heroCard.style.transition = 'opacity .9s ease .15s, transform .9s ease .15s';
      requestAnimationFrame(() => {
        heroCard.style.opacity = '1';
        heroCard.style.transform = 'translateX(0)';
      });
    }

    // Badges escalonados (stagger)
    badges.forEach((badge, idx) => {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(10px)';
      badge.style.transition = `opacity .6s ease ${0.15 + idx * 0.12}s, transform .6s ease ${
        0.15 + idx * 0.12
      }s`;
      requestAnimationFrame(() => {
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0)';
      });
    });
  }

  // ====== 5) Hover effects (servicios) ======
  // La mayor parte está en CSS (transiciones/hover). Aquí solo damos una pista al browser.
  function initServiceCardHovers() {
    // Ya hay hover en CSS; esto solo asegura transición si el navegador aplica inline styles.
    const cards = document.querySelectorAll(SELECTORS.serviceCards);
    if (!cards.length) return;

    cards.forEach((card) => {
      card.style.willChange = 'transform';
    });
  }

  // ====== 6) Timeline: línea + dots progresivos ======
  // - Crea el div .timeline-line-animated si no existe
  // - Al entrar al viewport: activa la línea y setea --cc-i para secuencias (CSS)
  // Nota: el CSS tiene una variante vertical para mobile (max-width: 720px).
  function initTimelineAnimations() {
    const timeline = document.querySelector(SELECTORS.timeline);
    if (!timeline) return;

    const steps = Array.from(timeline.querySelectorAll('.step'));
    const dots = Array.from(timeline.querySelectorAll('.dot'));

    // Crear línea animada (encima de ::before)
    let line = timeline.querySelector('.timeline-line-animated');
    if (!line) {
      line = document.createElement('div');
      line.className = 'timeline-line-animated';
      timeline.appendChild(line);
    }

    if (prefersReducedMotion()) {
      line.style.transform = 'scaleX(1)';
      steps.forEach((s) => s.classList.add('is-visible'));
      dots.forEach((d) => (d.style.opacity = '1'));
      return;
    }

    const run = () => {
      // Clase “gatillo” para animaciones CSS del timeline (shine/pulse)
      timeline.classList.add('is-animating');
      // Índices para delays en CSS (pulse secuencial)
      steps.forEach((step, idx) => step.style.setProperty('--cc-i', String(idx)));
      dots.forEach((dot, idx) => dot.style.setProperty('--cc-i', String(idx)));

      // Dibuja la línea (transform: scaleX(1))
      line.style.transform = 'scaleX(1)';

      steps.forEach((step, idx) => {
        // Apoyarse en las clases CSS del paso 1
        step.classList.add('animate-on-scroll');
        step.style.transitionDelay = `${0.2 + idx * 0.1}s`;
      });
      // Dejar que el observer general las active; por si no, activarlas aquí también:
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          steps.forEach((s) => s.classList.add('is-visible', 'fade-in', 'slide-up', 'is-active'));
        });
      });
    };

    const io = new IntersectionObserver(
      (entries, obs) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        run();
        obs.disconnect();
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );

    io.observe(timeline);
  }

  // ====== 7) Init ======
  // Inicializa todas las mejoras cuando el DOM está listo.
  function init() {
    initSmoothScroll();
    initScrollAnimations();
    initHeaderScroll();
    initHeroAnimations();
    initServiceCardHovers();
    initTimelineAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

