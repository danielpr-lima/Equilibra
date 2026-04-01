// Script para controlar o comportamento do menu hambúrguer na navegação, permitindo que os usuários abram e fechem o menu em dispositivos móveis. O script também fecha o menu quando um link é clicado ou quando o usuário clica fora do menu.
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('navHamburger');
    var navLinks  = document.querySelector('nav .nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
