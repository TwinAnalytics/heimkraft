import { classifyLevel } from './planner.js';
import { loadProfile, saveProfile, clearExLog, clearSessionSnapshot } from './storage.js';
import { getTrainLog } from './logbook.js';
import { renderToday } from './today.js';

const TESTS = [
  { key: 'push',  label: 'Liegestütze (Standard)', unit: 'Wdh.' },
  { key: 'pull',  label: 'Stuhl-Rudern',           unit: 'Wdh.' },
  { key: 'squat', label: 'Kniebeugen',             unit: 'Wdh.' },
  { key: 'plank', label: 'Plank Hold',             unit: 'Sek.' }
];

let newTests = null;

export function openRetest() {
  const profile = loadProfile();
  if (!profile) return;
  newTests = null;
  document.getElementById('retestModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  const form = document.getElementById('retestForm');
  form.innerHTML = TESTS.map(t => `
    <div class="wiz-test">
      <div>
        <div class="wt-label">${t.label}</div>
        <div class="wt-hint">Beim Start: <b>${(profile.tests && profile.tests[t.key]) || 0} ${t.unit}</b> — wie viele schaffst du jetzt maximal?</div>
      </div>
      <input type="number" id="rt_${t.key}" min="0" max="600" placeholder="0">
    </div>
  `).join('');

  document.getElementById('retestResult').classList.add('hidden');
  document.getElementById('retestForm').classList.remove('hidden');
  document.getElementById('btnRetestEval').classList.remove('hidden');
  document.getElementById('btnRetestRestart').classList.add('hidden');
}

export function closeRetest() {
  document.getElementById('retestModal').classList.remove('open');
  document.body.style.overflow = '';
}

function evaluateRetest() {
  const profile = loadProfile();
  if (!profile) return;
  newTests = {};
  for (const t of TESTS) {
    newTests[t.key] = parseInt(document.getElementById(`rt_${t.key}`).value) || 0;
  }

  const rows = TESTS.map(t => {
    const before = (profile.tests && profile.tests[t.key]) || 0;
    const after  = newTests[t.key];
    const diff   = after - before;
    const pct    = before > 0 ? Math.round((diff / before) * 100) : null;
    const cls    = diff > 0 ? 'up' : diff < 0 ? 'down' : '';
    const diffStr = `${diff > 0 ? '+' : ''}${diff}${pct !== null ? ` (${pct > 0 ? '+' : ''}${pct}%)` : ''}`;
    return `<div class="wiz-summary-row"><span>${t.label}</span><b>${before} → ${after} <span class="rt-diff ${cls}">${diffStr}</span></b></div>`;
  }).join('');

  const improved = TESTS.filter(t => newTests[t.key] > ((profile.tests && profile.tests[t.key]) || 0)).length;
  const headline = improved >= 3
    ? 'Starke 12 Wochen. Fast alles ist hochgegangen.'
    : improved >= 1
      ? 'Solide Arbeit — Fortschritt ist sichtbar.'
      : 'Halte durch — Fortschritt braucht manchmal länger.';

  document.getElementById('retestResult').innerHTML = `
    <p class="retest-headline">${headline}</p>
    <div class="wiz-summary">${rows}</div>
    <p class="wiz-sub">Starte mit deinen neuen Werten einen frischen 12-Wochen-Zyklus — die Übungen werden automatisch neu eingestuft.</p>
  `;
  document.getElementById('retestResult').classList.remove('hidden');
  document.getElementById('retestForm').classList.add('hidden');
  document.getElementById('btnRetestEval').classList.add('hidden');
  document.getElementById('btnRetestRestart').classList.remove('hidden');

  // Retest am Profil archivieren (auch ohne Neustart)
  profile.retests = profile.retests || [];
  profile.retests.push({ date: new Date().toISOString().slice(0, 10), tests: newTests });
  saveProfile(profile);
}

function restartPlan() {
  const profile = loadProfile();
  if (!profile || !newTests) return;
  const pushL  = classifyLevel('push',  newTests.push);
  const pullL  = classifyLevel('pull',  newTests.pull);
  const squatL = classifyLevel('squat', newTests.squat);
  const plankL = classifyLevel('plank', newTests.plank);

  profile.tests        = { ...newTests };
  profile.levels       = { push: pushL, pike: pushL, pull: pullL, squat: squatL, hinge: squatL, calf: 0, core: plankL };
  profile.levelAdjust  = { push: 0, pike: 0, pull: 0, squat: 0, hinge: 0, calf: 0, core: 0 };
  profile.sessionsDone = 0;
  profile.planBaseline = Object.keys(getTrainLog()).length;
  profile.createdAt    = new Date().toISOString();
  clearExLog();
  clearSessionSnapshot();
  saveProfile(profile);
  closeRetest();
  renderToday();
  document.querySelector('header.hero').scrollIntoView({ behavior: 'smooth' });
}

export function setupRetestHandlers() {
  document.getElementById('retestClose').addEventListener('click', closeRetest);
  document.getElementById('btnRetestEval').addEventListener('click', evaluateRetest);
  document.getElementById('btnRetestRestart').addEventListener('click', restartPlan);
}
