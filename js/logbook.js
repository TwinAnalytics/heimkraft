import { loadLog, saveLog, loadProfile, loadExLog, clearExLog, loadWeightLog, saveWeightLog } from './storage.js';
import { MONTHS_DE, DAYS_DE } from './data.js';

let trainLog = loadLog();

export function isoDate(d) {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function getMonday(d) {
  const x   = new Date(d);
  const day  = x.getDay();
  const diff = x.getDate() - day + (day === 0 ? -6 : 1);
  x.setDate(diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function getISOWeek(d) {
  const date   = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

export function getTrainLog() {
  return trainLog;
}

function weeklyTarget() {
  const profile = loadProfile();
  return profile ? profile.frequency : 3;
}

function countWeek(monday) {
  let cnt = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (trainLog[isoDate(d)]) cnt++;
  }
  return cnt;
}

export function logWorkoutToday() {
  trainLog[isoDate(new Date())] = true;
  saveLog(trainLog);
  renderLog();
}

export function renderLog() {
  const now      = new Date();
  const monday   = getMonday(now);
  const todayIso = isoDate(now);
  const target   = weeklyTarget();

  const daysEl = document.getElementById('logDays');
  daysEl.innerHTML = '';
  let weekCount = 0;
  for (let i = 0; i < 7; i++) {
    const d   = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso  = isoDate(d);
    const done  = !!trainLog[iso];
    const today = iso === todayIso;
    if (done) weekCount++;
    const btn = document.createElement('button');
    btn.className = 'log-day' + (done ? ' done' : '') + (today ? ' today' : '');
    btn.innerHTML = `
      <span class="ld-day">${DAYS_DE[i]}</span>
      <span class="ld-date">${d.getDate()}</span>
      <span class="ld-mark">${done ? '✓' : ''}</span>
    `;
    btn.addEventListener('click', () => {
      if (trainLog[iso]) delete trainLog[iso];
      else trainLog[iso] = true;
      saveLog(trainLog);
      renderLog();
    });
    daysEl.appendChild(btn);
  }

  const sunday    = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const kw        = getISOWeek(monday);
  const sameMonth = monday.getMonth() === sunday.getMonth();
  const range     = sameMonth
    ? `${monday.getDate()}.–${sunday.getDate()}. ${MONTHS_DE[sunday.getMonth()]}`
    : `${monday.getDate()}. ${MONTHS_DE[monday.getMonth()]} – ${sunday.getDate()}. ${MONTHS_DE[sunday.getMonth()]}`;
  document.getElementById('weekInfo').textContent  = `KW ${kw} · ${range}`;
  document.getElementById('weekCount').textContent = weekCount;
  document.querySelector('.log-week-count .of').textContent = `/${target}`;
  document.getElementById('total').textContent     = Object.keys(trainLog).length;

  let streak = 0;
  if (weekCount >= target) streak++;
  const checkMonday = new Date(monday);
  for (let safety = 0; safety < 200; safety++) {
    checkMonday.setDate(checkMonday.getDate() - 7);
    const cnt = countWeek(checkMonday);
    if (cnt >= target) streak++;
    else break;
  }
  document.getElementById('streak').textContent = streak;

  const histEl = document.getElementById('history');
  histEl.innerHTML = '';
  for (let w = 7; w >= 0; w--) {
    const wMonday = new Date(monday);
    wMonday.setDate(monday.getDate() - w * 7);
    const cnt = countWeek(wMonday);
    const pct = Math.min(100, (cnt / Math.max(target, 1)) * 100);
    const bar = document.createElement('div');
    bar.className = 'history-bar' + (w === 0 ? ' current' : '');
    bar.innerHTML = `<div class="fill" style="height: ${pct}%"></div>`;
    bar.title     = `${cnt} Training${cnt !== 1 ? 's' : ''} · KW ${getISOWeek(wMonday)}`;
    histEl.appendChild(bar);
  }

  renderWeightLog();
  renderExerciseTrends();
}

/* ── Körpergewicht ── */
function renderWeightLog() {
  const listEl = document.getElementById('weightList');
  if (!listEl) return;
  const log = loadWeightLog();
  if (log.length === 0) {
    listEl.innerHTML = '<span class="weight-empty">Noch keine Einträge. Wiege dich morgens nüchtern.</span>';
    return;
  }
  const recent = log.slice(-6);
  listEl.innerHTML = recent.map((e, i) => {
    const d = new Date(e.date + 'T12:00:00');
    const prev = i > 0 ? recent[i - 1].kg : null;
    const delta = prev !== null ? (e.kg - prev) : null;
    const deltaStr = delta === null ? '' :
      `<small class="${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${delta > 0 ? '+' : ''}${delta.toFixed(1)}</small>`;
    return `<span class="weight-entry"><b>${e.kg.toFixed(1)}</b> kg ${deltaStr}<small class="wdate">${d.getDate()}. ${MONTHS_DE[d.getMonth()]}</small></span>`;
  }).join('');
}

function saveWeightToday() {
  const input = document.getElementById('weightInput');
  const v = parseFloat((input.value || '').replace(',', '.'));
  if (!v || v < 30 || v > 250) { alert('Bitte ein gültiges Gewicht eingeben (30–250 kg).'); return; }
  const log   = loadWeightLog();
  const today = isoDate(new Date());
  const existing = log.find(e => e.date === today);
  if (existing) existing.kg = v;
  else log.push({ date: today, kg: v });
  log.sort((a, b) => a.date < b.date ? -1 : 1);
  while (log.length > 60) log.shift();
  saveWeightLog(log);
  input.value = '';
  renderWeightLog();
}

/* ── Übungs-Verlauf (aus dem Übungs-Log) ── */
function renderExerciseTrends() {
  const el = document.getElementById('exTrends');
  if (!el) return;
  const exLog = loadExLog();
  if (exLog.length === 0) {
    el.innerHTML = '<span class="weight-empty">Absolviere Workouts, um deinen Verlauf zu sehen.</span>';
    return;
  }
  // Pro Übung (nur main, keine Deloads) die letzten 5 Durchschnitte sammeln
  const byName = new Map();
  for (const entry of exLog) {
    if (entry.isDeload) continue;
    for (const ex of entry.exercises) {
      if (ex.priority !== 'main' || !ex.sets || !ex.sets.length) continue;
      if (!byName.has(ex.name)) byName.set(ex.name, { type: ex.type, vals: [] });
      const rec = byName.get(ex.name);
      rec.vals.push(Math.round(ex.sets.reduce((a, b) => a + b, 0) / ex.sets.length));
    }
  }
  if (byName.size === 0) {
    el.innerHTML = '<span class="weight-empty">Absolviere Workouts, um deinen Verlauf zu sehen.</span>';
    return;
  }
  let html = '';
  for (const [name, rec] of byName) {
    const vals = rec.vals.slice(-5);
    const unit = rec.type === 'time' ? 's' : '';
    const trend = vals.length >= 2
      ? (vals[vals.length - 1] > vals[0] ? '↗' : vals[vals.length - 1] < vals[0] ? '↘' : '→')
      : '';
    html += `<div class="trend-row"><span class="trend-name">${name}</span><span class="trend-vals">${vals.map(v => v + unit).join(' → ')} <b>${trend}</b></span></div>`;
  }
  el.innerHTML = html;
}

export function setupLogbookHandlers() {
  document.getElementById('resetLog').addEventListener('click', () => {
    if (confirm('Wirklich alle Logbuch-Einträge, Übungs-Verläufe und Gewichts-Einträge löschen? Das lässt sich nicht rückgängig machen.')) {
      Object.keys(trainLog).forEach(k => delete trainLog[k]);
      saveLog(trainLog);
      clearExLog();
      saveWeightLog([]);
      renderLog();
    }
  });
  const saveBtn = document.getElementById('weightSave');
  if (saveBtn) saveBtn.addEventListener('click', saveWeightToday);
}
