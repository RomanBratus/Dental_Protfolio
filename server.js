const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram configuration from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8717914768:AAEWpxMjbItLrUiG7FytiZ_TNt0shBHiUCg';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5024101596';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (your website)
app.use(express.static(path.join(__dirname)));

// Rate limiting: 5 submissions per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Занадто багато спроб. Спробуйте пізніше.' }
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, location, service, comment } = req.body;

    // Validate required fields
    if (!name || !phone || !location || !service) {
      return res.status(400).json({
        success: false,
        error: 'Будь ласка, заповніть всі обов\'язкові поля'
      });
    }

    // Build Telegram message
    const message = [
      '📝 *Запис пацієнта з сайту*',
      '',
      `👤 *Ім\'я:* ${escapeMarkdown(name)}`,
      `📞 *Телефон:* ${escapeMarkdown(phone)}`,
      `📍 *Локація:* ${escapeMarkdown(location)}`,
      `🦷 *Послуга:* ${escapeMarkdown(service)}`,
      `💬 *Коментар:* ${escapeMarkdown(comment || '—')}`,
      '',
      `*Час:* ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}`,
    ].join('\n');

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      console.error('Telegram API error:', telegramResult);
      return res.status(500).json({
        success: false,
        error: 'Помилка відправки в Telegram',
        details: telegramResult.description,
      });
    }

    // Success
    res.json({
      success: true,
      message: 'Заявка успішно відправлена',
      telegramMessageId: telegramResult.result?.message_id,
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера',
      details: error.message,
    });
  }
});

// Helper: escape Telegram Markdown special characters
function escapeMarkdown(text) {
  if (!text) return '';
  return String(text).replace(/[_*[\]()`~>#+=|{}.!\\-]/g, '\\$&');
}

// Catch-all: serve index.html for SPA routing (if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Telegram endpoint: /api/contact`);
  console.log(`🔑 Bot token configured: ${TELEGRAM_BOT_TOKEN ? 'YES' : 'NO'}`);
  console.log(`💬 Chat ID: ${TELEGRAM_CHAT_ID}`);
});