/** Busca os dados salvos no navegador (LocalStorage). */
function loadState(key, fallback) {
    try {
        const saved = localStorage.getItem('equilibra_' + key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

/** Salva uma informação no navegador (LocalStorage). */
function saveState(key, value) {
    try {
        localStorage.setItem('equilibra_' + key, JSON.stringify(value));
    } catch { /* silencioso */ }
}

// Dados falsos para a primeira vez que o usuário entra
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
    { id: 1, data: '2026-03-23', mood: 'otimo', emoji: '😌', rotulo: 'Ótimo', texto: 'Consegui resistir à tentação de comprar algo por impulso.' },
    { id: 2, data: '2026-03-20', mood: 'ansioso', emoji: '😰', rotulo: 'Ansioso', texto: 'Gastei mais do que planejava esta semana.' },
];

// O 'state' exportado é o que as outras telas vão usar para ler os dados
export const state = {
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

// Salva TUDO de uma vez. Exportado para que outras telas possam salvar dados novos.
export function persistAll() {
    saveState('gastos', state.gastos);
    saveState('metas', state.metas);
    saveState('emocional', state.emocional);
    saveState('renda', state.renda);
    saveState('limite', state.limite);
    saveState('nextGastoId', state.nextGastoId);
    saveState('nextMetaId', state.nextMetaId);
    saveState('nextEmocId', state.nextEmocId);
}