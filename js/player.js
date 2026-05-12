import { todaysWorkout, parseTargetDefault, ytLink } from './planner.js';
import { PATTERN_LABELS } from './data.js';
import { loadProfile } from './storage.js';
import { getTrainLog, logWorkoutToday } from './logbook.js';
import { renderToday } from './today.js';

let session = null;

export function openPlayer() {
  const profile = loadProfile();
  if (!profile) return;
  const trainLog       = getTrainLog();
  const completedCount = Object.keys(trainLog).length;
  const w = todaysWorkout(profile, completedCount);
  if (!w) return;
  session = {
    workout:       w,
    exIdx:         0,
    setIdx:        0,
    totalSets:     w.exercises.reduce((sum, e) => sum + e.sets, 0),
    completedSets: 0,
    restRemain:    0,
    restInt:       null,
    restPhase:     false,
    currentReps:   0,
    history:       w.exercises.map(() => [])
  };
  document.getElementById('playerModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderPlayer();
}

export function closePlayer() {
  document.getElementById('playerModal').classList.remove('open');
  document.body.style.overflow = '';
  if (session && session.restInt) clearInterval(session.restInt);
  session = null;
}

function renderPlayer() {
  if (!session) return;
  const w  = session.workout;
  const ex = w.exercises[session.exIdx];

  document.getElementById('pmWeek').textContent  = `W${w.week}`;
  document.getElementById('pmDay').textContent   = w.isDeload ? 'Deload' : `Tag ${w.dayIdx + 1}`;
  document.getElementById('pmType').textContent  = w.name;
  document.getElementById('pmCount').textContent = `Übung ${session.exIdx + 1} / ${w.exercises.length}`;
  document.getElementById('pmFill').style.width  = `${(session.completedSets / session.totalSets) * 100}%`;

  if (session.restPhase) {
    document.getElementById('exView').classList.add('hidden');
    document.getElementById('restView').classList.remove('hidden');
    document.getElementById('doneView').classList.add('hidden');
    let nextLabel, nextEx;
    if (session.setIdx < ex.sets) {
      nextLabel = `Satz ${session.setIdx + 1}`;
      nextEx    = ex.name;
    } else if (session.exIdx + 1 < w.exercises.length) {
      const ne  = w.exercises[session.exIdx + 1];
      nextLabel = 'Satz 1';
      nextEx    = ne.name;
    } else {
      nextLabel = 'Letzte';
      nextEx    = '—';
    }
    document.getElementById('restNext').textContent   = nextLabel;
    document.getElementById('restExName').textContent = nextEx;
  } else {
    document.getElementById('exView').classList.remove('hidden');
    document.getElementById('restView').classList.add('hidden');
    document.getElementById('doneView').classList.add('hidden');
    document.getElementById('exNum').textContent     = `Übung ${session.exIdx + 1} von ${w.exercises.length}`;
    document.getElementById('exName').textContent    = ex.name;
    document.getElementById('exPattern').textContent = PATTERN_LABELS[ex.pattern] || ex.pattern.toUpperCase();
    document.getElementById('exTarget').firstChild.textContent = ex.target;
    document.getElementById('exTargetLabel').textContent       = `${ex.sets} Sätze · pro Satz`;
    document.getElementById('exHint').textContent  = ex.hint;
    document.getElementById('exVideo').href        = ytLink(ex.name);

    const history     = session.history[session.exIdx];
    const defaultReps = history.length > 0 ? history[history.length - 1] : parseTargetDefault(ex.target);
    session.currentReps = defaultReps;
    document.getElementById('repValue').textContent = defaultReps;
    document.getElementById('repLabel').textContent = ex.type === 'time' ? 'Sekunden' : 'Wdh. geschafft';

    const setsEl = document.getElementById('exSets');
    setsEl.innerHTML = '';
    for (let i = 0; i < ex.sets; i++) {
      const dot = document.createElement('span');
      dot.className  = 'set-dot' + (i < session.setIdx ? ' done' : '') + (i === session.setIdx ? ' current' : '');
      dot.textContent = i + 1;
      setsEl.appendChild(dot);
    }

    const histEl = document.getElementById('exHistory');
    if (history.length > 0) {
      const unit    = ex.type === 'time' ? 's' : '';
      histEl.innerHTML = 'Bisher: ' + history.map(r => `<b>${r}${unit}</b>`).join(' · ');
    } else {
      histEl.innerHTML = '';
    }
  }
}

function startRest(seconds) {
  if (session.restInt) clearInterval(session.restInt);
  session.restRemain = seconds;
  session.restPhase  = true;
  renderPlayer();
  updateRestClock();
  session.restInt = setInterval(() => {
    session.restRemain--;
    updateRestClock();
    if (session.restRemain <= 0) {
      clearInterval(session.restInt);
      session.restInt   = null;
      beep();
      session.restPhase = false;
      renderPlayer();
    }
  }, 1000);
}

function updateRestClock() {
  const m  = Math.floor(session.restRemain / 60);
  const s  = session.restRemain % 60;
  const el = document.getElementById('restClock');
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.classList.toggle('alert', session.restRemain <= 5);
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o   = ctx.createOscillator();
    const g   = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    o.start(); o.stop(ctx.currentTime + 0.6);
  } catch(e) {}
}

function finishWorkout() {
  if (session.restInt) clearInterval(session.restInt);
  logWorkoutToday();

  const w = session.workout;
  document.getElementById('exView').classList.add('hidden');
  document.getElementById('restView').classList.add('hidden');
  document.getElementById('doneView').classList.remove('hidden');
  document.getElementById('dsExercises').textContent = w.exercises.length;
  document.getElementById('dsSets').textContent      = session.totalSets;
  document.getElementById('dsWeek').textContent      = w.week;
  document.getElementById('pmFill').style.width      = '100%';
  renderToday();
}

export function setupPlayerHandlers() {
  document.getElementById('playerClose').addEventListener('click', () => {
    if (confirm('Training abbrechen? Bisheriger Fortschritt wird nicht ins Logbuch eingetragen.')) {
      closePlayer();
    }
  });

  document.getElementById('btnSetDone').addEventListener('click', () => {
    const ex = session.workout.exercises[session.exIdx];
    session.history[session.exIdx].push(session.currentReps);
    session.setIdx++;
    session.completedSets++;
    if (session.setIdx >= ex.sets) {
      if (session.exIdx + 1 >= session.workout.exercises.length) {
        finishWorkout();
        return;
      }
      session.exIdx++;
      session.setIdx = 0;
      startRest(90);
    } else {
      startRest(90);
    }
  });

  document.getElementById('repPlus').addEventListener('click', () => {
    if (!session) return;
    session.currentReps++;
    document.getElementById('repValue').textContent = session.currentReps;
  });

  document.getElementById('repMinus').addEventListener('click', () => {
    if (!session) return;
    session.currentReps = Math.max(0, session.currentReps - 1);
    document.getElementById('repValue').textContent = session.currentReps;
  });

  document.getElementById('btnSkipRest').addEventListener('click', () => {
    if (session.restInt) clearInterval(session.restInt);
    session.restInt   = null;
    session.restPhase = false;
    renderPlayer();
  });

  document.getElementById('btnAddRest').addEventListener('click', () => {
    session.restRemain += 15;
    updateRestClock();
  });

  document.getElementById('btnFinish').addEventListener('click', closePlayer);
}
