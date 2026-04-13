// js/modules/metas.js

import { state, persistAll } from './state.js';
import { formatBRL, formatMonth, toast } from './utils.js';

/** Atualiza a lista de metas na tela pegando os dados do 'state' */
export function renderMetas() {
    const list = document.getElementById('metasList');
    if (!list) return; // Trava de segurança (só roda se estiver na página de metas)
    
    const empty = document.getElementById('metasEmpty');

    if (state.metas.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    list.innerHTML = state.metas.map(m => `
    <div class="meta-item" data-id="${m.id}">
      <div class="meta-item-header">
        <span class="meta-item-name">${m.nome}</span>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="meta-item-val">${formatBRL(m.valor)}</span>
          <button class="meta-del" data-id="${m.id}" title="Remover">✕</button>
        </div>
      </div>
      <div class="meta-bar-wrap">
        <div class="meta-bar-fill" style="width:${m.progresso}%"></div>
      </div>
      <div class="meta-footer">
        <span class="meta-pct">${m.progresso}% concluído</span>
        <span class="meta-prazo">Prazo: ${formatMonth(m.prazo)}</span>
      </div>
    </div>
  `).join('');

    // Adiciona o evento de clique nos botões "X"
    list.querySelectorAll('.meta-del').forEach(btn => {
        btn.addEventListener('click', () => deleteMeta(Number(btn.dataset.id)));
    });
}

/** Apaga uma meta pelo ID e atualiza a tela */
export function deleteMeta(id) {
    state.metas = state.metas.filter(m => m.id !== id);
    persistAll();
    renderMetas();
    toast('🗑️ Meta removida.');
}

/** Configura o formulário de cadastrar nova meta e a barra que arrasta (range) */
export function initMetaForm() {
    const form = document.getElementById('metaForm');
    if (!form) return; 

    const rangeEl = document.getElementById('metaProgresso');
    const rangeValEl = document.getElementById('metaProgressoVal');

    // Atualiza a % em texto enquanto o usuário arrasta a barra
    rangeEl.addEventListener('input', () => {
        rangeValEl.textContent = rangeEl.value + '%';
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nome = document.getElementById('metaNome').value.trim();
        const valor = parseFloat(document.getElementById('metaValor').value);
        const prazo = document.getElementById('metaPrazo').value;
        const progresso = parseInt(rangeEl.value, 10);

        if (!nome || isNaN(valor) || valor <= 0 || !prazo) {
            toast('⚠️ Preencha todos os campos da meta.');
            return;
        }

        // Salva a nova meta
        state.metas.push({ id: state.nextMetaId++, nome, valor, prazo, progresso });
        persistAll();
        renderMetas();
        toast('🎯 Meta adicionada!');
        
        // Limpa o formulário
        form.reset();
        rangeEl.value = 0;
        rangeValEl.textContent = '0%';
    });
}