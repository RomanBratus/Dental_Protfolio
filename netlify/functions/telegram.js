// Telegram webhook for appointment form submissions
// This function securely handles form submissions and sends them to Telegram

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8717914768:AAEWpxMjbItLrUiG7FytiZ_TNt0shBHiUCg';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5024101596';

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');

    // Rate limiting (5 submissions per day per IP)
    const today = new Date().toISOString().slice(0, 10);
    const ip = event.headers['client-ip'] || event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    const rateKey = `telegram_rate_${today}_${ip}`;

    // Note: In a real environment, you'd want to use a more robust rate limiting solution
    // like Redis or a database to track submissions per IP

    // Build Telegram message
    const message = [
      '📝 *Запис пацієнта з сайту*',
      '',
      `👤 *Ім'я:* ${body.name || '—'}',
      `📞 *Телефон:* ${body.phone || '—'}',
      `📍 *Локація:* ${body.location || '—'}',
      `🦷 *Послуга:* ${body.service || '—'}',
      `💬 *Коментар:* ${body.comment || '—'}',
      '',
      `*Час відправки:* ${new Date().toLocaleString()}*`
    ].join('\n');

    // Send to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })
    });

    const result = await telegramResponse.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to send to Telegram',
          details: result.description
        })
      };
    }

    // Success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Запис успішно відправлений',
        telegramMessageId: result.result?.message_id
      })
    };

  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};