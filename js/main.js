// Booking Form Submission & Toast Alert
const bookingForm = document.getElementById('appointment-form');
const toast = document.getElementById('toast-notification');

const TELEGRAM_BOT_TOKEN = '8717914768:AAEWpxMjbItLrUiG7FytiZ_TNt0shBHiUCg';
const TELEGRAM_CHAT_ID = '-5024101596';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

function showToast(title, message) {
  const titleEl = toast?.querySelector('.toast-title');
  const msgEl = toast?.querySelector('.toast-msg');
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

function buildMessage(data) {
  return [
    '📝 <b>Запис пацієнта з сайту</b>',
    '',
    `<b>Ім'я:</b> ${data.name}`,
    `<b>Телефон:</b> ${data.phone}`,
    `<b>Локація:</b> ${data.location}`,
    `<b>Послуга:</b> ${data.service}`,
    `<b>Коментар:</b> ${data.comment || '—'}`,
  ].join('\n');
}

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

  if (!data.name || !data.phone || !data.location || !data.service) {
    showToast('Увага', 'Будь ласка, заповніть всі обов\'язкові поля.');
    if (submitBtn) {
      submitBtn.innerHTML = originalText;
      submitBtn.removeAttribute('disabled');
    }
    return;
  }

  try {
    const response = await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: buildMessage(data),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      showToast('Помилка!', result.description || 'Не вдалося відправити заявку.');
    } else {
      showToast('Дякую!', 'Ваша заявка успішно відправлена. Ми зв\'яжемося з вами найближчим часом.');
      bookingForm.reset();
    }
  } catch (error) {
    showToast('Помилка!', 'Сталася помилка. Спробуйте ще раз.');
  }

  if (submitBtn) {
    submitBtn.innerHTML = originalText;
    submitBtn.removeAttribute('disabled');
  }
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme') || root.getAttribute('data-theme') || 'dark';
root.setAttribute('data-theme', storedTheme);

function updateThemeIcon(theme) {
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

if (themeToggle) {
  updateThemeIcon(storedTheme);
  themeToggle.addEventListener('click', () => {
    const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

// FAQ accordion functionality
document.querySelectorAll('.faq-header').forEach((button) => {
  button.addEventListener('click', () => {
    const faqItem = button.closest('.faq-item');
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    faqItem?.classList.toggle('active');
  });
});

// Ensure hero background video autoplays on mobile
const heroVideo = document.querySelector('.hero-bg');
if (heroVideo) {
  const playVideo = () => {
    heroVideo.play().catch(e => {
      console.warn('Hero video autoplay failed (may require user interaction):', e);
    });
  };

  if (heroVideo.readyState >= 2) {
    playVideo();
  } else {
    heroVideo.addEventListener('loadeddata', playVideo, { once: true });
    heroVideo.addEventListener('canplay', playVideo, { once: true });
  }

  // Also try on first user interaction (mobile workaround)
  document.addEventListener('touchstart', playVideo, { once: true });
  document.addEventListener('click', playVideo, { once: true });
}