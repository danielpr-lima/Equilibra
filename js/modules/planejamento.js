// js/modules/planejamento.js

import { state, persistAll } from './state.js';
import { formatBRL, CAT_LABEL, toast } from './utils.js';

export function totalGastosMesAtual() {
    const hoje = new Date();
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    return state.gastos
        .filter(g => g.data && g.data.startsWith(mesAtual))
        .reduce((s, g) => s + g.valor, 0);
}

function calcularGastoSemana(semana) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const mesStr = `${ano}-${String(mes).padStart(2, '0')}`;
    const inicio = (semana - 1) * 7 + 1;
    const fim = semana * 7;

    return state.gastos
        .filter(g => {
            if (!g.data || !g.data.startsWith(mesStr)) return false;
            const dia = parseInt(g.data.split('-')[2], 10);
            return dia >= inicio && dia <= fim;
        })
        .reduce((s, g) => s + g.valor, 0);
}

function gerarSemanas() {
    const hoje = new Date();
    const semanaAtual = Math.ceil(hoje.getDate() / 7);
    return [1, 2, 3, 4].map(s => ({
        label: `Semana ${s}`,
        valor: calcularGastoSemana(s),
        atual: s === semanaAtual,
    }));
}

function gerarInsight() {
    const total = totalGastosMesAtual();
    if (state.gastos.length === 0) return 'Registre seus gastos para ver insights personalizados.';

    const porCat = {};
    state.gastos.forEach(g => { porCat[g.categoria] = (porCat[g.categoria] || 0) + g.valor; });
    const topCat = Object.entries(porCat).sort((a, b) => b[1] - a[1])[0];

    const limiteMsg = state.limite > 0
        ? ` Você usou ${Math.round((total / state.limite) * 100)}% do seu limite mensal.` : '';

    return `Você gastou mais em ${CAT_LABEL[topCat[0]] || topCat[0]} (${formatBRL(topCat[1])}).${limiteMsg}`;
}

export function updatePlanejamento() {
    if (!document.getElementById('planRenda')) return; 

    const totalMes = totalGastosMesAtual();
    const saldo = state.renda - totalMes;

    document.getElementById('planRenda').textContent = formatBRL(state.renda);
    document.getElementById('planGastos').textContent = formatBRL(totalMes);
    document.getElementById('planSaldo').textContent = formatBRL(Math.max(0, saldo));
    document.getElementById('planEconomia').textContent = formatBRL(Math.max(0, saldo * 0.2)); 

    const gastosChange = document.getElementById('planGastosChange');
    const pct = state.renda > 0 ? Math.round((totalMes / state.renda) * 100) : 0;
    gastosChange.textContent = `${pct}% da renda`;
    gastosChange.className = 'stat-change ' + (pct > 70 ? 'negative' : pct > 40 ? '' : 'positive');

    const saldoChange = document.getElementById('planSaldoChange');
    saldoChange.textContent = saldo >= 0 ? 'no positivo ✓' : 'negativo ⚠️';
    saldoChange.className = 'stat-change ' + (saldo >= 0 ? 'positive' : 'negative');

    const semanas = gerarSemanas();
    document.getElementById('weeklyGrid').innerHTML = semanas.map(s => `
    <div class="week-card ${s.atual ? 'current' : ''}">
      <div class="week-label">${s.label}</div>
      <div class="week-value">${formatBRL(s.valor)}</div>
    </div>
  `).join('');

    document.getElementById('insightText').textContent = gerarInsight();

    const limitBarWrap = document.getElementById('limitBarWrap');
    if (state.limite > 0) {
        limitBarWrap.style.display = 'block';
        const pctLimite = Math.min(100, Math.round((totalMes / state.limite) * 100));
        document.getElementById('limitPercText').textContent = pctLimite + '%';
        const fill = document.getElementById('limitFill');
        fill.style.width = pctLimite + '%';
        fill.className = 'limit-fill' + (pctLimite > 80 ? ' danger' : '');
    } else {
        limitBarWrap.style.display = 'none';
    }
}

export function initPlanejamentoForm() {
    const form = document.getElementById('rendaForm');
    if (!form) return; 

    if (state.renda) document.getElementById('rendaValor').value = state.renda;
    if (state.limite) document.getElementById('limiteMensal').value = state.limite;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const renda = parseFloat(document.getElementById('rendaValor').value);
        const limite = parseFloat(document.getElementById('limiteMensal').value);

        if (!isNaN(renda) && renda > 0) state.renda = renda;
        if (!isNaN(limite) && limite > 0) state.limite = limite;

        persistAll();
        updatePlanejamento();
        toast('📊 Planejamento atualizado!');
    });

    document.getElementById('btnDefinirLimite').addEventListener('click', () => {
        const limite = parseFloat(document.getElementById('limiteMensal').value);
        if (!isNaN(limite) && limite > 0) {
            state.limite = limite;
            persistAll();
            updatePlanejamento();
            toast('🔒 Limite definido: ' + formatBRL(limite));
        } else {
            toast('⚠️ Informe um limite válido.');
        }
    });
}