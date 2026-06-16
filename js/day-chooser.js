import { generateWorkout, currentPlanWeek, nextDayIdx, templateKey } from './planner.js';
import { DAY_TEMPLATES } from './data.js';
import { loadProfile, loadSessionSnapshot } from './storage.js';
import { getTrainLog } from './logbook.js';
import { openPlayer } from './player.js';

export function openDayChooser() {
  const profile = loadProfile();
  if (!profile) return;

  const completedCount = Object.keys(getTrainLog()).length;
  const week      = currentPlanWeek(profile, completedCount);
  const suggested = nextDayIdx(profile, completedCount);
  const days      = DAY_TEMPLATES[templateKey(profile)];

  // Angefangenes Workout von heute? Dann diesen Tag als Vorschlag markieren.
  const snap  = loadSessionSnapshot();
  const today = new Date().toISOString().slice(0, 10);
  const inProgressKey = (snap && snap.date === today && snap.completedSets > 0) ? snap.key : null;

  document.getElementById('dayModalWeek').textContent = `Woche ${week}`;

  const wrap = document.getElementById('dayChoice');
  wrap.innerHTML = '';
  days.forEach((t, idx) => {
    const w        = generateWorkout(idx, week, profile);
    const isResume = inProgressKey && inProgressKey === `${w.key}|W${w.week}`;
    const isSugg   = idx === suggested;

    const btn = document.createElement('button');
    btn.className = 'day-card' + (isResume ? ' resume' : (isSugg ? ' suggested' : ''));
    const tag = isResume ? 'Fortsetzen' : (isSugg ? `Tag ${idx + 1} · Vorschlag` : `Tag ${idx + 1}`);
    btn.innerHTML = `
      <span class="dc-tag">${tag}</span>
      <span class="dc-name">${w.name}${w.isDeload ? ' · Deload' : ''}${w.isFinale ? ' · Finale' : ''}</span>
      <span class="dc-focus">${w.focus}</span>
      <span class="dc-ex">${w.exercises.map(e => e.name).join(' · ')}</span>
    `;
    btn.addEventListener('click', () => {
      closeDayChooser();
      openPlayer(idx);
    });
    wrap.appendChild(btn);
  });

  document.getElementById('dayModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeDayChooser() {
  document.getElementById('dayModal').classList.remove('open');
  document.body.style.overflow = '';
}

export function setupDayChooserHandlers() {
  document.getElementById('dayClose').addEventListener('click', closeDayChooser);
}
