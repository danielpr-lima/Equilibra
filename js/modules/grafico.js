// js/modules/grafico.js

import { state } from './state.js';
import { formatBRL, CAT_LABEL } from './utils.js';

let pieChartInstance = null;
let barChartInstance = null;
const CHART_COLORS = ['#FFD166', '#06D6A0', '#2A1840', '#FF9F1C', '#118AB2', '#DBA0FE', '#EF476F', '#F8F9FA'];

function agregaGastosPorCategoria() {
    const map = {};
    state.gastos.forEach(g => {
        const label = CAT_LABEL[g.categoria] || g.categoria;
        map[label] = (map[label] || 0) + g.valor;
    });
    return { labels: Object.keys(map), values: Object.values(map) };
}

function contaMoods() {
    const map = {};
    const moodLabel = { otimo: 'Ótimo', bem: 'Bem', neutro: 'Neutro', ansioso: 'Ansioso', mal: 'Mal', exagero: 'Exagero' };
    state.emocional.forEach(e => {
        const lb = moodLabel[e.mood] || e.mood;
        map[lb] = (map[lb] || 0) + 1;
    });
    return { labels: Object.keys(map), values: Object.values(map) };
}

function renderPieChart() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) return; 

    const { labels, values } = agregaGastosPorCategoria();
    const ctx = canvas.getContext('2d');

    if (pieChartInstance) pieChartInstance.destroy(); 
    if (values.length === 0) return ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: values, backgroundColor: CHART_COLORS.slice(0, labels.length), borderColor: 'rgba(26,5,51,0.5)', borderWidth: 2 }]
        },
        options: { cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#ffffff' } } } }
    });
}

function renderBarChart() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return; 

    const { labels, values } = contaMoods();
    const ctx = canvas.getContext('2d');

    if (barChartInstance) barChartInstance.destroy();
    if (values.length === 0) return ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Registros', data: values, backgroundColor: CHART_COLORS.slice(0, labels.length), borderRadius: 8 }] },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#ffffff' }, grid: { display: false }, border: { color: '#ffffff' } },
                y: { beginAtZero: true, ticks: { color: '#ffffff', stepSize: 1 }, grid: { display: false }, border: { color: '#ffffff' } }
            }
        }
    });
}

export function updateGraficos() {
    if (!document.getElementById('pieChart') && !document.getElementById('barChart')) return;
    renderPieChart();
    renderBarChart();
}