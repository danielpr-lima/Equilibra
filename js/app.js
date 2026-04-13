import { initNavHighlight, initHamburger, initModal } from './modules/ui.js';
import { initMetaForm, renderMetas } from './modules/metas.js';
import { initGastoForm, renderGastos } from './modules/gastos.js'; 
import { initPlanejamentoForm, updatePlanejamento } from './modules/planejamento.js';
import { updateGraficos } from './modules/grafico.js';
import { initEmocional, renderEmocional } from './modules/emocional.js';
import { updatePadroes } from './modules/padroes.js';
import { initRegistroForm, initLoginForm } from './modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Interface geral
    initNavHighlight();
    initHamburger();
    initModal();

    // Iniciar Módulos
    initGastoForm();
    renderGastos();
    
    initMetaForm();
    renderMetas();

    initPlanejamentoForm();
    updatePlanejamento();

    initEmocional();
    renderEmocional();

    updateGraficos();
    updatePadroes();

    // Módulo de Autenticação
    initRegistroForm();
    initLoginForm();

    console.log('%c🌟 Equilíbra SPA carregado em Módulos!', 'color:#a855f7; font-weight:bold; font-size:14px');
});