/**
 * Main Application Logic & UI Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  // 2. Mobile Nav Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileClose = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. About Section Tabs
  const aboutTabs = document.querySelectorAll('.about-tab-btn');
  const aboutContents = document.querySelectorAll('.about-tab-content');

  aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      aboutTabs.forEach(t => t.classList.remove('active'));
      aboutContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetContent = document.getElementById(`tab-${target}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close others for clean accordion look
        faqItems.forEach(i => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 5. Booking Form Submission & Toast Alert
  const bookingForm = document.getElementById('appointment-form');
  const toast = document.getElementById('toast-notification');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Надіслати';

      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Відправка...';
        submitBtn.setAttribute('disabled', 'true');
      }

      // Simulate API processing
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
  }

  function showToast(title, message) {
    if (!toast) return;
    const titleEl = toast.querySelector('.toast-title');
    const msgEl = toast.querySelector('.toast-msg');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }
});
