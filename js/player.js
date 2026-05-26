import { todaysWorkout, parseTargetDefault, parseTargetRange, ytLink } from './planner.js';
import { PATTERN_LABELS, WARMUP } from './data.js';
import { loadProfile, saveProfile, appendExLogEntry, loadExLog } from './storage.js';
import { getTrainLog, logWorkoutToday } from './logbook.js';
import { renderToday } from './today.js';

const PATTERN_DE = {
  push:  'Push',
  pike:  'Pike',
  pull:  'Pull',
  squat: 'Squat',
  hinge: 'Hinge',
  core:  'Core'
};

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function evaluateAdaptations(profile) {
  const exLog    = loadExLog();
  const patterns = ['push', 'pike', 'pull', 'squat', 'hinge', 'core'];
  const changes  = [];
  const newAdj   = { ...(profile.levelAdjust || {}) };
  for (const p of patterns) if (!(p in newAdj)) newAdj[p] = 0;

  for (const pattern of patterns) {
    // Letzte zwei main-Übungen dieses Patterns (rep-basiert)
    const recent = [];
    for (let i = exLog.length - 1; i >= 0 && recent.length < 2; i--) {
      const ex = exLog[i].exercises.find(
        e => e.pattern === pattern && e.priority === 'main' && e.type === 'reps'
      );
      if (ex) recent.push(ex);
    }
    if (recent.length < 2) continue;
    // Beide müssen die GLEICHE Übung sein — verhindert Yo-yo direkt nach einer Anpassung
    if (recent[0].name !== recent[1].name) continue;

    const allMissed  = recent.every(ex => avg(ex.sets) < ex.lower);
    const allCrushed = recent.every(ex => avg(ex.sets) >= ex.upper);

    if (allMissed) {
      const next = Math.max(-2, newAdj[pattern] - 1);
      if (next !== newAdj[pattern]) {
        newAdj[pattern] = next;
        changes.push({ pattern, dir: 'down', exName: recent[0].name });
      }
    } else if (allCrushed) {
      const next = Math.min(2, newAdj[pattern] + 1);
      if (next !== newAdj[pattern]) {
        newAdj[pattern] = next;
        changes.push({ pattern, dir: 'up', exName: recent[0].name });
      }
    }
  }
  return { newAdj, changes };
}

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
    history:       w.exercises.map(() => []),
    exTimerInt:    null,
    exTimerRemain: 0,
    exTimerTarget: 0,
    exTimerRunning: false,
    warmupActive:  true,
    warmupIdx:     0,
    warmupInt:     null,
    warmupRemain:  0
  };
  document.getElementById('playerModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  startWarmupExercise();
}

export function closePlayer() {
  document.getElementById('playerModal').classList.remove('open');
  document.body.style.overflow = '';
  if (session && session.restInt)   clearInterval(session.restInt);
  if (session && session.exTimerInt) clearInterval(session.exTimerInt);
  if (session && session.warmupInt)  clearInterval(session.warmupInt);
  session = null;
}

function stopExerciseTimer() {
  if (!session) return;
  if (session.exTimerInt) {
    clearInterval(session.exTimerInt);
    session.exTimerInt = null;
  }
  session.exTimerRunning = false;
}

