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
  // Telegram bot credentials are now handled by Netlify function
  // The actual token is stored securely in Netlify environment variables
  const TELEGRAM_ENDPOINT = '/.netlify/functions/telegram';

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

  // ponytail: mutual exclusivity — selecting one list resets the other
    const consultationSelect = document.getElementById('consultation-select');
    const procedureSelect = document.getElementById('procedure-select');
    if (consultationSelect && procedureSelect) {
      consultationSelect.addEventListener('change', () => { if (consultationSelect.value) procedureSelect.value = ''; });
      procedureSelect.addEventListener('change', () => { if (procedureSelect.value) consultationSelect.value = ''; });
    }

    bookingForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML ?? 'Надіслати';

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Відправка...';
      submitBtn.setAttribute('disabled', 'true');
    }

    const consultationVal = consultationSelect?.value || '';
    const procedureVal = procedureSelect?.value || '';
    const serviceLabel = (procedureVal ? procedureSelect.selectedOptions[0].textContent : '')
      || (consultationVal ? consultationSelect.selectedOptions[0].textContent : '');

    const data = {
      name: document.getElementById('patient-name')?.value.trim(),
      phone: document.getElementById('patient-phone')?.value.trim(),
      location: document.getElementById('location-select')?.selectedOptions[0]?.textContent || '',
      service: serviceLabel,
      comment: document.getElementById('booking-comment')?.value.trim(),
    };

    const message = buildTelegramMessage(data);

    // ponytail: rate limit 5 submissions/day per device via localStorage
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem('bookingDate');
    const count = stored === today ? (parseInt(localStorage.getItem('bookingCount')) || 0) : 0;
    if (count >= 5) {
      showToast('Вибачте!', "З вашого пристрою вже відправлено 5 заявок сьогодні. Лікар ознайомиться з ними і вийде з вами на зв'язок. Очікуйте.");
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.removeAttribute('disabled');
      }
      return;
    }

    try {
      const response = await fetch(TELEGRAM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          location: data.location,
          service: data.service,
          comment: data.comment,
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (status ${response.status}): ${text.substring(0, 100)}`);
      }

      const json = await response.json();

      if (!json.success) throw new Error(json.error || 'Telegram API error');

      // Update localStorage counter
      localStorage.setItem('bookingDate', today);
      localStorage.setItem('bookingCount', String(count + 1));

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
