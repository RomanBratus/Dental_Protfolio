/**
 * Media Protection — запобігає прямому скачуванню фото/відео з сайту
 * Блокує: контекстне меню на медіа, drag&drop зображень, виділення медіа,
 * перетягування зображень, «Зберегти відео», скрін-кінець через клавіші.
 */

(function () {
  'use strict';

  var MEDIA_SELECTOR = 'img, video, audio, canvas, figure, .about-image-card';

  // 1. Контекстне меню (ПКМ) на медіа-елементах
  document.addEventListener('contextmenu', function (e) {
    var target = e.target;
    if (target.closest && target.closest(MEDIA_SELECTOR)) {
      e.preventDefault();
    }
  });

  // 2. Перетягування зображень (drag & drop у браузер/інший сайт)
  document.addEventListener('dragstart', function (e) {
    var target = e.target;
    if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      e.preventDefault();
    }
  });

  // 3. Блокуємо виділення медіа через клавіатуру (Ctrl+A на медіа-фокусі)
  document.addEventListener('keydown', function (e) {
    var target = e.target;
    var tag = target && target.tagName;
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
      if (tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS') {
        e.preventDefault();
      }
    }
  });

  // 4. Блокуємо «Зберегти як» для відео через клавішу (Ctrl+S)
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
    }
  });

  // 5. Приховуємо src-шлях у консолі при правому кліку (додатково)
  window.addEventListener('load', function () {
    var media = document.querySelectorAll(MEDIA_SELECTOR);
    media.forEach(function (el) {
      if (el.tagName === 'IMG') {
        el.setAttribute('draggable', 'false');
        el.style.webkitUserDrag = 'none';
      }
    });
  });
})();
