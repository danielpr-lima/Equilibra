// js/modules/emocional.js

import { state, persistAll } from './state.js';
import { formatDate, toast } from './utils.js';
import { updateGraficos } from './grafico.js';

const MOOD_EMOJI = { otimo: '😌', bem: '🙂', neutro: '😐', ansioso: '😰', mal: '😔', exagero: '🤯' };
const MOOD_LABEL = { otimo: 'Ótimo', bem: 'Bem', neutro: 'Neutro', ansioso: 'Ansioso', mal: 'Mal', exagero: 'Exagero' };

export function renderEmocional() {
    const list = document.getElementById('emocionalList');
    if (!list) return; 
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

export function initEmocional() {
    const btnSentimento = document.getElementById('btnRegistrarSentimento');
    if (btnSentimento) btnSentimento.addEventListener('click', () => { window.location.href = 'emocional.html'; });

    const form = document.getElementById('emocionalForm');
    if (!form) return;

    const btns = document.querySelectorAll('.mood-btn');
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

        if (!state.selectedMood) return toast('⚠️ Selecione como você está se sentindo.');

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
}