# Dental Portfolio Backend

Simple Node.js/Express backend for handling form submissions and sending to Telegram.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your Telegram credentials
   ```

3. Run locally:
   ```bash
   npm start
   ```

## Deployment

This backend can be deployed to any Node.js hosting service:
- Render.com (free tier)
- Railway.app (free tier)
- Fly.io (free tier)
- etc.

## API Endpoint

POST `/api/contact`

Body:
```json
{
  "name": "John Doe",
  "phone": "+380XXXXXXXXX",
  "location": "Kyiv",
  "service": "Consultation",
  "comment": "I want to book an appointment"
}
```

Response:
```json
{
  "success": true,
  "message": "Заявка успішно відправлена",
  "telegramMessageId": 123
}
```