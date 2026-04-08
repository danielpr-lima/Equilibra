'use strict';

// ==========================================================================
// 1. GERENCIAMENTO DE DADOS (LOCALSTORAGE)
// ==========================================================================

/**
 * Busca os dados salvos no navegador (LocalStorage).
 * Se não existir nada salvo, retorna os dados de "fallback" (dados falsos/iniciais).
 */
function loadState(key, fallback) {
    try {
        const saved = localStorage.getItem('equilibra_' + key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

/**
 * Salva uma informação no navegador (LocalStorage) para não perder ao atualizar a página.
 */
function saveState(key, value) {
    try {
        localStorage.setItem('equilibra_' + key, JSON.stringify(value));
    } catch { /* silencioso */ }
}

// ==========================================================================
// 2. DADOS INICIAIS (MOCKS) E ESTADO GLOBAL
// ==========================================================================
// Esses são os dados falsos para quando o usuário entra pela primeira vez.

const MOCK_GASTOS = [
    { id: 1, nome: 'Mercado', categoria: 'alimentacao', valor: 145.80, data: '2026-03-20', desc: '' },
    { id: 2, nome: 'Uber', categoria: 'transporte', valor: 28.50, data: '2026-03-22', desc: '' },
    { id: 3, nome: 'Cinema', categoria: 'lazer', valor: 52.00, data: '2026-03-24', desc: 'Compra por impulso 😅' },
    { id: 4, nome: 'Farmácia', categoria: 'saude', valor: 67.30, data: '2026-03-25', desc: '' },
    { id: 5, nome: 'Streaming', categoria: 'lazer', valor: 39.90, data: '2026-03-26', desc: '' },
];

const MOCK_METAS = [
    { id: 1, nome: 'Reserva de emergência', valor: 10000, progresso: 72, prazo: '2026-12' },
    { id: 2, nome: 'Viagem nas férias', valor: 4000, progresso: 40, prazo: '2026-07' },
    { id: 3, nome: 'Notebook novo', valor: 3500, progresso: 88, prazo: '2026-05' },
];

const MOCK_EMOCIONAL = [
    { id: 1, data: '2026-03-23', mood: 'otimo', emoji: '😌', rotulo: 'Ótimo', texto: 'Consegui resistir à tentação de comprar algo por impulso. Cada vitória conta!' },
    { id: 2, data: '2026-03-20', mood: 'ansioso', emoji: '😰', rotulo: 'Ansioso', texto: 'Gastei mais do que planejava esta semana. Preciso revisar meu orçamento.' },
];

// 'state' é o cérebro do app. Aqui ficam guardadas todas as informações atuais do usuário.
const state = {
    gastos: loadState('gastos', MOCK_GASTOS),
    metas: loadState('metas', MOCK_METAS),
    emocional: loadState('emocional', MOCK_EMOCIONAL),
    renda: loadState('renda', 3500),
    limite: loadState('limite', 0),
    nextGastoId: loadState('nextGastoId', MOCK_GASTOS.length + 1),
    nextMetaId: loadState('nextMetaId', MOCK_METAS.length + 1),
    nextEmocId: loadState('nextEmocId', MOCK_EMOCIONAL.length + 1),
    selectedMood: null,
};

/**
 * Salva TODO o 'state' de uma vez no LocalStorage.
 * Chamada sempre que o usuário adiciona, altera ou apaga alguma coisa.
 */
function persistAll() {
    saveState('gastos', state.gastos);
    saveState('metas', state.metas);
    saveState('emocional', state.emocional);
    saveState('renda', state.renda);
    saveState('limite', state.limite);
    saveState('nextGastoId', state.nextGastoId);
    saveState('nextMetaId', state.nextMetaId);
    saveState('nextEmocId', state.nextEmocId);
}

// ==========================================================================
// 3. FUNÇÕES UTILITÁRIAS (AJUDANTES)
// ==========================================================================

/** Formata um número comum para o formato de dinheiro brasileiro (Ex: R$ 1.500,00) */
function formatBRL(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Transforma a data do sistema (2026-03-20) para o padrão brasileiro (20/03/2026) */
function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

/** Formata mês e ano (Ex: de 2026-03 para 03/2026) */
function formatMonth(ym) {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    return `${m}/${y}`;
}

/** Cria um ID único baseado na data e hora atual */
function uid() {
    return Date.now();
}

// Dicionários para converter as categorias em emojis ou nomes amigáveis
const CAT_EMOJI = {
    alimentacao: '🍔', transporte: '🚗', lazer: '🎮',
    saude: '💊', educacao: '📚', moradia: '🏠',
    vestuario: '👗', outros: '📦',
};

const CAT_LABEL = {
    alimentacao: 'Alimentação', transporte: 'Transporte', lazer: 'Lazer',
    saude: 'Saúde', educacao: 'Educação', moradia: 'Moradia',
    vestuario: 'Vestuário', outros: 'Outros',
};

/**
 * Exibe aquela mensagem flutuante (Toast) na parte inferior da tela.
 */
function toast(msg, duracao = 2800) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duracao);
}

/** Calcula a soma de todos os gastos feitos apenas no mês atual */
function totalGastosMesAtual() {
    const hoje = new Date();
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    return state.gastos
        .filter(g => g.data && g.data.startsWith(mesAtual))
        .reduce((s, g) => s + g.valor, 0);
}

// ==========================================================================
// 4. MÓDULO: GASTOS
// ==========================================================================

/** Atualiza a lista de gastos na tela pegando os dados do 'state' */
function renderGastos() {
    const list = document.getElementById('gastoList');
    if (!list) return; // Trava de segurança
    const empty = document.getElementById('gastoEmpty');
    const totalEl = document.getElementById('totalGastos');

    // Calcula e mostra o total geral de gastos
    const total = state.gastos.reduce((s, g) => s + g.valor, 0);
    totalEl.textContent = formatBRL(total);

    // Se não tiver gastos, mostra a mensagem de "Nenhum gasto registrado"
    if (state.gastos.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    // Pega só os últimos 10 gastos para não encher a tela
    const recentes = [...state.gastos].reverse().slice(0, 10);

    // Cria o HTML de cada gasto e joga na tela
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

    // Adiciona o evento de click para apagar o gasto nos botões "X"
    list.querySelectorAll('.expense-del').forEach(btn => {
        btn.addEventListener('click', () => deleteGasto(Number(btn.dataset.id)));
    });
}

/** Adiciona um novo gasto, salva e atualiza a tela toda */
function addGasto(gasto) {
    state.gastos.push({ ...gasto, id: state.nextGastoId++ });
    persistAll();
    renderGastos();
    updatePlanejamento();
    updateGraficos();
    updatePadroes();
    toast('✅ Gasto registrado!');
}

/** Remove um gasto pelo ID, salva e atualiza a tela toda */
function deleteGasto(id) {
    state.gastos = state.gastos.filter(g => g.id !== id);
    persistAll();
    renderGastos();
    updatePlanejamento();
    updateGraficos();
    updatePadroes();
    toast('🗑️ Gasto removido.');
}

/** Configura o formulário de cadastrar gasto (preenche a data de hoje, cuida do clique em "Registrar") */
function initGastoForm() {
    const form = document.getElementById('gastoForm');
    if (!form) return; // Trava de segurança

    const dataInput = document.getElementById('gastoData');
    dataInput.value = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', e => {
        e.preventDefault(); // Evita recarregar a página
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

// ==========================================================================
// 5. MÓDULO: METAS
// ==========================================================================

/** Atualiza a lista de metas na tela pegando os dados do 'state' */
function renderMetas() {
    const list = document.getElementById('metasList');
    if (!list) return; // Trava de segurança
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

    list.querySelectorAll('.meta-del').forEach(btn => {
        btn.addEventListener('click', () => deleteMeta(Number(btn.dataset.id)));
    });
}

/** Apaga uma meta pelo ID e atualiza a tela */
function deleteMeta(id) {
    state.metas = state.metas.filter(m => m.id !== id);
    persistAll();
    renderMetas();
    toast('🗑️ Meta removida.');
}

/** Configura o formulário de cadastrar nova meta e a barra que arrasta (range) */
function initMetaForm() {
    const form = document.getElementById('metaForm');
    if (!form) return; // Trava de segurança

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

        state.metas.push({ id: state.nextMetaId++, nome, valor, prazo, progresso });
        persistAll();
        renderMetas();
        toast('🎯 Meta adicionada!');
        form.reset();
        rangeEl.value = 0;
        rangeValEl.textContent = '0%';
    });
}

// ==========================================================================
// 6. MÓDULO: PLANEJAMENTO (Orçamento)
// ==========================================================================

/** Quebra o mês atual em 4 semanas para mostrar nos quadradinhos */
function gerarSemanas() {
    const hoje = new Date();
    const semanaAtual = Math.ceil(hoje.getDate() / 7);
    return [1, 2, 3, 4].map(s => ({
        label: `Semana ${s}`,
        valor: calcularGastoSemana(s),
        atual: s === semanaAtual,
    }));
}

/** Calcula a soma de gastos feitos em uma semana específica (ex: Semana 1, Semana 2) */
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

/** Gera a frase de aviso na caixa do Planejamento baseada no maior gasto */
function gerarInsight() {
    const total = totalGastosMesAtual();
    if (state.gastos.length === 0) return 'Registre seus gastos para ver insights personalizados.';

    const porCat = {};
    state.gastos.forEach(g => {
        porCat[g.categoria] = (porCat[g.categoria] || 0) + g.valor;
    });
    const topCat = Object.entries(porCat).sort((a, b) => b[1] - a[1])[0];

    const limiteMsg = state.limite > 0
        ? ` Você usou ${Math.round((total / state.limite) * 100)}% do seu limite mensal.`
        : '';

    return `Você gastou mais em ${CAT_LABEL[topCat[0]] || topCat[0]} (${formatBRL(topCat[1])}).${limiteMsg}`;
}

/** Atualiza os cartões principais do planejamento (Renda, Gastos, Saldo, etc) */
function updatePlanejamento() {
    if (!document.getElementById('planRenda')) return; // Trava de segurança

    const totalMes = totalGastosMesAtual();
    const saldo = state.renda - totalMes;

    document.getElementById('planRenda').textContent = formatBRL(state.renda);
    document.getElementById('planGastos').textContent = formatBRL(totalMes);
    document.getElementById('planSaldo').textContent = formatBRL(Math.max(0, saldo));
    document.getElementById('planEconomia').textContent = formatBRL(Math.max(0, saldo * 0.2)); // Simula que 20% é economia

    // Muda as cores de texto (verde/vermelho) dependendo do andamento
    const gastosChange = document.getElementById('planGastosChange');
    const pct = state.renda > 0 ? Math.round((totalMes / state.renda) * 100) : 0;
    gastosChange.textContent = `${pct}% da renda`;
    gastosChange.className = 'stat-change ' + (pct > 70 ? 'negative' : pct > 40 ? '' : 'positive');

    const saldoChange = document.getElementById('planSaldoChange');
    saldoChange.textContent = saldo >= 0 ? 'no positivo ✓' : 'negativo ⚠️';
    saldoChange.className = 'stat-change ' + (saldo >= 0 ? 'positive' : 'negative');

    // Desenha as "Semanas"
    const semanas = gerarSemanas();
    const weeklyGrid = document.getElementById('weeklyGrid');
    weeklyGrid.innerHTML = semanas.map(s => `
    <div class="week-card ${s.atual ? 'current' : ''}">
      <div class="week-label">${s.label}</div>
      <div class="week-value">${formatBRL(s.valor)}</div>
    </div>
  `).join('');

    document.getElementById('insightText').textContent = gerarInsight();

    // Mostra/esconde a barrinha de "limite" dependendo se o usuário definiu um
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

/** Configura o formulário onde o usuário define a Renda dele e o Limite de gastos */
function initPlanejamentoForm() {
    const form = document.getElementById('rendaForm');
    if (!form) return; // Trava de segurança

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

// ==========================================================================
// 7. MÓDULO: GRÁFICOS (CHART.JS)
// ==========================================================================

let pieChartInstance = null;
let barChartInstance = null;

/** Junta todos os gastos de uma mesma categoria para mostrar no gráfico de pizza */
function agregaGastosPorCategoria() {
    const map = {};
    state.gastos.forEach(g => {
        const label = CAT_LABEL[g.categoria] || g.categoria;
        map[label] = (map[label] || 0) + g.valor;
    });
    return {
        labels: Object.keys(map),
        values: Object.values(map),
    };
}

const CHART_COLORS = [
    '#a855f7', '#d946ef', '#7c3aed', '#ec4899',
    '#8b5cf6', '#c026d3', '#6d28d9', '#db2777',
];

/** Cria ou atualiza o gráfico de pizza (Rosquinha) de categorias */
function renderPieChart() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) return; // Trava de segurança

    const { labels, values } = agregaGastosPorCategoria();
    const ctx = canvas.getContext('2d');

    if (pieChartInstance) pieChartInstance.destroy(); // Apaga o gráfico antigo antes de criar novo

    if (values.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
    }

    pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: CHART_COLORS.slice(0, labels.length),
                borderColor: 'rgba(26,5,51,0.5)',
                borderWidth: 2,
                hoverOffset: 8,
            }],
        },
        options: { /* Configurações visuais do chart.js */
            responsive: true,
            maintainAspectRatio: true,
            cutout: '60%',
            plugins: {
                legend: { position: 'bottom', labels: { color: '#a78bfa', font: { family: 'DM Sans', size: 11 } } },
                tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${formatBRL(ctx.parsed)}` }, bodyColor: '#f0e6ff', backgroundColor: 'rgba(42,13,74,0.95)' },
            },
        },
    });
}

/** Conta quantas vezes cada "humor" foi registrado para o gráfico de barras */
function contaMoods() {
    const map = {};
    const moodLabel = { otimo: 'Ótimo', bem: 'Bem', neutro: 'Neutro', ansioso: 'Ansioso', mal: 'Mal', exagero: 'Exagero' };
    state.emocional.forEach(e => {
        const lb = moodLabel[e.mood] || e.mood;
        map[lb] = (map[lb] || 0) + 1;
    });
    return { labels: Object.keys(map), values: Object.values(map) };
}

/** Cria ou atualiza o gráfico de barras sobre as emoções */
function renderBarChart() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return; // Trava de segurança

    const { labels, values } = contaMoods();
    const ctx = canvas.getContext('2d');

    if (barChartInstance) barChartInstance.destroy();

    if (values.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
    }

    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Registros',
                data: values,
                backgroundColor: CHART_COLORS.slice(0, labels.length),
                borderRadius: 8,
            }],
        },
        options: { /* Configurações visuais do chart.js */
            responsive: true, maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#a78bfa', font: { size: 11 } }, grid: { color: 'rgba(168,85,247,0.08)' } },
                y: { ticks: { color: '#a78bfa', font: { size: 11 }, stepSize: 1 }, grid: { color: 'rgba(168,85,247,0.08)' }, beginAtZero: true },
            },
        },
    });
}

/** Função atalho para atualizar os dois gráficos de uma vez */
function updateGraficos() {
    if (!document.getElementById('pieChart') && !document.getElementById('barChart')) return;

    renderPieChart();
    renderBarChart();
}

// ==========================================================================
// 8. MÓDULO: REGISTRO EMOCIONAL
// ==========================================================================

const MOOD_EMOJI = { otimo: '😌', bem: '🙂', neutro: '😐', ansioso: '😰', mal: '😔', exagero: '🤯' };
const MOOD_LABEL = { otimo: 'Ótimo', bem: 'Bem', neutro: 'Neutro', ansioso: 'Ansioso', mal: 'Mal', exagero: 'Exagero' };

/** Renderiza a lista de antigos registros emocionais na tela */
function renderEmocional() {
    const list = document.getElementById('emocionalList');
    if (!list) return; // Trava de segurança
    const empty = document.getElementById('emocionalEmpty');

    if (state.emocional.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    const recentes = [...state.emocional].reverse().slice(0, 8);

    list.innerHTML = recentes.map(e => `
    <div class="emocional-item">
      <div class="emocional-header">
        <span class="emocional-data">${formatDate(e.data)}</span>
        <span class="emocional-mood">${e.emoji || MOOD_EMOJI[e.mood] || '😐'} ${e.rotulo || MOOD_LABEL[e.mood] || e.mood}</span>
      </div>
      <p class="emocional-texto">${e.texto || '—'}</p>
    </div>
  `).join('');
}

/** Prepara a tela de clicar nos emojis de humor e envia os dados quando clica em registrar */
function initEmocional() {
    const btns = document.querySelectorAll('.mood-btn');
    const form = document.getElementById('emocionalForm');
    if (!form) return; // Trava de segurança

    // Faz os botões de emoji ficarem roxos quando clica neles
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedMood = btn.dataset.mood;
        });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const texto = document.getElementById('emocionalTexto').value.trim();

        if (!state.selectedMood) {
            toast('⚠️ Selecione como você está se sentindo.');
            return;
        }

        const registro = {
            id: state.nextEmocId++,
            data: new Date().toISOString().split('T')[0],
            mood: state.selectedMood,
            emoji: MOOD_EMOJI[state.selectedMood],
            rotulo: MOOD_LABEL[state.selectedMood],
            texto,
        };

        state.emocional.push(registro);
        persistAll();
        renderEmocional();
        updateGraficos();
        toast('🧠 Registro emocional salvo!');

        form.reset();
        btns.forEach(b => b.classList.remove('active'));
        state.selectedMood = null;
    });

    const btnSentimento = document.getElementById('btnRegistrarSentimento');
    if (btnSentimento) {
        btnSentimento.addEventListener('click', () => {
            document.getElementById('emocional').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ==========================================================================
// 9. MÓDULO: PADRÕES COMPORTAMENTAIS E INSIGHTS
// ==========================================================================

/** Analisa os gastos pra achar "Padrões" (Ex: Compra por impulso, etc) */
function analisarPadroes() {
    const total = state.gastos.reduce((s, g) => s + g.valor, 0);

    const impulsivo = state.gastos
        .filter(g => ['lazer', 'outros', 'vestuario'].includes(g.categoria))
        .reduce((s, g) => s + g.valor, 0);
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

/** Cria as frases de "Insights" baseado nos dados do usuário (ex: Dicas) */
function gerarInsights() {
    const insights = [];
    const total = state.gastos.reduce((s, g) => s + g.valor, 0);
    const totalMes = totalGastosMesAtual();

    if (state.gastos.length === 0) {
        return [{ icon: '💡', texto: 'Registre seus gastos para ver insights personalizados.' }];
    }

    const porCat = {};
    state.gastos.forEach(g => {
        porCat[g.categoria] = (porCat[g.categoria] || 0) + g.valor;
    });
    const topCat = Object.entries(porCat).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
        const pct = Math.round((topCat[1] / total) * 100);
        insights.push({ icon: '📊', texto: `Você gastou ${pct}% do total em ${CAT_LABEL[topCat[0]] || topCat[0]}.` });
    }

    if (state.renda > 0 && totalMes > 0) {
        const pctRenda = Math.round((totalMes / state.renda) * 100);
        if (pctRenda > 80) {
            insights.push({ icon: '⚠️', texto: `Atenção: você já usou ${pctRenda}% da sua renda mensal!` });
        } else if (pctRenda < 40) {
            insights.push({ icon: '🎉', texto: `Parabéns! Você usou apenas ${pctRenda}% da renda este mês.` });
        }
    }

    const metaQuase = state.metas.find(m => m.progresso >= 85);
    if (metaQuase) {
        insights.push({ icon: '🎯', texto: `Sua meta "${metaQuase.nome}" está quase completa (${metaQuase.progresso}%)!` });
    }

    if (state.emocional.length >= 2) {
        const ultimos = state.emocional.slice(-3);
        const negativos = ultimos.filter(e => ['ansioso', 'mal', 'exagero'].includes(e.mood));
        if (negativos.length >= 2) {
            insights.push({ icon: '🧘', texto: 'Você registrou emoções negativas recentemente. Que tal revisar seus gastos impulsivos?' });
        }
    }

    if (insights.length === 0) {
        insights.push({ icon: '✨', texto: 'Suas finanças estão equilibradas. Continue assim!' });
    }

    return insights;
}

/** Atualiza a tela com os cards de Padrões e a lista de Insights calculados acima */
function updatePadroes() {
    const padroes = analisarPadroes();
    const insights = gerarInsights();

    const grid = document.getElementById('padroesGrid');
    if (!grid) return; // Trava de segurança

    grid.innerHTML = padroes.map(p => `
    <div class="padrao-card">
      <div class="padrao-icon-wrap">${p.icon}</div>
      <div class="padrao-name">${p.nome}</div>
      <div class="padrao-desc">${p.desc}</div>
      <div class="padrao-meter">
        <div class="padrao-meter-fill" style="width:${p.pct}%; background:${p.cor}"></div>
      </div>
    </div>
  `).join('');

    document.getElementById('insightsList').innerHTML = insights.map(i => `
    <div class="insight-item">
      <span class="insight-item-icon">${i.icon}</span>
      <span class="insight-item-text">${i.texto}</span>
    </div>
  `).join('');

    // Preenche o ranking de "Top Categorias" do lado dos insights
    const porCat = {};
    state.gastos.forEach(g => {
        porCat[g.categoria] = (porCat[g.categoria] || 0) + g.valor;
    });
    const sorted = Object.entries(porCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxVal = sorted.length > 0 ? sorted[0][1] : 1;

    document.getElementById('rankList').innerHTML = sorted.length === 0
        ? '<p class="empty-state" style="padding:8px 0">Nenhum gasto registrado.</p>'
        : sorted.map(([cat, val]) => `
        <div class="rank-item">
          <span class="rank-label">${CAT_EMOJI[cat] || '📦'} ${CAT_LABEL[cat] || cat}</span>
          <div class="rank-bar-wrap">
            <div class="rank-bar-fill" style="width:${Math.round((val / maxVal) * 100)}%"></div>
          </div>
          <span class="rank-val">${formatBRL(val)}</span>
        </div>
      `).join('');
}

// ==========================================================================
// 10. MENUS E INTERFACES EXTRAS
// ==========================================================================

/**
 * Pinta o menu de cima de acordo com a página ou section atual.
 * (Pode ser removido quando o site usar MPA de fato, já que os links serão de páginas separadas).
 */
function initNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' });

    sections.forEach(s => observer.observe(s));

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            if (link.dataset.section) {
                e.preventDefault();
                const target = document.getElementById(link.dataset.section);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('navLinks').classList.remove('open');
            }
        });
    });
}

/** Configura o botão de "hamburguer" do menu em telas de celular */
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');

    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        links.classList.toggle('open');
    });
}

/** Abre a caixinha sobreposta (modal) na tela */
function openModal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('open');
}

/** Fecha a caixinha sobreposta (modal) */
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

/** Adiciona o evento de fechar o modal ao clicar no X ou fora da caixa */
function initModal() {
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    if (!modalClose || !modalOverlay) return;

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', e => {
        if (e.target === document.getElementById('modalOverlay')) closeModal();
    });
}

// ==========================================================================
// 11. INICIALIZAÇÃO
// ==========================================================================

/** * EVENTO PRINCIPAL! 
 * Tudo dentro desta função roda no segundo em que a página HTML termina de carregar.
 * Como colocamos as travas (if !elemento return), ele só vai executar o que existir na tela.
 */
document.addEventListener('DOMContentLoaded', () => {

    // Carrega Gastos
    initGastoForm();
    renderGastos();

    // Carrega Metas
    initMetaForm();
    renderMetas();

    // Carrega Planejamento
    initPlanejamentoForm();
    updatePlanejamento();

    // Carrega Gráficos
    updateGraficos();

    // Carrega Emocional
    initEmocional();
    renderEmocional();

    // Carrega Padrões
    updatePadroes();

    // Utilitários de Interface
    initNavHighlight();
    initHamburger();
    initModal();

    // Dá uma animaçãozinha em escada para as sections (se existirem)
    document.querySelectorAll('.section').forEach((s, i) => {
        s.style.animationDelay = `${i * 0.08}s`;
    });

    console.log('%c🌟 Equilíbra SPA carregado!', 'color:#a855f7; font-weight:bold; font-size:14px');
});