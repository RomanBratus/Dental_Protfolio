/**
 * GSAP ScrollTrigger Animations & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scroll if available
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Navbar scroll background change
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: navbar }
    });
  }

  // Hero Section Stagger Reveal
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  heroTimeline
    .from('.hero-status-pill', { opacity: 0, y: -20, delay: 0.2 })
    .from('.hero-headline', { opacity: 0, y: 30, duration: 1.1 }, '-=0.6')
    .from('.hero-lead', { opacity: 0, y: 20 }, '-=0.7')
    .from('.hero-cta-group', { opacity: 0, y: 20 }, '-=0.7')
    .from('.hero-stats-bar', { opacity: 0, y: 20 }, '-=0.6')
    .from('.doctor-portrait-container', { opacity: 0, scale: 0.95, duration: 1.2 }, '-=1.2')
    .from('.floating-badge', { opacity: 0, scale: 0.8, stagger: 0.2 }, '-=0.6');

  // Animated Number Counters in Hero
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
          duration: 2,
          snap: { innerHTML: 1 },
          ease: 'power2.out'
        });
      }
    });
  });

  // Section Headers Reveal
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out'
    });
  });

  // Service Cards Stagger Reveal
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length > 0) {
    gsap.from(serviceCards, {
      scrollTrigger: {
        trigger: '.services-bento-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 45,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power3.out'
    });
  }

  // Roadmap Steps Animation
  const roadmapSteps = document.querySelectorAll('.roadmap-step');
  roadmapSteps.forEach((step, i) => {
    gsap.from(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: i % 2 === 0 ? -40 : 40,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Testimonials Cards Reveal
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  if (testimonialCards.length > 0) {
    gsap.from(testimonialCards, {
      scrollTrigger: {
        trigger: '.testimonials-slider',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 35,
      stagger: 0.18,
      duration: 0.85,
      ease: 'power3.out'
    });
  }

  // 3D Card Tilt Effect on Mouse Move
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Custom Cursor Glow Follower
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
  }
});
