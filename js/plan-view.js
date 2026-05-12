import { generateWorkout } from './planner.js';
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
  const numDays        = profile.frequency;
  const currentWeek    = Math.min(12, Math.floor(completedCount / numDays) + 1);
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
    const isDeload    = weekInPhase === 4;
    const isCurrent   = week === currentWeek;

    const weekEl = document.createElement('div');
    weekEl.className = 'plan-week' + (isCurrent ? ' current' : '');

    let statusDots = '';
    for (let d = 0; d < numDays; d++) {
      const sessionsBefore = (week - 1) * numDays + d;
      const isDone         = sessionsBefore < completedCount;
      const isCurrentDay   = sessionsBefore === completedCount;
      const cls            = isDone ? 'done' : (isCurrentDay ? 'current' : '');
      statusDots += `<span class="plan-status-dot ${cls}"></span>`;
    }

    const phaseLabel = PHASE_NAMES[phase];
    const tagText    = isDeload
      ? 'Deload · Erholung'
      : `Phase ${phase} · Woche ${weekInPhase} / 3`;

    weekEl.innerHTML = `
      <button class="plan-week-head" type="button">
        <span class="plan-week-num">W${String(week).padStart(2, '0')}</span>
        <div class="plan-week-info">
          <span class="plan-week-title">${phaseLabel}${isDeload ? ' · Deload' : ''}</span>
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
    for (let dayIdx = 0; dayIdx < numDays; dayIdx++) {
      const w    = generateWorkout(dayIdx, week, profile);
      const card = document.createElement('div');
      card.className = 'plan-day-card';
      card.innerHTML = `
        <div class="pd-tag">Tag ${dayIdx + 1}</div>
        <h4>${w.name}</h4>
        <ul>
          ${w.exercises.map(ex => `<li><span>${ex.name}</span><b>${ex.sets}×${ex.target}</b></li>`).join('')}
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
