// Script para controlar o comportamento do formulário de login, incluindo validação de campos e exibição de mensagens de erro. O script também inclui um botão para recuperação de senha, que atualmente exibe um alerta indicando que a funcionalidade está em desenvolvimento.
(function () {
  'use strict';

  const form       = document.getElementById('loginForm');
  const errorEl    = document.getElementById('loginError');
  const forgotBtn  = document.getElementById('forgotBtn');

  if (!form) return;

  /**
   * @param {string} msg
   */
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function hideError() {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }

  function validateForm(username, password) {
    if (!username.trim()) {
      showError('Por favor, informe seu nome de usuário.');
      return false;
    }
    if (!password.trim()) {
      showError('Por favor, informe sua senha.');
      return false;
    }
    if (password.length < 4) {
      showError('A senha deve ter pelo menos 4 caracteres.');
      return false;
    }
    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideError();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!validateForm(username, password)) return;

    //Espera do back-end
    window.location.href = '../index.html';
  });

  if (forgotBtn) {
    forgotBtn.addEventListener('click', function () {
      alert('Funcionalidade de recuperação de senha em desenvolvimento.');
    });
  }

})();
