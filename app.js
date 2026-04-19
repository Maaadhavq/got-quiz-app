// ===== EpiGraph-AI Product Dashboard =====

document.addEventListener('DOMContentLoaded', () => {
    Chart.defaults.color = '#71717a';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.03)';
    Chart.defaults.font.family = "'DM Sans', -apple-system, sans-serif";
    Chart.defaults.font.size = 11;

    initNavigation();
    initRiskTable();
    initOverviewCharts();
    initGraphNetwork();
    initMobileMenu();
});

// State
let currentView = 'overview';
let currentDistrict = 'Ahmedabad';
let chartsInit = { training: false };
let timeSeriesChart = null;
let comparisonChart = null;

// ===== NAVIGATION =====
function initNavigation() {
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
        item.addEventListener('click', e => { e.preventDefault(); switchView(item.dataset.view); });
    });
    document.querySelectorAll('.nav-item.district-nav').forEach(item => {
        item.addEventListener('click', e => { e.preventDefault(); switchToDistrict(item.dataset.district); });
    });
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const nav = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (nav) nav.classList.add('active');

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const el = document.getElementById(`view-${view}`);
    if (el) { el.classList.add('active'); el.style.animation = 'none'; el.offsetHeight; el.style.animation = ''; }

    const titles = { overview: 'Dashboard', district: currentDistrict, map: 'Network', training: 'Training', architecture: 'Architecture' };
    document.getElementById('pageTitle').textContent = titles[view] || 'Dashboard';

    if (view === 'training' && !chartsInit.training) { setTimeout(initTrainingCharts, 80); chartsInit.training = true; }
    if (view === 'map') setTimeout(initGraphNetwork, 80);
    document.getElementById('sidebar').classList.remove('open');
}

function switchToDistrict(district) {
    currentDistrict = district;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const nav = document.querySelector(`.nav-item.district-nav[data-district="${district}"]`);
    if (nav) nav.classList.add('active');

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const el = document.getElementById('view-district');
    el.classList.add('active'); el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';

    document.getElementById('pageTitle').textContent = district;

    const pred = PREDICTIONS[district], color = DISTRICT_COLORS[district], weather = WEATHER_AVG[district];
    document.getElementById('districtColorBar').style.background = color;
    document.getElementById('districtTitle').textContent = district;
    document.getElementById('districtRiskNumber').textContent = pred.risk.toFixed(1);
    document.getElementById('districtRiskNumber').style.color = color;

    const badge = document.getElementById('districtRiskBadge');
    badge.textContent = pred.level.toUpperCase() + ' RISK';
    badge.className = `risk-badge-lg ${pred.level}`;

    document.getElementById('wTmax').textContent = weather.tmax + '°C';
    document.getElementById('wTmin').textContent = weather.tmin + '°C';
    document.getElementById('wRain').textContent = weather.rain.toFixed(0) + 'mm';
    document.getElementById('wRhAm').textContent = weather.rh_am + '%';
    document.getElementById('wRhPm').textContent = weather.rh_pm + '%';

    updateNewsFeed(district);
    setTimeout(() => { updateTimeSeries(district); updateComparison(district); }, 50);
    document.getElementById('sidebar').classList.remove('open');
}

// ===== RISK TABLE =====
function initRiskTable() {
    const tbody = document.getElementById('riskTableBody');
    const max = Math.max(...DISTRICTS.map(d => PREDICTIONS[d].risk));
    tbody.innerHTML = DISTRICTS.map(d => {
        const p = PREDICTIONS[d], c = DISTRICT_COLORS[d], pct = (p.risk / max * 100).toFixed(0);
        const bar = p.level === 'high' ? '#f43f5e' : p.level === 'medium' ? '#f59e0b' : '#10b981';
        return `<tr onclick="switchToDistrict('${d}')">
            <td><div class="district-cell"><span class="dot" style="background:${c}"></span>${d}</div></td>
            <td class="risk-score-cell" style="color:${c}">${p.risk.toFixed(1)}</td>
            <td><span class="risk-badge ${p.level}">${p.level.toUpperCase()}</span></td>
            <td class="risk-bar-cell"><div class="risk-mini-bar"><div class="risk-mini-fill" style="width:${pct}%;background:${bar}"></div></div></td>
            <td><button class="view-btn" onclick="event.stopPropagation();switchToDistrict('${d}')">View →</button></td>
        </tr>`;
    }).join('');
}

