import { generateWorkout, planProgress, isDeloadWeek, dayCount } from './planner.js';
import { loadProfile } from './storage.js';
import { getTrainLog } from './logbook.js';

export function openPlan() {
  document.getElementById('planModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderPlan();
}

export function closePlan() {
  document.getElementById('planModal').classList.remove('open');
  document.body.style.overflow = '';
}

function renderPlan() {
  const profile        = loadProfile();
  const trainLog       = getTrainLog();
  const completedCount = Object.keys(trainLog).length;
  const planDone       = planProgress(profile, completedCount);
  const numDays        = profile.frequency;
  const currentWeek    = Math.min(12, Math.floor(planDone / numDays) + 1);
  const PHASE_NAMES    = { 1: 'Foundation', 2: 'Build', 3: 'Peak' };

  document.querySelectorAll('.plan-phase').forEach(p => {
    const phase    = parseInt(p.dataset.phase);
    const isActive = currentWeek > (phase - 1) * 4 && currentWeek <= phase * 4;
    p.classList.toggle('active', isActive);
  });

  const overview   = document.getElementById('planOverview');
  overview.innerHTML = '';

  for (let week = 1; week <= 12; week++) {
    const phase       = Math.ceil(week / 4);
    const weekInPhase = ((week - 1) % 4) + 1;
    const isDeload    = isDeloadWeek(week);
    const isFinale    = week === 12;
    const isCurrent   = week === currentWeek;

    const weekEl = document.createElement('div');
    weekEl.className = 'plan-week' + (isCurrent ? ' current' : '');

    let statusDots = '';
    for (let d = 0; d < numDays; d++) {
      const sessionsBefore = (week - 1) * numDays + d;
      const isDone         = sessionsBefore < planDone;
      const isCurrentDay   = sessionsBefore === planDone;
      const cls            = isDone ? 'done' : (isCurrentDay ? 'current' : '');
      statusDots += `<span class="plan-status-dot ${cls}"></span>`;
    }

    const phaseLabel = PHASE_NAMES[phase];
    const tagText    = isDeload
      ? 'Deload · Erholung'
      : isFinale
        ? 'Finale · Volle Last + Abschluss-Test'
        : `Phase ${phase} · Woche ${weekInPhase} / ${phase === 3 ? 4 : 3}`;

    weekEl.innerHTML = `
      <button class="plan-week-head" type="button">
        <span class="plan-week-num">W${String(week).padStart(2, '0')}</span>
        <div class="plan-week-info">
          <span class="plan-week-title">${phaseLabel}${isDeload ? ' · Deload' : ''}${isFinale ? ' · Finale' : ''}</span>
          <span class="plan-week-tag ${isDeload ? 'deload' : ''}">${tagText}</span>
        </div>
        <span class="plan-week-status">${statusDots}</span>
      </button>
      <div class="plan-week-body"><div class="plan-week-body-inner"></div></div>
    `;

    const headBtn = weekEl.querySelector('.plan-week-head');
    headBtn.addEventListener('click', () => weekEl.classList.toggle('open'));
    overview.appendChild(weekEl);

    const bodyEl = weekEl.querySelector('.plan-week-body-inner');
    // Nur die tatsächlich unterschiedlichen Trainingstage zeigen (Ein-Tages-
    // Pläne wie der Supersatz-Plan erscheinen einmal, nicht dreimal).
    const uniqueDays = dayCount(profile);
    for (let dayIdx = 0; dayIdx < uniqueDays; dayIdx++) {
      const w    = generateWorkout(dayIdx, week, profile);
      const card = document.createElement('div');
      card.className = 'plan-day-card';
      card.innerHTML = `
        <div class="pd-tag">${uniqueDays > 1 ? `Tag ${dayIdx + 1}` : 'Workout'}</div>
        <h4>${w.name}</h4>
        <ul>
          ${w.exercises.map(ex => `<li><span>${ex.name}${ex.weighted && ex.startKg ? ` <em class="pd-kg">ab ${ex.startKg} kg${ex.oneDb ? '' : '/Hantel'}</em>` : ''}</span><b>${ex.sets}×${ex.target}</b></li>`).join('')}
        </ul>
      `;
      bodyEl.appendChild(card);
    }

    if (isCurrent) weekEl.classList.add('open');
  }
}

export function setupPlanHandlers() {
  document.getElementById('planClose').addEventListener('click', closePlan);
}
