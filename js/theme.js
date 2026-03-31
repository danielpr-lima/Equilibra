'use strict';

function toggleTheme() {
  const html  = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next  = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('equilibra-theme', next);
  _updateThemeButton(next);
}

function _updateThemeButton(theme) {
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (!icon || !label) return;

  if (theme === 'dark') {
    icon.textContent  = '☀️';
    label.textContent = 'Modo claro';
  } else {
    icon.textContent  = '🌙';
    label.textContent = 'Modo noturno';
  }
}

(function applyStoredTheme() {
  const saved = localStorage.getItem('equilibra-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  const saved = localStorage.getItem('equilibra-theme') || 'light';
  _updateThemeButton(saved);

  const btn = document.getElementById('themeBtn');
  if (btn && !btn.getAttribute('onclick')) {
    btn.addEventListener('click', toggleTheme);
  }
});
