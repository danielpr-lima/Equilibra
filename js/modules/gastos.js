// js/modules/gastos.js

import { state, persistAll } from './state.js';
import { formatBRL, formatDate, toast, CAT_EMOJI, CAT_LABEL } from './utils.js';
import { updatePlanejamento } from './planejamento.js';
import { updateGraficos } from './grafico.js';
import { updatePadroes } from './padroes.js';

/** Atualiza a lista de gastos na tela */
export function renderGastos() {
    const list = document.getElementById('gastoList');
    if (!list) return; // Trava de segurança
    
    const empty = document.getElementById('gastoEmpty');
    const totalEl = document.getElementById('totalGastos');

    // Calcula e mostra o total
    const total = state.gastos.reduce((s, g) => s + g.valor, 0);
    if(totalEl) totalEl.textContent = formatBRL(total);

    if (state.gastos.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    const recentes = [...state.gastos].reverse().slice(0, 10);

    list.innerHTML = recentes.map(g => `
    <div class="expense-item" data-id="${g.id}">
      <div class="expense-cat-icon">${CAT_EMOJI[g.categoria] || '📦'}</div>
      <div class="expense-info">
        <div class="expense-name">${g.nome}</div>
        <div class="expense-meta">${CAT_LABEL[g.categoria] || g.categoria} · ${formatDate(g.data)}</div>
      </div>
      <span class="expense-value">-${formatBRL(g.valor)}</span>
      <button class="expense-del" data-id="${g.id}" title="Remover">✕</button>
    </div>
  `).join('');

    list.querySelectorAll('.expense-del').forEach(btn => {
        btn.addEventListener('click', () => deleteGasto(Number(btn.dataset.id)));
    });
}

/** Adiciona um novo gasto, salva e atualiza a tela */
export function addGasto(gasto) {
    state.gastos.push({ ...gasto, id: state.nextGastoId++ });
    persistAll();
    renderGastos();
    
    if (document.getElementById('planCards')) updatePlanejamento();
    if (document.getElementById('pieChart')) updateGraficos();
    if (document.getElementById('padroesGrid')) updatePadroes();
    
    toast('✅ Gasto registrado!');
}

/** Remove um gasto pelo ID e atualiza a tela */
export function deleteGasto(id) {
    state.gastos = state.gastos.filter(g => g.id !== id);
    persistAll();
    renderGastos();
    
    if (document.getElementById('planCards')) updatePlanejamento();
    if (document.getElementById('pieChart')) updateGraficos();
    if (document.getElementById('padroesGrid')) updatePadroes();
    
    toast('🗑️ Gasto removido.');
}

/** Configura o formulário de cadastrar gasto */
export function initGastoForm() {
    const form = document.getElementById('gastoForm');
    if (!form) return; 

    const dataInput = document.getElementById('gastoData');
    dataInput.value = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', e => {
        e.preventDefault(); 
        const nome = document.getElementById('gastoNome').value.trim();
        const categoria = document.getElementById('gastoCategoria').value;
        const valor = parseFloat(document.getElementById('gastoValor').value);
        const data = document.getElementById('gastoData').value;
        const desc = document.getElementById('gastoDesc').value.trim();

        if (!nome || isNaN(valor) || valor <= 0 || !data) {
            toast('⚠️ Preencha todos os campos obrigatórios.');
            return;
        }

        addGasto({ nome, categoria, valor, data, desc });
        
        form.reset();
        dataInput.value = new Date().toISOString().split('T')[0];
    });

    const btnVerGrafico = document.getElementById('btnVerGrafico');
    if (btnVerGrafico) {
        btnVerGrafico.addEventListener('click', () => {
            window.location.href = 'grafico.html';
        });
    }
}