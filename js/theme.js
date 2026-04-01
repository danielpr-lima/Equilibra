'use strict';

// Função para alternar entre os temas claro e escuro, atualizando o atributo 'data-theme' no elemento <html> e salvando a preferência no localStorage. Também atualiza o ícone e o rótulo do botão de tema para refletir o estado atual.
function toggleTheme() {
  const html  = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next  = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('equilibra-theme', next);
  _updateThemeButton(next);
}

// Atualiza o ícone e o rótulo do botão de tema com base no tema atual. Se o tema for 'dark', exibe um ícone de sol e o rótulo "Modo claro". Caso contrário, exibe um ícone de lua e o rótulo "Modo noturno".
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

// Aplica o tema armazenado no localStorage ao carregar a página, garantindo que a preferência do usuário seja mantida entre as sessões. Se um tema estiver salvo, ele é aplicado definindo o atributo 'data-theme' no elemento <html>.
(function applyStoredTheme() {
  const saved = localStorage.getItem('equilibra-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

// Configura o botão de tema para alternar entre os temas claro e escuro, adicionando um listener de clique que chama a função toggleTheme. Também garante que o estado do botão seja atualizado corretamente com base no tema atual.
document.addEventListener('DOMContentLoaded', function () {
  const saved = localStorage.getItem('equilibra-theme') || 'light';
  _updateThemeButton(saved);

  const btn = document.getElementById('themeBtn');
  if (btn && !btn.getAttribute('onclick')) {
    btn.addEventListener('click', toggleTheme);
  }
});
