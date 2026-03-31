/**
 * mood.js – Equilíbra
 * Lógica de interação das pills de humor e emojis no Diário.
 * Separado do HTML (sem onclick inline).
 */

(function () {
  'use strict';

  /* ---- Pills de humor ---- */
  const pills = document.querySelectorAll('.mpill');

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      // Remove "on" de todas as pills
      pills.forEach(function (p) { p.classList.remove('on'); });
      // Ativa a pill clicada
      pill.classList.add('on');
    });
  });

  /* ---- Emojis de mood ---- */
  const mimgs = document.querySelectorAll('.mimg');

  mimgs.forEach(function (mimg) {
    mimg.addEventListener('click', function () {
      // Remove "on" de todos os emojis
      mimgs.forEach(function (m) { m.classList.remove('on'); });
      // Ativa o emoji clicado
      mimg.classList.add('on');
    });
  });

})();
