(function () {
  'use strict';

  const pills = document.querySelectorAll('.mpill');

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      // Remove "on" de todas as pills
      pills.forEach(function (p) { p.classList.remove('on'); });
      // Ativa a pill clicada
      pill.classList.add('on');
    });
  });

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
