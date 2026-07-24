import { todaysWorkout, planProgress } from './planner.js';
import { loadProfile, suggestedWeight } from './storage.js';
import { getTrainLog } from './logbook.js';

// Empfohlenes bzw. zuletzt genutztes Gewicht für eine Hantelübung
function weightHint(ex) {
  if (!ex.weighted) return '';
  const s = suggestedWeight(ex.name, ex.startKg || 6);
  return ` · ${s.kg} kg${ex.oneDb ? '' : '/Hantel'}`;
}

const PATTERN_DE = {
  push: 'Push', pike: 'Pike', pull: 'Pull',
  squat: 'Squat', hinge: 'Hinge', calf: 'Waden', core: 'Core'
};

export function isPlanComplete(profile) {
  if (!profile) return false;
  const completedCount = Object.keys(getTrainLog()).length;
  return planProgress(profile, completedCount) >= 12 * profile.frequency;
}

export function renderToday() {
  const profile = loadProfile();
  const panel   = document.getElementById('todayPanel');
  const cta     = document.getElementById('ctaStartLabel');
  const reset   = document.getElementById('ctaReset');

  // Hero-Kennzahlen an gewählten Plan anpassen
  const metaFreq = document.getElementById('metaFreq');
  if (metaFreq) metaFreq.firstChild.textContent = profile ? String(profile.frequency) : '3';

  if (!profile) {
    panel.classList.remove('show');
    cta.textContent    = 'Training starten';
    reset.style.display = 'none';
    return;
  }

  reset.style.display = 'inline-block';
  const trainLog       = getTrainLog();
  const completedCount = Object.keys(trainLog).length;
  const planDone       = planProgress(profile, completedCount);
  const w              = todaysWorkout(profile, completedCount);
  if (!w) return;

  const totalSessions = 12 * profile.frequency;
  const complete      = planDone >= totalSessions;
  cta.textContent = complete ? 'Abschluss-Test starten' : 'Heute trainieren';

  document.getElementById('tpName').textContent =
    complete
      ? 'Plan abgeschlossen 🏆'
      : `Woche ${w.week} · ${w.name}${w.isDeload ? ' (Deload)' : ''}${w.isFinale ? ' (Finale)' : ''}`;
  document.getElementById('tpLabel').textContent    = complete ? 'Zeit für den Abschluss-Test' : w.focus;
  document.getElementById('tpProgress').textContent = `${planDone} / ${totalSessions} Einheiten`;

  const list = document.getElementById('tpList');
  list.innerHTML = '';
  if (!complete) {
    w.exercises.forEach(ex => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${ex.name}</span><span class="tp-sets">${ex.sets} × ${ex.target}${weightHint(ex)}</span>`;
      list.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.innerHTML = `<span>Teste deine Maximalwerte und vergleiche sie mit dem Start.</span>`;
    list.appendChild(li);
  }

  // Aktive Autoregulations-Anpassungen anzeigen
  const adjEl = document.getElementById('tpAdjust');
  if (adjEl) {
    const adj = profile.levelAdjust || {};
    const chips = Object.entries(adj)
      .filter(([, v]) => v !== 0)
      .map(([p, v]) => `<span class="adj-chip ${v < 0 ? 'down' : 'up'}">${PATTERN_DE[p] || p} ${v > 0 ? '+' : ''}${v}</span>`);
    adjEl.innerHTML = chips.length ? `<span class="adj-label">Anpassungen:</span> ${chips.join(' ')}` : '';
    adjEl.classList.toggle('hidden', chips.length === 0);
  }

  panel.classList.add('show');
}
