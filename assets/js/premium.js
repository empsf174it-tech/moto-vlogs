/* ==========================================================================
   MOTO VLOGZ - PREMIUM MOTION LAYER
   Scroll reveals, animated stat counters, and hero parallax.
   Progressive enhancement only: nothing here is required for content access.
   ========================================================================== */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Scroll reveal -------------------------------------------------- */
  const revealTargets = [
    '.section-header',
    '.about-grid > *',
    '.about-cards > *',
    '.filter-tabs',
    '.videos-grid > *',
    '.routes-grid > *',
    '.gear-grid > *',
    '.gallery-grid > *',
    '.merch-grid > *',
    '.community-carousel-wrapper',
    '.faq-item',
    '.cta-banner-wrapper',
    '.contact-grid > *',
    '.stat-item',
    '.footer-grid > *'
  ].join(',');

  const nodes = Array.from(document.querySelectorAll(revealTargets));

  nodes.forEach((node) => {
    node.setAttribute('data-reveal', '');
    // Stagger siblings so grids cascade instead of popping in at once.
    const siblings = Array.from(node.parentElement ? node.parentElement.children : []);
    const index = siblings.indexOf(node);
    node.style.setProperty('--reveal-delay', `${Math.min(index, 6) * 80}ms`);
  });

  if (reduceMotion) {
    nodes.forEach((node) => node.classList.add('revealed'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    nodes.forEach((node) => revealObserver.observe(node));
  }

  /* ---- 2. Animated stat counters ---------------------------------------- */
  const stats = document.querySelectorAll('.stat-val');

  const countUp = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!match) return;

    const [, prefix, numberPart, suffix] = match;
    const decimals = (numberPart.split('.')[1] || '').length;
    const target = parseFloat(numberPart.replace(/,/g, ''));
    if (!isFinite(target)) return;

    const grouped = numberPart.includes(',');
    const duration = 1400;
    const start = performance.now();

    const format = (value) => {
      const fixed = value.toFixed(decimals);
      return grouped ? Number(fixed).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) : fixed;
    };

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + format(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!reduceMotion && stats.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    stats.forEach((stat) => statObserver.observe(stat));
  }

  /* ---- 3. Hero parallax drift ------------------------------------------- */
  const heroMedia = document.querySelector('.hero-media-wrapper');
  const heroContent = document.querySelector('.hero-content');

  if (!reduceMotion && (heroMedia || heroContent)) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          if (heroMedia) heroMedia.style.translate = `0 ${y * -0.06}px`;
          if (heroContent) heroContent.style.translate = `0 ${y * 0.04}px`;
        }
        ticking = false;
      });
    }, { passive: true });
  }
})();
