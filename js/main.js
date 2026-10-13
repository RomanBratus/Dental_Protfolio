/**
 * Main Application Logic & UI Handlers
 */
document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn?.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // Mobile Nav Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileClose = document.getElementById('mobile-nav-close');
  const closeMobile = () => {
    mobileDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  mobileClose?.addEventListener('click', closeMobile);
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  // About Section Tabs
  const aboutTabs = document.querySelectorAll('.about-tab-btn');
  const aboutContents = document.querySelectorAll('.about-tab-content');

  aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      aboutTabs.forEach(t => t.classList.remove('active'));
      aboutContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.querySelector('.faq-header')?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // FAQ glow effect — sync SVG rect rx with button border-radius
  document.querySelectorAll('.btn-primary.faq-header').forEach(element => {
    const rx = getComputedStyle(element).borderRadius;
    const glowRects = element.querySelectorAll('.glow-container rect');

    glowRects.forEach(rect => {
      rect.setAttribute('rx', rx);
    });
  });

  // FAQ glow effect — sync SVG rect rx with button border-radius
  document.querySelectorAll('.btn-primary.faq-header').forEach(element => {
    const rx = getComputedStyle(element).borderRadius;
    const glowRects = element.querySelectorAll('.glow-container rect');

    glowRects.forEach(rect => {
      rect.setAttribute('rx', rx);
    });
  });

  // Booking Form Submission & Toast Alert
  const bookingForm = document.getElementById('appointment-form');
  const toast = document.getElementById('toast-notification');

  function showToast(title, message) {
    const titleEl = toast?.querySelector('.toast-title');
    const msgEl = toast?.querySelector('.toast-msg');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (!toast) return;

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML ?? 'Надіслати';

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Відправка...';
      submitBtn.setAttribute('disabled', 'true');
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Заявку прийнято!';
      }

      showToast('Запис успішно оформлено!', 'Ми зв’яжемося з вами протягом 15 хвилин у месенджері або телефоном.');

      setTimeout(() => {
        bookingForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.removeAttribute('disabled');
        }
      }, 3000);
    }, 1000);
  });
});
