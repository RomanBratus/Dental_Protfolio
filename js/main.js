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
    `👤 *Ім'я:* ${data.name}`,
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

  // Since we removed Netlify, we cannot send to Telegram directly.
  // Show a message that the backend is not configured.
  showToast('Увага', "Форма відправки повідомлення тимчасово недоступна. Будь ласка, зв'яжіться з клінікою телефоном або електронною поштою.");
  if (submitBtn) {
    submitBtn.innerHTML = originalText;
    submitBtn.removeAttribute('disabled');
  }

  // Log the data for debugging (optional)
  console.log('Form submission data:', data);
});