// Booking Form Submission & Toast Alert
const bookingForm = document.getElementById('appointment-form');
const toast = document.getElementById('toast-notification');

// ponytail: Backend endpoint for form submission (same origin)
const API_ENDPOINT = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/contact' : '/api/contact';

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

  // Validate required fields
  if (!data.name || !data.phone || !data.location || !data.service) {
    showToast('Увага', 'Будь ласка, заповніть всі обов\'язкові поля.');
    if (submitBtn) {
      submitBtn.innerHTML = originalText;
      submitBtn.removeAttribute('disabled');
    }
    return;
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      // Show error from backend
      showToast('Помилка!', result.error || 'Не вдалося відправити заявку. Спробуйте ще раз або зв\'яжіться з клінікою.');
    } else {
      // Show a friendly success message
      showToast('Дякую!', 'Ваша заявка успішно відправлена. Ми зв\'яжемося з вами найближчим часом.');
      // Reset the form only on success
      if (bookingForm) bookingForm.reset();
    }
  } catch (error) {
    // Network or server error
    showToast('Помилка!', 'Сталася помилка. Спробуйте ще раз або зателефонуйте нам.');
  }

  // Always re-enable the button
  if (submitBtn) {
    submitBtn.innerHTML = originalText;
    submitBtn.removeAttribute('disabled');
  }
});