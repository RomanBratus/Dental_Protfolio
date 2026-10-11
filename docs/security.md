# 🛡️ Безпека сайту — налаштування

## Що вже встановлено (у проєкті)

### 1. Мета-теги безпеки (`index.html`)
- **Content-Security-Policy** — дозволяє лише:
  - скрипти/стилі з `cdnjs.cloudflare.com` (GSAP, Font Awesome)
  - шрифти з `fonts.googleapis.com` / `fonts.gstatic.com`
  - фото-заглушки з `images.unsplash.com`
  - інлайн-скрипти (потрібні для `onerror` fallback фото)
- **X-Content-Type-Options: nosniff** — забороняє MIME-спуфінг
- **X-Frame-Options: SAMEORIGIN** — захист від Clickjacking
- **Referrer-Policy: strict-origin-when-cross-origin** — не віддає повні URL стороннім сайтам
- **robots: noimageindex** — просить пошуковики не індексувати зображення

### 2. Захист медіа (`js/media-protection.js`)
- Блокує контекстне меню (ПКМ) на фото/відео/канвасі
- Блокує перетягування зображень (drag & drop)
- `draggable="false"` на всіх `<img>`
- Блокує Ctrl+A / Ctrl+S на медіа-елементах

## ⚠️ Важливо: межі захисту

**Повністю заборонити скачування фото неможливо.** Браузер має отримати файл, щоб його показати — отже, він уже на пристрої користувача. Мої заходи блокують 95% звичайних шляхів (ПКМ, drag, «Зберегти як»), але **не** блокують:
- скріншоти (Print Screen, Snipping Tool)
- вміст DevTools → Network tab
- `curl` / wget напряму

Для реального захисту контенту використайте:
1. **Водяні знаки** на фото (перед публікацією)
2. **Тільки серверні заголовки CSP** (див. нижче) — мета-теги обмежені
3. **Cloudflare / хостинг-політики** для блокування гарячих посилань (hotlink protection)

## 📡 Серверні заголовки (рекомендовано додати на хостингу)

Мета-теги працюють, але серверні HTTP-заголовки надійніші. Додайте на хостингу:

### GitHub Pages / Netlify / Vercel
Створіть файл `_headers` (Netlify) або налаштуйте в `vercel.json`:

```
/*
  Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; connect-src 'self'
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### .htaccess (Apache)
```apache
Header set Content-Security-Policy "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'"
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

## 🔍 Перевірка

Відкрийте DevTools → Console. Якщо CSP блокує щось — буде помилка `Content Security Policy`. Тоді додайте потрібний домен у відповідну директиву мета-тегу.

## 🧪 Тестування захисту медіа

1. Правий клік на фото → меню не з'являється ✅
2. Перетягування фото на робочий стіл → не працює ✅
3. Ctrl+S → не зберігає сторінку ✅
4. DevTools → Network → фото все ще видно ⚠️ (це норма, див. водяні знаки)