function renderPlayer() {
  if (!session) return;
  const w  = session.workout;
  const ex = w.exercises[session.exIdx];

  document.getElementById('pmWeek').textContent  = `W${w.week}`;
  document.getElementById('pmDay').textContent   = w.isDeload ? 'Deload' : `Tag ${w.dayIdx + 1}`;
  document.getElementById('pmType').textContent  = session.warmupActive ? 'Warmup' : w.name;
  document.getElementById('pmCount').textContent = session.warmupActive
    ? `Aufwärmen ${session.warmupIdx + 1} / ${WARMUP.length}`
    : `Übung ${session.exIdx + 1} / ${w.exercises.length}`;
  document.getElementById('pmFill').style.width  = `${(session.completedSets / session.totalSets) * 100}%`;

  if (session.warmupActive) {
    document.getElementById('warmupView').classList.remove('hidden');
    document.getElementById('exView').classList.add('hidden');
    document.getElementById('restView').classList.add('hidden');
    document.getElementById('doneView').classList.add('hidden');
    return;
  }

  document.getElementById('warmupView').classList.add('hidden');

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

    renderImages(ex);

    const isTime = ex.type === 'time';
    const repCtrl    = document.getElementById('repControl');
    const timerCtrl  = document.getElementById('timerControl');
    const btnDone    = document.getElementById('btnSetDone');
    const btnStart   = document.getElementById('btnTimerStart');
    const btnStop    = document.getElementById('btnTimerStop');

    const history     = session.history[session.exIdx];
    const targetVal   = parseTargetDefault(ex.target);
    const defaultReps = isTime
      ? targetVal
      : (history.length > 0 ? history[history.length - 1] : targetVal);
    session.currentReps = defaultReps;

    stopExerciseTimer();

    if (isTime) {
      repCtrl.classList.add('hidden');
      timerCtrl.classList.remove('hidden');
      btnDone.classList.add('hidden');
      btnStart.classList.remove('hidden');
      btnStart.textContent = 'Timer starten';
      btnStop.classList.add('hidden');
      session.exTimerTarget  = targetVal;
      session.exTimerRemain  = targetVal;
      updateTimerClock();
    } else {
      repCtrl.classList.remove('hidden');
      timerCtrl.classList.add('hidden');
      btnDone.classList.remove('hidden');
      btnStart.classList.add('hidden');
      btnStop.classList.add('hidden');
      document.getElementById('repValue').textContent = defaultReps;
      document.getElementById('repLabel').textContent = 'Wdh. geschafft';
    }

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
      const unit    = isTime ? 's' : '';
      histEl.innerHTML = 'Bisher: ' + history.map(r => `<b>${r}${unit}</b>`).join(' · ');
    } else {
      histEl.innerHTML = '';
    }
  }
}

function startWarmupExercise() {
  if (!session) return;
  const w = WARMUP[session.warmupIdx];
  if (!w) {
    // warm-up done → start real workout
    session.warmupActive = false;
    renderPlayer();
    return;
  }
  session.warmupActive = true;
  session.warmupRemain = w.seconds;
  renderWarmup();
  if (session.warmupInt) clearInterval(session.warmupInt);
  session.warmupInt = setInterval(() => {
    session.warmupRemain--;
    updateWarmupClock();
    if (session.warmupRemain <= 0) {
      clearInterval(session.warmupInt);
      session.warmupInt = null;
      beep();
      session.warmupIdx++;
      startWarmupExercise();
    }
  }, 1000);
}

function renderWarmup() {
  if (!session) return;
  const w  = WARMUP[session.warmupIdx];
  const nx = WARMUP[session.warmupIdx + 1];
  document.getElementById('wuProgress').textContent = `${session.warmupIdx + 1} / ${WARMUP.length}`;
  document.getElementById('wuName').textContent     = w.name;
  document.getElementById('wuHint').textContent     = w.hint;
  document.getElementById('wuNext').innerHTML       = nx
    ? `Danach: <b>${nx.name}</b>`
    : `Danach: <b>Workout</b>`;
  renderPlayer();
  updateWarmupClock();
}

function updateWarmupClock() {
  if (!session) return;
  const remain = Math.max(0, session.warmupRemain);
  const m  = Math.floor(remain / 60);
  const s  = remain % 60;
  const el = document.getElementById('wuClock');
  if (!el) return;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.classList.toggle('alert', remain <= 5);
}

function skipWarmup() {
  if (!session) return;
  if (session.warmupInt) clearInterval(session.warmupInt);
  session.warmupInt    = null;
  session.warmupActive = false;
  session.warmupIdx    = WARMUP.length;
  renderPlayer();
}

