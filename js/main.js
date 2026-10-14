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

  // Handle iOS Safari autoplay restrictions for hero video
  const heroVideo = document.querySelector('.hero-bg');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;

    // Try to autoplay immediately (works on most browsers)
    heroVideo.play().catch(() => {
      // If that fails (likely on iOS), wait for first user interaction
      const tryPlay = () => {
        heroVideo.play().then(() => {
          document.removeEventListener('touchstart', tryPlay);
          document.removeEventListener('scroll', tryPlay);
        }).catch(() => {
          // Still can't play — maybe the video has audio, so we need to handle that
          console.warn('Video autoplay failed — likely due to audio track');
        });
      };
      document.addEventListener('touchstart', tryPlay, { once: true });
      document.addEventListener('scroll', tryPlay, { once: true });
    });
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

  // Booking Form Submission & Toast Alert
  const bookingForm = document.getElementById('appointment-form');
  const toast = document.getElementById('toast-notification');
  const TELEGRAM_BOT_TOKEN = '8717914768:AAEWpxMjbItLrUiG7FytiZ_TNt0shBHiUCg';
  const TELEGRAM_CHAT_ID = '-5024101596';

  function showToast(title, message) {
    const titleEl = toast?.querySelector('.toast-title');
    const msgEl = toast?.querySelector('.toast-msg');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (!toast) return;

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  function buildTelegramMessage(data) {
    return [
      '📝 *Запис пацієнта з сайту*',
      '',
      `👤 *Ім\'я:* ${data.name}`,
      `📞 *Телефон:* ${data.phone}`,
      `📍 *Локація:* ${data.location}`,
      `🦷 *Послуга:* ${data.service}`,
      `💬 *Коментар:* ${data.comment || '—'}`,
    ].join('\n');
  }

  bookingForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML ?? 'Надіслати';

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Відправка...';
      submitBtn.setAttribute('disabled', 'true');
    }

    const data = {
      name: document.getElementById('patient-name')?.value.trim(),
      phone: document.getElementById('patient-phone')?.value.trim(),
      location: document.getElementById('location-select')?.selectedOptions[0]?.textContent || '',
      service: document.getElementById('service-select')?.selectedOptions[0]?.textContent || '',
      comment: document.getElementById('booking-comment')?.value.trim(),
    };

    const message = buildTelegramMessage(data);

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const json = await response.json();

      if (!json.ok) throw new Error(json.description || 'Telegram API error');

      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Від!';
      showToast('Дякую!', 'Ваша заявка успішно відправлена.');

      setTimeout(() => {
        bookingForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.removeAttribute('disabled');
        }
      }, 3000);
    } catch (err) {
      console.error('Telegram send failed:', err);
      if (submitBtn) submitBtn.innerHTML = originalText;
      showToast('Помилка', 'Не вдалося відправити. Спробуйте ще раз.');
      if (submitBtn) submitBtn.removeAttribute('disabled');
    }
  });
});
