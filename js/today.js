import { todaysWorkout } from './planner.js';
import { loadProfile } from './storage.js';
import { getTrainLog } from './logbook.js';

export function renderToday() {
  const profile = loadProfile();
  const panel   = document.getElementById('todayPanel');
  const cta     = document.getElementById('ctaStartLabel');
  const reset   = document.getElementById('ctaReset');

  if (!profile) {
    panel.classList.remove('show');
    cta.textContent    = 'Training starten';
    reset.style.display = 'none';
    return;
  }

  reset.style.display = 'inline-block';
  const trainLog      = getTrainLog();
  const completedCount = Object.keys(trainLog).length;
  const w             = todaysWorkout(profile, completedCount);
  if (!w) return;

  const totalSessions = 12 * profile.frequency;
  cta.textContent = completedCount >= totalSessions ? 'Plan abgeschlossen 🏆' : 'Heute trainieren';

  document.getElementById('tpName').textContent =
    `Woche ${w.week} · ${w.name}${w.isDeload ? ' (Deload)' : ''}`;
  document.getElementById('tpLabel').textContent    = w.focus;
  document.getElementById('tpProgress').textContent = `${completedCount} / ${totalSessions} Einheiten`;

  const list = document.getElementById('tpList');
  list.innerHTML = '';
  w.exercises.forEach(ex => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${ex.name}</span><span class="tp-sets">${ex.sets} × ${ex.target}</span>`;
    list.appendChild(li);
  });
  panel.classList.add('show');
}