// ===== CHART DEFAULTS =====
function opts({ legend = false } = {}) {
    return {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: legend, position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, font: { size: 11 } } },
            tooltip: {
                backgroundColor: '#1a1a22', borderColor: '#2a2a38', borderWidth: 1, cornerRadius: 4, padding: 8,
                titleFont: { family: "'DM Sans', sans-serif", weight: 600, size: 12 }, bodyFont: { size: 11 },
                bodyColor: '#d4d4d8', titleColor: '#fafafa'
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.025)', drawBorder: false }, ticks: { font: { size: 10 }, padding: 4 }, border: { display: false } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, padding: 4 }, border: { display: false } }
        },
        animation: { duration: 600, easing: 'easeOutQuart' }
    };
}

// ===== OVERVIEW CHARTS =====
function initOverviewCharts() {
    const riskCtx = document.getElementById('riskChart');
    if (riskCtx) {
        new Chart(riskCtx, {
            type: 'bar',
            data: {
                labels: DISTRICTS,
                datasets: [{
                    data: DISTRICTS.map(d => PREDICTIONS[d].risk),
                    backgroundColor: DISTRICTS.map(d => DISTRICT_COLORS[d] + '55'),
                    borderColor: DISTRICTS.map(d => DISTRICT_COLORS[d] + 'aa'),
                    borderWidth: 1, borderRadius: 4, borderSkipped: false
                }]
            },
            options: opts()
        });
    }

    const connCtx = document.getElementById('connectivityChart');
    if (connCtx) {
        const c = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];
        new Chart(connCtx, {
            type: 'bar',
            data: {
                labels: CONNECTIVITY.map(e => `${e.source.slice(0, 3)} → ${e.target.slice(0, 3)}`),
                datasets: [{ data: CONNECTIVITY.map(e => e.weight), backgroundColor: c.map(x => x + '44'), borderColor: c.map(x => x + '88'), borderWidth: 1, borderRadius: 4, borderSkipped: false }]
            },
            options: {
                ...opts(), indexAxis: 'y',
                scales: {
                    x: { max: 1.1, grid: { color: 'rgba(255,255,255,0.025)', drawBorder: false }, border: { display: false } },
                    y: { grid: { display: false }, ticks: { font: { size: 10, family: "'IBM Plex Mono', monospace" } }, border: { display: false } }
                }
            }
        });
    }
}

