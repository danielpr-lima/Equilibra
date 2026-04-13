// js/modules/utils.js

/** Formata um número comum para o formato de dinheiro brasileiro (Ex: R$ 1.500,00) */
export function formatBRL(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Transforma a data do sistema (2026-03-20) para o padrão brasileiro (20/03/2026) */
export function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

/** Formata mês e ano (Ex: de 2026-03 para 03/2026) */
export function formatMonth(ym) {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    return `${m}/${y}`;
}

/** Exibe aquela mensagem flutuante (Toast) na parte inferior da tela. */
export function toast(msg, duracao = 2800) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duracao);
}

// Dicionários para converter as categorias em emojis ou nomes amigáveis
export const CAT_EMOJI = {
    alimentacao: '🍔', transporte: '🚗', lazer: '🎮',
    saude: '💊', educacao: '📚', moradia: '🏠',
    vestuario: '👗', outros: '📦',
};

export const CAT_LABEL = {
    alimentacao: 'Alimentação', transporte: 'Transporte', lazer: 'Lazer',
    saude: 'Saúde', educacao: 'Educação', moradia: 'Moradia',
    vestuario: 'Vestuário', outros: 'Outros',
};