/**
 * Lightweight Scroll Animations (без Lenis)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: navbar }
    });
  }

  // Hero reveal
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('.hero-status-pill', { opacity: 0, y: -20, duration: 0.6 })
    .from('.hero-headline', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
    .from('.hero-lead', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
    .from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
    .from('.doctor-portrait-container', { opacity: 0, scale: 0.95, duration: 0.8 }, '-=0.8');

  // Counter animation
  const counterElements = document.querySelectorAll('.stat-number');
  counterElements.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target') || counter.textContent, 10);
    if (isNaN(target)) return;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerHTML: target,
          duration: 1.5,
          snap: { innerHTML: 1 },
          ease: 'power2.out'
        });
      }
    });
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true
      },
      opacity: 0,
      y: 30,
      duration: 0.8
    });
  });

  // Service cards
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true
      },
      opacity: 0,
      y: 30,
      duration: 0.7,
      delay: i * 0.1
    });
  });

  // 3D tilt (тільки на desktop)
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = (-y / rect.height) * 4;
        const rotateY = (x / rect.width) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Cursor glow
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
      window.addEventListener('mousemove', (e) => {
        gsap.to(cursorGlow, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  }
});