// ===== DISTRICT CHARTS =====
function updateTimeSeries(district) {
    const ctx = document.getElementById('timeSeriesChart');
    if (!ctx) return;
    if (timeSeriesChart) timeSeriesChart.destroy();
    const data = WEEKLY_CASES[district] || [], color = DISTRICT_COLORS[district], [r, g, b] = hex(color);
    const grad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.15)`); grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    timeSeriesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.d), datasets: [{
                data: data.map(d => d.v), borderColor: color, backgroundColor: grad, fill: true,
                tension: 0.3, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: color
            }]
        },
        options: {
            ...opts(), interaction: { intersect: false, mode: 'index' },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.025)', drawBorder: false }, border: { display: false } },
                x: { grid: { display: false }, ticks: { font: { size: 9 }, maxTicksLimit: 14, maxRotation: 45 }, border: { display: false } }
            }
        }
    });
}

function updateComparison(district) {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;
    if (comparisonChart) comparisonChart.destroy();
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: DISTRICTS, datasets: [{
                data: DISTRICTS.map(d => PREDICTIONS[d].risk),
                backgroundColor: DISTRICTS.map(d => d === district ? DISTRICT_COLORS[d] + '88' : 'rgba(255,255,255,0.04)'),
                borderColor: DISTRICTS.map(d => d === district ? DISTRICT_COLORS[d] : 'rgba(255,255,255,0.06)'),
                borderWidth: 1, borderRadius: 4, borderSkipped: false
            }]
        },
        options: opts()
    });
}

function updateNewsFeed(district) {
    const feed = document.getElementById('newsFeed');
    const news = HEALTH_NEWS.filter(n => n.district === district);
    if (!news.length) { feed.innerHTML = '<div style="padding:24px;text-align:center;color:#3f3f46;font-size:12px;">No alerts recorded</div>'; return; }
    feed.innerHTML = news.map(n => `<div class="news-item">
        <span class="news-type-badge ${n.type === 'Medical_Alert' ? 'medical' : 'weather'}">${n.type === 'Medical_Alert' ? 'Medical' : 'Weather'}</span>
        <div><div class="news-headline">${n.headline}</div><div class="news-date">${n.date}</div></div>
    </div>`).join('');
}

// ===== GRAPH =====
function initGraphNetwork() {
    const canvas = document.getElementById('graphCanvas');
    if (!canvas?.parentElement) return;
    const ctx = canvas.getContext('2d'), dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;

    const pos = {
        Ahmedabad: { x: 0.5, y: 0.22 }, Gandhinagar: { x: 0.78, y: 0.18 },
        Rajkot: { x: 0.18, y: 0.50 }, Surat: { x: 0.35, y: 0.78 }, Vadodara: { x: 0.72, y: 0.65 }
    };

    ctx.clearRect(0, 0, w, h);

    // Edges
    CONNECTIVITY.forEach(conn => {
        const s = pos[conn.source], t = pos[conn.target];
        const sx = s.x * w, sy = s.y * h, tx = t.x * w, ty = t.y * h;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(63, 63, 70, ${0.2 + conn.weight * 0.4})`;
        ctx.lineWidth = 0.8 + conn.weight * 1.8; ctx.stroke();

        const mx = (sx + tx) / 2, my = (sy + ty) / 2;
        ctx.fillStyle = '#3f3f46'; ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center'; ctx.fillText(conn.weight.toFixed(1), mx + 6, my - 6);

        const angle = Math.atan2(ty - sy, tx - sx), ax = tx - Math.cos(angle) * 28, ay = ty - Math.sin(angle) * 28;
        ctx.beginPath(); ctx.moveTo(ax, ay);
        ctx.lineTo(ax - 7 * Math.cos(angle - 0.35), ay - 7 * Math.sin(angle - 0.35));
        ctx.lineTo(ax - 7 * Math.cos(angle + 0.35), ay - 7 * Math.sin(angle + 0.35));
        ctx.closePath(); ctx.fillStyle = `rgba(63,63,70,${0.3 + conn.weight * 0.3})`; ctx.fill();
    });

    // Nodes
    DISTRICTS.forEach(d => {
        const p = pos[d], x = p.x * w, y = p.y * h, color = DISTRICT_COLORS[d];
        const risk = PREDICTIONS[d].risk, [r, g, b] = hex(color), nr = 16 + risk * 0.4;

        // Soft halo
        const gl = ctx.createRadialGradient(x, y, 0, x, y, nr * 2.2);
        gl.addColorStop(0, `rgba(${r},${g},${b},0.06)`); gl.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(x, y, nr * 2.2, 0, Math.PI * 2); ctx.fillStyle = gl; ctx.fill();

        // Ring
        ctx.beginPath(); ctx.arc(x, y, nr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.08)`; ctx.fill();
        ctx.strokeStyle = `rgba(${r},${g},${b},0.4)`; ctx.lineWidth = 1.5; ctx.stroke();

        // Core
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();

        // Labels
        ctx.fillStyle = '#d4d4d8'; ctx.font = '600 11px "DM Sans", sans-serif';
        ctx.textAlign = 'center'; ctx.fillText(d, x, y + nr + 14);
        ctx.fillStyle = '#52525b'; ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.fillText(risk.toFixed(1), x, y + nr + 26);
    });
}

// ===== TRAINING =====
function initTrainingCharts() {
    const lossCtx = document.getElementById('lossChart');
    if (lossCtx) {
        const g = lossCtx.getContext('2d').createLinearGradient(0, 0, 0, 220);
        g.addColorStop(0, 'rgba(59,130,246,0.12)'); g.addColorStop(1, 'rgba(59,130,246,0)');
        new Chart(lossCtx, {
            type: 'line', data: {
                labels: TRAINING_LOG.map(l => `${l.epoch}`),
                datasets: [{
                    label: 'Loss', data: TRAINING_LOG.map(l => l.train_loss), borderColor: '#3b82f6', backgroundColor: g,
                    fill: true, tension: 0.35, borderWidth: 1.5, pointRadius: 3, pointBackgroundColor: '#3b82f6', pointBorderColor: '#09090b', pointBorderWidth: 1.5
                }]
            }, options: opts()
        });
    }

    const r2Ctx = document.getElementById('r2Chart');
    if (r2Ctx) {
        new Chart(r2Ctx, {
            type: 'line', data: {
                labels: TRAINING_LOG.map(l => `${l.epoch}`),
                datasets: [
                    {
                        label: 'R²', data: TRAINING_LOG.map(l => l.r2), borderColor: '#8b5cf6', tension: 0.35, borderWidth: 1.5,
                        pointRadius: 3, pointBackgroundColor: '#8b5cf6', pointBorderColor: '#09090b', pointBorderWidth: 1.5, yAxisID: 'y'
                    },
                    {
                        label: 'Accuracy', data: TRAINING_LOG.map(l => l.accuracy), borderColor: '#10b981', borderDash: [4, 3], tension: 0.35,
                        borderWidth: 1.5, pointRadius: 2, pointBackgroundColor: '#10b981', pointBorderColor: '#09090b', pointBorderWidth: 1.5, yAxisID: 'y1'
                    }
                ]
            },
            options: {
                ...opts({ legend: true }), scales: {
                    y: { position: 'left', title: { display: true, text: 'R²', color: '#8b5cf6', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.025)', drawBorder: false }, border: { display: false } },
                    y1: { position: 'right', title: { display: true, text: 'Acc %', color: '#10b981', font: { size: 10 } }, grid: { display: false }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    }

    const rmseCtx = document.getElementById('rmseChart');
    if (rmseCtx) {
        new Chart(rmseCtx, {
            type: 'bar', data: {
                labels: TRAINING_LOG.map(l => `${l.epoch}`),
                datasets: [
                    { label: 'RMSE', data: TRAINING_LOG.map(l => l.rmse), backgroundColor: '#ec489930', borderColor: '#ec489988', borderWidth: 1, borderRadius: 3, borderSkipped: false },
                    { label: 'MAE', data: TRAINING_LOG.map(l => l.mae), backgroundColor: '#f59e0b30', borderColor: '#f59e0b88', borderWidth: 1, borderRadius: 3, borderSkipped: false }
                ]
            }, options: opts({ legend: true })
        });
    }
}

// ===== MOBILE =====
function initMobileMenu() {
    const t = document.getElementById('menuToggle'), s = document.getElementById('sidebar');
    if (t) t.addEventListener('click', () => s.classList.toggle('open'));
    document.getElementById('mainContent').addEventListener('click', () => s.classList.remove('open'));
}

// ===== UTIL =====
function hex(h) { h = h.replace('#', ''); return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)]; }
window.addEventListener('resize', () => { if (currentView === 'map') initGraphNetwork(); });
