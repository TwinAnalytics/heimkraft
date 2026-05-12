import { loadLog, saveLog } from './storage.js';
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
  document.getElementById('total').textContent     = Object.keys(trainLog).length;

  let streak = 0;
  if (weekCount >= 3) streak++;
  const checkMonday = new Date(monday);
  for (let safety = 0; safety < 200; safety++) {
    checkMonday.setDate(checkMonday.getDate() - 7);
    const cnt = countWeek(checkMonday);
    if (cnt >= 3) streak++;
    else break;
  }
  document.getElementById('streak').textContent = streak;

  const histEl = document.getElementById('history');
  histEl.innerHTML = '';
  for (let w = 7; w >= 0; w--) {
    const wMonday = new Date(monday);
    wMonday.setDate(monday.getDate() - w * 7);
    const cnt = countWeek(wMonday);
    const pct = Math.min(100, (cnt / 4) * 100);
    const bar = document.createElement('div');
    bar.className = 'history-bar' + (w === 0 ? ' current' : '');
    bar.innerHTML = `<div class="fill" style="height: ${pct}%"></div>`;
    bar.title     = `${cnt} Training${cnt !== 1 ? 's' : ''} · KW ${getISOWeek(wMonday)}`;
    histEl.appendChild(bar);
  }
}

export function setupLogbookHandlers() {
  document.getElementById('resetLog').addEventListener('click', () => {
    if (confirm('Wirklich alle Logbuch-Einträge löschen? Das lässt sich nicht rückgängig machen.')) {
      Object.keys(trainLog).forEach(k => delete trainLog[k]);
      saveLog(trainLog);
      renderLog();
    }
  });
}
