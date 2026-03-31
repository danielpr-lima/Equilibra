/**
 * reflexoes.js – Equilíbra
 * Persiste reflexões do usuário no localStorage e renderiza os cards.
 * Conecta-se à página reflexoes.html de forma não-intrusiva.
 */

'use strict';

/* ── Utilitários de armazenamento (mesmo prefixo do script.js) ── */
function _reflexLoad() {
  try {
    const raw = localStorage.getItem('equilibra_reflexoes');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function _reflexSave(list) {
  try {
    localStorage.setItem('equilibra_reflexoes', JSON.stringify(list));
  } catch { /* silencioso */ }
}

/* ── Formata data ISO para DD/MM/AAAA ── */
function _fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/* ── Renderiza lista de reflexões ── */
function renderReflexoes(list) {
  const container = document.querySelector('.reflexoes-list');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<p style="text-align:center;opacity:.6;padding:24px 0;font-size:.85rem">Nenhuma reflexão registrada ainda.</p>';
    return;
  }

  /* Mostra as 10 mais recentes */
  const recentes = [...list].reverse().slice(0, 10);

  container.innerHTML = recentes.map(r => `
    <article class="reflexao-card">
      <div class="reflexao-header">
        <span class="reflexao-data">${_fmtDate(r.data)}</span>
        <span class="reflexao-humor">${r.humor || '📝 Reflexão'}</span>
      </div>
      <p class="reflexao-texto">${r.texto}</p>
    </article>
  `).join('');
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function () {
  const textarea   = document.getElementById('reflexaoTexto');
  const saveBtn    = document.querySelector('.diary-actions .btn-ow');

  if (!textarea || !saveBtn) return;

  /* Carrega e exibe reflexões existentes */
  let reflexoes = _reflexLoad();
  renderReflexoes(reflexoes);

  /* Salva ao clicar no botão */
  saveBtn.addEventListener('click', function () {
    const texto = textarea.value.trim();
    if (!texto) {
      /* Feedback visual simples */
      textarea.style.borderColor = '#ef4444';
      textarea.placeholder = '⚠️ Escreva algo antes de salvar...';
      setTimeout(() => {
        textarea.style.borderColor = '';
        textarea.placeholder = 'Escreva aqui sobre suas finanças hoje...';
      }, 2000);
      return;
    }

    const novaReflexao = {
      id:    Date.now(),
      data:  new Date().toISOString().split('T')[0],
      humor: '📝 Reflexão',
      texto,
    };

    reflexoes.push(novaReflexao);
    _reflexSave(reflexoes);
    renderReflexoes(reflexoes);

    /* Reset e feedback */
    textarea.value = '';
    saveBtn.textContent = '✅ Salvo!';
    setTimeout(() => { saveBtn.textContent = 'Salvar reflexão'; }, 2000);
  });
});
