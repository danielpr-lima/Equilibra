// js/modules/padroes.js

import { state } from './state.js';
import { formatBRL, CAT_LABEL, CAT_EMOJI } from './utils.js';
import { totalGastosMesAtual } from './planejamento.js';

function analisarPadroes() {
    const total = state.gastos.reduce((s, g) => s + g.valor, 0);

    const impulsivo = state.gastos.filter(g => ['lazer', 'outros', 'vestuario'].includes(g.categoria)).reduce((s, g) => s + g.valor, 0);
    const pctImpulso = total > 0 ? Math.round((impulsivo / total) * 100) : 0;

    const gastosMes = totalGastosMesAtual();
    const pctPlanej = state.renda > 0 ? Math.round(((state.renda - gastosMes) / state.renda) * 100) : 50;
    const economiaPct = Math.max(0, Math.min(100, pctPlanej));

    const alim = state.gastos.filter(g => g.categoria === 'alimentacao').reduce((s, g) => s + g.valor, 0);
    const pctAlim = total > 0 ? Math.round((alim / total) * 100) : 0;

    const saude = state.gastos.filter(g => g.categoria === 'saude').reduce((s, g) => s + g.valor, 0);
    const pctSaude = total > 0 ? Math.round((saude / total) * 100) : 0;

    return [
        { nome: 'Compras por impulso', desc: `${pctImpulso}% dos gastos são em lazer, vestuário ou outros`, icon: '🛍️', pct: pctImpulso, cor: pctImpulso > 30 ? '#f87171' : '#a855f7' },
        { nome: 'Economia planejada', desc: `${economiaPct}% da renda disponível ainda não foi gasta`, icon: '💰', pct: economiaPct, cor: economiaPct > 20 ? '#34d399' : '#fbbf24' },
        { nome: 'Gastos com alimentação', desc: `${pctAlim}% do total gasto em alimentação`, icon: '🍔', pct: pctAlim, cor: '#a855f7' },
        { nome: 'Investimento em saúde', desc: `${pctSaude}% destinado à saúde e bem-estar`, icon: '💊', pct: pctSaude, cor: '#34d399' },
    ];
}

function gerarInsights() {
    const insights = [];
    const total = state.gastos.reduce((s, g) => s + g.valor, 0);
    const totalMes = totalGastosMesAtual();

    if (state.gastos.length === 0) return [{ icon: '💡', texto: 'Registre seus gastos para ver insights personalizados.' }];

    const porCat = {};
    state.gastos.forEach(g => { porCat[g.categoria] = (porCat[g.categoria] || 0) + g.valor; });
    const topCat = Object.entries(porCat).sort((a, b) => b[1] - a[1])[0];
    if (topCat) insights.push({ icon: '📊', texto: `Você gastou ${Math.round((topCat[1] / total) * 100)}% do total em ${CAT_LABEL[topCat[0]] || topCat[0]}.` });

    if (state.renda > 0 && totalMes > 0) {
        const pctRenda = Math.round((totalMes / state.renda) * 100);
        if (pctRenda > 80) insights.push({ icon: '⚠️', texto: `Atenção: você já usou ${pctRenda}% da sua renda mensal!` });
        else if (pctRenda < 40) insights.push({ icon: '🎉', texto: `Parabéns! Você usou apenas ${pctRenda}% da renda este mês.` });
    }

    const metaQuase = state.metas.find(m => m.progresso >= 85);
    if (metaQuase) insights.push({ icon: '🎯', texto: `Sua meta "${metaQuase.nome}" está quase completa (${metaQuase.progresso}%)!` });

    if (state.emocional.length >= 2) {
        const ultimos = state.emocional.slice(-3);
        if (ultimos.filter(e => ['ansioso', 'mal', 'exagero'].includes(e.mood)).length >= 2) {
            insights.push({ icon: '🧘', texto: 'Você registrou emoções negativas recentemente. Que tal revisar seus gastos impulsivos?' });
        }
    }

    if (insights.length === 0) insights.push({ icon: '✨', texto: 'Suas finanças estão equilibradas. Continue assim!' });
    return insights;
}

export function updatePadroes() {
    const grid = document.getElementById('padroesGrid');
    if (!grid) return; 

    grid.innerHTML = analisarPadroes().map(p => `
    <div class="padrao-card">
      <div class="padrao-icon-wrap">${p.icon}</div>
      <div class="padrao-name">${p.nome}</div>
      <div class="padrao-desc">${p.desc}</div>
      <div class="padrao-meter"><div class="padrao-meter-fill" style="width:${p.pct}%; background:${p.cor}"></div></div>
    </div>
  `).join('');

    document.getElementById('insightsList').innerHTML = gerarInsights().map(i => `
    <div class="insight-item"><span class="insight-item-icon">${i.icon}</span><span class="insight-item-text">${i.texto}</span></div>
  `).join('');

    const porCat = {};
    state.gastos.forEach(g => { porCat[g.categoria] = (porCat[g.categoria] || 0) + g.valor; });
    const sorted = Object.entries(porCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxVal = sorted.length > 0 ? sorted[0][1] : 1;

    document.getElementById('rankList').innerHTML = sorted.length === 0
        ? '<p class="empty-state" style="padding:8px 0">Nenhum gasto registrado.</p>'
        : sorted.map(([cat, val]) => `
        <div class="rank-item">
          <span class="rank-label">${CAT_EMOJI[cat] || '📦'} ${CAT_LABEL[cat] || cat}</span>
          <div class="rank-bar-wrap"><div class="rank-bar-fill" style="width:${Math.round((val / maxVal) * 100)}%"></div></div>
          <span class="rank-val">${formatBRL(val)}</span>
        </div>
      `).join('');
}