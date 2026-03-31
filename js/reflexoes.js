'use strict';

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

function _fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function renderReflexoes(list) {
  const container = document.querySelector('.reflexoes-list');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<p style="text-align:center;opacity:.6;padding:24px 0;font-size:.85rem">Nenhuma reflexão registrada ainda.</p>';
    return;
  }

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

document.addEventListener('DOMContentLoaded', function () {
  const textarea   = document.getElementById('reflexaoTexto');
  const saveBtn    = document.querySelector('.diary-actions .btn-ow');

  if (!textarea || !saveBtn) return;

  let reflexoes = _reflexLoad();
  renderReflexoes(reflexoes);

  saveBtn.addEventListener('click', function () {
    const texto = textarea.value.trim();
    if (!texto) {
    
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

    textarea.value = '';
    saveBtn.textContent = '✅ Salvo!';
    setTimeout(() => { saveBtn.textContent = 'Salvar reflexão'; }, 2000);
  });
});