function renderImages(ex) {
  const wrap = document.getElementById('exImages');
  wrap.innerHTML = '';
  if (!ex.images || ex.images.length === 0) {
    wrap.classList.add('empty');
    return;
  }
  wrap.classList.remove('empty');
  ex.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${ex.name} – Position ${i + 1}`;
    img.loading = 'lazy';
    img.onerror = () => { img.classList.add('broken'); };
    wrap.appendChild(img);
  });
}

function startExerciseTimer() {
  if (!session) return;
  const target = session.exTimerTarget || parseTargetDefault(session.workout.exercises[session.exIdx].target);
  session.exTimerRemain  = target;
  session.exTimerRunning = true;
  updateTimerClock();

  const btnStart = document.getElementById('btnTimerStart');
  const btnStop  = document.getElementById('btnTimerStop');
  btnStart.classList.add('hidden');
  btnStop.classList.remove('hidden');

  if (session.exTimerInt) clearInterval(session.exTimerInt);
  session.exTimerInt = setInterval(() => {
    session.exTimerRemain--;
    updateTimerClock();
    if (session.exTimerRemain <= 0) {
      stopExerciseTimer();
      beep();
      session.currentReps = session.exTimerTarget;
      completeSet();
    }
  }, 1000);
}

function stopExerciseTimerEarly() {
  if (!session) return;
  const elapsed = session.exTimerTarget - session.exTimerRemain;
  stopExerciseTimer();
  session.currentReps = Math.max(0, elapsed);
  completeSet();
}

function updateTimerClock() {
  if (!session) return;
  const remain = Math.max(0, session.exTimerRemain);
  const m  = Math.floor(remain / 60);
  const s  = remain % 60;
  const el = document.getElementById('timerClock');
  if (!el) return;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.classList.toggle('alert', session.exTimerRunning && remain <= 5);
  el.classList.toggle('running', session.exTimerRunning);
}

function completeSet() {
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
  if (session.restInt)    clearInterval(session.restInt);
  if (session.exTimerInt) clearInterval(session.exTimerInt);
  if (session.warmupInt)  clearInterval(session.warmupInt);
  logWorkoutToday();

  const w = session.workout;

  // Per-exercise Performance speichern
  const exEntries = w.exercises.map((ex, i) => {
    const range = parseTargetRange(ex.target);
    return {
      name:     ex.name,
      pattern:  ex.pattern,
      priority: ex.priority || 'main',
      type:     ex.type,
      target:   ex.target,
      lower:    range.lower,
      upper:    range.upper,
      sets:     session.history[i] || []
    };
  });
  appendExLogEntry({
    date:     new Date().toISOString().slice(0, 10),
    week:     w.week,
    dayIdx:   w.dayIdx,
    workout:  w.name,
    exercises: exEntries
  });

  // Autoregulation evaluieren und Profil aktualisieren
  const profile = loadProfile();
  let adaptChanges = [];
  if (profile) {
    const { newAdj, changes } = evaluateAdaptations(profile);
    if (changes.length > 0) {
      profile.levelAdjust = newAdj;
      saveProfile(profile);
      adaptChanges = changes;
    }
  }

  // Done-View befüllen
  document.getElementById('exView').classList.add('hidden');
  document.getElementById('restView').classList.add('hidden');
  document.getElementById('doneView').classList.remove('hidden');
  document.getElementById('dsExercises').textContent = w.exercises.length;
  document.getElementById('dsSets').textContent      = session.totalSets;
  document.getElementById('dsWeek').textContent      = w.week;
  document.getElementById('pmFill').style.width      = '100%';

  renderAdaptations(adaptChanges);
  renderToday();
}

function renderAdaptations(changes) {
  const block = document.getElementById('adaptBlock');
  const list  = document.getElementById('adaptList');
  if (!block || !list) return;
  if (!changes || changes.length === 0) {
    block.classList.add('hidden');
    list.innerHTML = '';
    return;
  }
  block.classList.remove('hidden');
  list.innerHTML = '';
  for (const c of changes) {
    const li = document.createElement('li');
    const arrow = c.dir === 'down' ? '↓' : '↑';
    const reason = c.dir === 'down'
      ? `<b>${c.exName}</b> war zu schwer — nächste Einheit eine Stufe leichter`
      : `<b>${c.exName}</b> war zu leicht — nächste Einheit eine Stufe schwerer`;
    li.innerHTML = `<span class="adapt-arrow ${c.dir}">${arrow}</span><span class="adapt-pat">${PATTERN_DE[c.pattern] || c.pattern}</span> ${reason}`;
    list.appendChild(li);
  }
}

export function setupPlayerHandlers() {
  document.getElementById('playerClose').addEventListener('click', () => {
    if (confirm('Training abbrechen? Bisheriger Fortschritt wird nicht ins Logbuch eingetragen.')) {
      closePlayer();
    }
  });

  document.getElementById('btnSkipWarmup').addEventListener('click', skipWarmup);

  document.getElementById('btnSetDone').addEventListener('click', () => {
    completeSet();
  });

  document.getElementById('btnTimerStart').addEventListener('click', () => {
    startExerciseTimer();
  });

  document.getElementById('btnTimerStop').addEventListener('click', () => {
    stopExerciseTimerEarly();
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
