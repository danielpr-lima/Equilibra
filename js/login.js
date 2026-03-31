/**
 * login.js – Equilíbra
 * Lógica de validação e submissão do formulário de login.
 * Separa o comportamento do HTML (sem onclick inline).
 */

(function () {
  'use strict';

  const form       = document.getElementById('loginForm');
  const errorEl    = document.getElementById('loginError');
  const forgotBtn  = document.getElementById('forgotBtn');

  if (!form) return;

  /**
   * Exibe mensagem de erro de validação.
   * @param {string} msg
   */
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  /**
   * Esconde mensagem de erro.
   */
  function hideError() {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }

  /**
   * Validação básica do formulário.
   * Retorna true se válido, false caso contrário.
   */
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

  /* Submissão do formulário */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideError();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!validateForm(username, password)) return;

    /*
     * Aqui entraria a chamada real de autenticação (API/backend).
     * CORRIGIDO: redireciona para a página Início após login bem-sucedido.
     */
    window.location.href = '../index.html';
  });

  /* Botão "Esqueci a senha" */
  if (forgotBtn) {
    forgotBtn.addEventListener('click', function () {
      alert('Funcionalidade de recuperação de senha em desenvolvimento.');
    });
  }

})();
