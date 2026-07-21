import { todaysWorkout, generateExercise, parseTargetDefault, parseTargetRange, ytLink, ladderFor, isPowerGoal } from './planner.js';
import { PATTERN_LABELS, WARMUP, WARMUP_POWER } from './data.js';
import {
  loadProfile, saveProfile, appendExLogEntry, loadExLog, loadSettings,
  saveSessionSnapshot, loadSessionSnapshot, clearSessionSnapshot,
  findLastWeight, suggestedWeight, WEIGHT_STEP
} from './storage.js';
import { getTrainLog, logWorkoutToday } from './logbook.js';
import { renderToday } from './today.js';

let session  = null;
let wakeLock = null;

const PATTERN_DE = {
  push: 'Push', pike: 'Pike', pull: 'Pull',
  squat: 'Squat', hinge: 'Hinge', calf: 'Waden', core: 'Core',
  jump: 'Sprung', bound: 'Antritt', rotate: 'Rotation', condition: 'Intervall',
  biceps: 'Bizeps', triceps: 'Trizeps'
};

const ALL_PATTERNS = ['push','pike','pull','squat','hinge','calf','core','jump','bound','rotate','condition','biceps','triceps'];

/* ── Audio: geteilter Context, auf erster User-Geste entsperrt (iOS) ── */
let audioCtx = null;

function primeAudio() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch(e) {}
}

function beep() {
  if (!loadSettings().sound) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value = 880; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
    o.start(); o.stop(audioCtx.currentTime + 0.6);
  } catch(e) {}
}

/* ── Wake Lock: Display an, solange trainiert wird ── */
async function acquireWakeLock() {
  try {
    if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
  } catch(e) { wakeLock = null; }
}

function releaseWakeLock() {
  try { if (wakeLock) { wakeLock.release(); wakeLock = null; } } catch(e) {}
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && session) acquireWakeLock();
});

/* ── Countdown: Zeitstempel-basiert, übersteht Bildschirmsperre ── */
function startCountdown(seconds, onTick, onDone) {
  const endTime = Date.now() + seconds * 1000;
  let lastShown = null;
  const tick = () => {
    const remain = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    if (remain !== lastShown) { lastShown = remain; onTick(remain); }
    if (remain <= 0) { clearInterval(int); onDone(); }
  };
  const int = setInterval(tick, 250);
  tick();
  return {
    stop()  { clearInterval(int); },
    addSeconds(n) {
      const remain = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      return startCountdownFrom(endTime + n * 1000, onTick, onDone, int);
    },
    remaining() { return Math.max(0, Math.ceil((endTime - Date.now()) / 1000)); },
    endTime
  };
}

// Hilfsfunktion für addSeconds: alten Interval ersetzen
function startCountdownFrom(endTime, onTick, onDone, oldInt) {
  clearInterval(oldInt);
  let lastShown = null;
  const tick = () => {
    const remain = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    if (remain !== lastShown) { lastShown = remain; onTick(remain); }
    if (remain <= 0) { clearInterval(int); onDone(); }
  };
  const int = setInterval(tick, 250);
  tick();
  return {
    stop()  { clearInterval(int); },
    addSeconds(n) { return startCountdownFrom(endTime + n * 1000, onTick, onDone, int); },
    remaining() { return Math.max(0, Math.ceil((endTime - Date.now()) / 1000)); },
    endTime
  };
}

/* ── Session-Lifecycle ── */
function buildSession(w, restored) {
  return {
    workout:       w,
    exIdx:         restored ? restored.exIdx : 0,
    setIdx:        restored ? restored.setIdx : 0,
    totalSets:     w.exercises.reduce((sum, e) => sum + e.sets, 0),
    completedSets: restored ? restored.completedSets : 0,
    restTimer:     null,
    restPhase:     false,
    currentReps:   0,
    currentKg:     0,
    history:       restored ? restored.history : w.exercises.map(() => []),
    kgHistory:     restored ? (restored.kgHistory || w.exercises.map(() => [])) : w.exercises.map(() => []),
    swapOffsets:   restored ? (restored.swapOffsets || w.exercises.map(() => 0)) : w.exercises.map(() => 0),
    exTimer:       null,
    exTimerTarget: 0,
    exTimerRunning: false,
    warmupActive:  restored ? false : true,
    warmupIdx:     0,
    warmupTimer:   null
  };
}

function snapshotKey(w) {
  return `${w.key}|W${w.week}`;
}

function persistSnapshot() {
  if (!session || session.warmupActive) return;
  const w = session.workout;
  saveSessionSnapshot({
    date:          new Date().toISOString().slice(0, 10),
    key:           snapshotKey(w),
    exIdx:         session.exIdx,
    setIdx:        session.setIdx,
    completedSets: session.completedSets,
    history:       session.history,
    kgHistory:     session.kgHistory,
    swapOffsets:   session.swapOffsets
  });
}

export function openPlayer(dayIdxOverride = null) {
  const profile = loadProfile();
  if (!profile) return;
  const trainLog       = getTrainLog();
  const completedCount = Object.keys(trainLog).length;
  const w = todaysWorkout(profile, completedCount, dayIdxOverride);
  if (!w) return;

  // Unterbrochenes Workout von heute wiederaufnehmen?
  let restored = null;
  const snap = loadSessionSnapshot();
  if (snap && snap.date === new Date().toISOString().slice(0, 10) && snap.key === snapshotKey(w)
      && snap.completedSets > 0) {
    if (confirm('Angefangenes Workout von heute fortsetzen?')) {
      restored = snap;
    } else {
      clearSessionSnapshot();
    }
  }

  session = buildSession(w, restored);
  // Session-Swaps wiederherstellen
  if (restored && session.swapOffsets.some(o => o !== 0)) {
    applySwapOffsets(profile);
  }

  document.getElementById('playerModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  acquireWakeLock();

  if (session.warmupActive) startWarmupExercise();
  else renderPlayer();
}

function stopAllTimers() {
  if (!session) return;
  if (session.restTimer)   { session.restTimer.stop();   session.restTimer = null; }
  if (session.exTimer)     { session.exTimer.stop();     session.exTimer = null; }
  if (session.warmupTimer) { session.warmupTimer.stop(); session.warmupTimer = null; }
  session.exTimerRunning = false;
}

export function closePlayer() {
  document.getElementById('playerModal').classList.remove('open');
  document.body.style.overflow = '';
  stopAllTimers();
  releaseWakeLock();
  session = null;
}

/* ── Übungs-Swap (eine Stufe leichter/schwerer, nur diese Session) ── */
function ladderIndexOf(ex) {
  const ladder = ladderFor(ex.pattern, loadProfile()) || [];
  return ladder.findIndex(l => l.name === ex.name);
}

function applySwapOffsets(profile) {
  const w = session.workout;
  w.exercises = w.exercises.map((ex, i) => {
    const off = session.swapOffsets[i];
    const clone = {
      ...profile,
      levelAdjust: { ...(profile.levelAdjust || {}), [ex.pattern]: (((profile.levelAdjust || {})[ex.pattern]) || 0) + off }
    };
    return generateExercise({ pattern: ex.pattern, priority: ex.priority }, clone, w.week);
  });
  session.totalSets = w.exercises.reduce((s, e) => s + e.sets, 0);
}

function swapExercise(delta) {
  if (!session || session.restPhase || session.setIdx > 0) return;
  const profile = loadProfile();
  if (!profile) return;
  session.swapOffsets[session.exIdx] += delta;
  applySwapOffsets(profile);
  stopAllTimers();
  renderPlayer();
}

/* ── Rendering ── */
function renderPlayer() {
  if (!session) return;
  const w  = session.workout;
  const ex = w.exercises[session.exIdx];

  document.getElementById('pmWeek').textContent  = `W${w.week}`;
  document.getElementById('pmDay').textContent   = w.isDeload ? 'Deload' : (w.isFinale ? 'Finale' : `Tag ${w.dayIdx + 1}`);
  document.getElementById('pmType').textContent  = session.warmupActive ? 'Warmup' : w.name;
  document.getElementById('pmCount').textContent = session.warmupActive
    ? `Aufwärmen ${session.warmupIdx + 1} / ${warmupList().length}`
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
    renderSwapButtons(ex);

    const isTime = ex.type === 'time';
    const repCtrl    = document.getElementById('repControl');
    const timerCtrl  = document.getElementById('timerControl');
    const btnDone    = document.getElementById('btnSetDone');
    const btnStart   = document.getElementById('btnTimerStart');
    const btnStop    = document.getElementById('btnTimerStop');

    const history     = session.history[session.exIdx];
    const kgHist      = session.kgHistory[session.exIdx];
    const targetVal   = parseTargetDefault(ex.target);
    const defaultReps = isTime
      ? targetVal
      : (history.length > 0 ? history[history.length - 1] : targetVal);
    session.currentReps = defaultReps;

    renderWeightControl(ex, kgHist);

    if (session.exTimer) { session.exTimer.stop(); session.exTimer = null; }
    session.exTimerRunning = false;

    if (isTime) {
      repCtrl.classList.add('hidden');
      timerCtrl.classList.remove('hidden');
      btnDone.classList.add('hidden');
      btnStart.classList.remove('hidden');
      btnStart.textContent = 'Timer starten';
      btnStop.classList.add('hidden');
      session.exTimerTarget = targetVal;
      updateTimerClock(targetVal);
    } else {
      repCtrl.classList.remove('hidden');
      timerCtrl.classList.add('hidden');
      btnDone.classList.remove('hidden');
      btnStart.classList.add('hidden');
      btnStop.classList.add('hidden');
      document.getElementById('repValue').textContent = defaultReps;
      document.getElementById('repLabel').textContent = ex.unilateral ? 'Wdh. pro Seite' : 'Wdh. geschafft';
    }

    const setsEl = document.getElementById('exSets');
    setsEl.innerHTML = '';
    for (let i = 0; i < ex.sets; i++) {
      const dot = document.createElement('span');
      dot.className  = 'set-dot' + (i < session.setIdx ? ' done' : '') + (i === session.setIdx ? ' current' : '');
      dot.textContent = i + 1;
      setsEl.appendChild(dot);
    }

    // Heute schon absolvierte Sätze
    const histEl = document.getElementById('exHistory');
    const unit   = isTime ? 's' : '';
    const fmt    = (r, i, kgArr) => {
      const kg = kgArr && kgArr[i] ? ` <span class="hist-kg">×${kgArr[i]}kg</span>` : '';
      return `<b>${r}${unit}</b>${kg}`;
    };
    let histHtml = '';
    if (history.length > 0) {
      histHtml = 'Heute: ' + history.map((r, i) => fmt(r, i, kgHist)).join(' · ');
    }
    // Letzte Session mit derselben Übung
    const last = findLastPerformance(ex.name);
    if (last) {
      const d = new Date(last.date + 'T12:00:00');
      histHtml += (histHtml ? '<br>' : '') +
        `Letztes Mal (${d.getDate()}.${d.getMonth() + 1}.): ` +
        last.sets.map((r, i) => fmt(r, i, last.weights)).join(' · ');
    }
    histEl.innerHTML = histHtml;
  }
}

function findLastPerformance(exName) {
  const exLog = loadExLog();
  for (let i = exLog.length - 1; i >= 0; i--) {
    const found = exLog[i].exercises.find(e => e.name === exName && e.sets && e.sets.length);
    if (found) return { date: exLog[i].date, sets: found.sets, weights: found.weights || [] };
  }
  return null;
}

// Gewichts-Eingabe für Hantelübungen: Vorschlag = zuletzt benutzt, bei erreichter
// oberer Wdh.-Grenze automatisch eine Stufe höher (Doppelprogression).
function renderWeightControl(ex, kgHist) {
  const ctrl = document.getElementById('weightControl');
  const hint = document.getElementById('weightHint');
  if (!ctrl) return;
  if (!ex.weighted) {
    ctrl.classList.add('hidden');
    session.currentKg = 0;
    return;
  }
  ctrl.classList.remove('hidden');

  let kg, note = '';
  if (kgHist && kgHist.length > 0) {
    kg = kgHist[kgHist.length - 1];               // innerhalb der Session beibehalten
  } else {
    const sug = suggestedWeight(ex.name, 6);
    kg = sug.kg;
    if (sug.raised) note = `Letztes Mal alle Sätze am oberen Ende — hoch von ${sug.from} auf ${sug.kg} kg.`;
    else if (findLastWeight(ex.name)) note = `Zuletzt mit ${kg} kg trainiert.`;
    else note = 'Startgewicht schätzen: die letzten 2 Wdh. sollen hart sein.';
  }
  session.currentKg = kg;
  document.getElementById('kgValue').textContent = kg;
  document.getElementById('kgUnitLabel').textContent = ex.oneDb ? 'kg (eine Hantel)' : 'kg (pro Hantel)';
  if (hint) hint.textContent = note;
}

function renderSwapButtons(ex) {
  const wrap = document.getElementById('swapRow');
  if (!wrap) return;
  const canSwap = session.setIdx === 0;
  const idx     = ladderIndexOf(ex);
  const ladder  = ladderFor(ex.pattern, loadProfile()) || [];
  const btnE = document.getElementById('btnEasier');
  const btnH = document.getElementById('btnHarder');
  btnE.classList.toggle('hidden', !canSwap || idx <= 0);
  btnH.classList.toggle('hidden', !canSwap || idx < 0 || idx >= ladder.length - 1);
  wrap.classList.toggle('hidden', (!canSwap) || (idx <= 0 && idx >= ladder.length - 1));
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

/* ── Warmup ── */
// Athletik-Ziel bekommt ein hüftlastigeres Aufwärmen mit Probesprüngen
function warmupList() {
  return isPowerGoal(loadProfile()) ? WARMUP_POWER : WARMUP;
}

function startWarmupExercise() {
  if (!session) return;
  const w = warmupList()[session.warmupIdx];
  if (!w) {
    session.warmupActive = false;
    if (session.warmupTimer) { session.warmupTimer.stop(); session.warmupTimer = null; }
    renderPlayer();
    return;
  }
  session.warmupActive = true;
  renderWarmupInfo();
  renderPlayer();
  if (session.warmupTimer) session.warmupTimer.stop();
  session.warmupTimer = startCountdown(
    w.seconds,
    remain => updateWarmupClock(remain),
    () => { beep(); session.warmupIdx++; startWarmupExercise(); }
  );
}

function renderWarmupInfo() {
  const list = warmupList();
  const w  = list[session.warmupIdx];
  const nx = list[session.warmupIdx + 1];
  document.getElementById('wuProgress').textContent = `${session.warmupIdx + 1} / ${list.length}`;
  document.getElementById('wuName').textContent     = w.name;
  document.getElementById('wuHint').textContent     = w.hint;
  document.getElementById('wuNext').innerHTML       = nx ? `Danach: <b>${nx.name}</b>` : `Danach: <b>Workout</b>`;
}

function updateWarmupClock(remain) {
  const el = document.getElementById('wuClock');
  if (!el) return;
  const m = Math.floor(remain / 60), s = remain % 60;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.classList.toggle('alert', remain <= 5);
}

function nextWarmup() {
  if (!session || !session.warmupActive) return;
  if (session.warmupTimer) { session.warmupTimer.stop(); session.warmupTimer = null; }
  session.warmupIdx++;
  startWarmupExercise();
}

function skipWarmup() {
  if (!session) return;
  if (session.warmupTimer) { session.warmupTimer.stop(); session.warmupTimer = null; }
  session.warmupActive = false;
  session.warmupIdx    = warmupList().length;
  renderPlayer();
}

/* ── Übungs-Timer (statische Übungen) ── */
function startExerciseTimer() {
  if (!session) return;
  const target = session.exTimerTarget || parseTargetDefault(session.workout.exercises[session.exIdx].target);
  session.exTimerRunning = true;

  document.getElementById('btnTimerStart').classList.add('hidden');
  document.getElementById('btnTimerStop').classList.remove('hidden');

  if (session.exTimer) session.exTimer.stop();
  session.exTimer = startCountdown(
    target,
    remain => updateTimerClock(remain),
    () => {
      session.exTimer = null;
      session.exTimerRunning = false;
      beep();
      session.currentReps = session.exTimerTarget;
      completeSet();
    }
  );
}

function stopExerciseTimerEarly() {
  if (!session || !session.exTimer) return;
  const elapsed = session.exTimerTarget - session.exTimer.remaining();
  session.exTimer.stop();
  session.exTimer = null;
  session.exTimerRunning = false;
  session.currentReps = Math.max(0, elapsed);
  completeSet();
}

function updateTimerClock(remain) {
  const el = document.getElementById('timerClock');
  if (!el) return;
  const m = Math.floor(remain / 60), s = remain % 60;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.classList.toggle('alert', session && session.exTimerRunning && remain <= 5);
  el.classList.toggle('running', session && session.exTimerRunning);
}

/* ── Satz-Abschluss & Pause ── */
function completeSet() {
  const ex = session.workout.exercises[session.exIdx];
  session.history[session.exIdx].push(session.currentReps);
  session.kgHistory[session.exIdx].push(ex.weighted ? session.currentKg : 0);
  session.setIdx++;
  session.completedSets++;
  persistSnapshot();
  if (session.setIdx >= ex.sets) {
    if (session.exIdx + 1 >= session.workout.exercises.length) {
      finishWorkout();
      return;
    }
    session.exIdx++;
    session.setIdx = 0;
    startRest(restDurationFor(session.workout.exercises[session.exIdx]));
  } else {
    startRest(restDurationFor(ex));
  }
}

function restDurationFor(ex) {
  const s = loadSettings();
  // Intervalle bringen ihre eigene, kurze Pause mit
  if (ex.restSec) return ex.restSec;
  // Sprünge brauchen volle Erholung des Nervensystems — sonst sinkt die
  // Sprunghöhe und der Reiz wird zum Ausdauertraining.
  if (ex.pattern === 'jump' || ex.pattern === 'bound') {
    return Math.max(s.restMain, 150);
  }
  return ex.priority === 'main' ? s.restMain : s.restSecondary;
}

function startRest(seconds) {
  if (session.restTimer) session.restTimer.stop();
  session.restPhase = true;
  renderPlayer();
  session.restTimer = startCountdown(
    seconds,
    remain => updateRestClock(remain),
    () => {
      session.restTimer = null;
      beep();
      session.restPhase = false;
      renderPlayer();
    }
  );
}

function updateRestClock(remain) {
  const el = document.getElementById('restClock');
  if (!el) return;
  const m = Math.floor(remain / 60), s = remain % 60;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.classList.toggle('alert', remain <= 5);
}

/* ── Autoregulation ── */
function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Wertet NUR die Patterns aus, die im gerade beendeten Workout als Main trainiert
// wurden — verhindert, dass dasselbe alte Session-Paar mehrfach Anpassungen auslöst.
// Deload-Einheiten werden ignoriert; Zeit-Übungen passen nur nach unten an.
function evaluateAdaptations(profile, finishedWorkout) {
  if (finishedWorkout.isDeload) return { newAdj: profile.levelAdjust || {}, changes: [] };

  const exLog    = loadExLog().filter(en => !en.isDeload);
  const patterns = [...new Set(
    finishedWorkout.exercises
      .filter(e => e.priority === 'main' && e.pattern !== 'condition')
      .map(e => e.pattern)
  )];
  const changes  = [];
  const newAdj   = { ...Object.fromEntries(ALL_PATTERNS.map(p => [p, 0])), ...(profile.levelAdjust || {}) };

  for (const pattern of patterns) {
    const recent = [];
    for (let i = exLog.length - 1; i >= 0 && recent.length < 2; i--) {
      const ex = exLog[i].exercises.find(e => e.pattern === pattern && e.priority === 'main');
      if (ex) recent.push(ex);
    }
    if (recent.length < 2) continue;
    if (recent[0].name !== recent[1].name) continue;       // Anti-Yoyo nach Anpassung
    if (recent[0].type !== recent[1].type) continue;
    // Hantelübungen regeln sich über das Gewicht (Doppelprogression),
    // nicht über einen Wechsel der Übungsvariante.
    if (recent[0].weighted) continue;

    const isTime = recent[0].type === 'time';
    let dir = null;
    if (isTime) {
      // Halte-Übungen: nur runter, wenn 2× deutlich (<80%) unter Ziel
      if (recent.every(ex => avg(ex.sets) < ex.lower * 0.8)) dir = 'down';
    } else {
      if (recent.every(ex => avg(ex.sets) < ex.lower))       dir = 'down';
      else if (recent.every(ex => avg(ex.sets) >= ex.upper)) dir = 'up';
    }

    if (dir === 'down') {
      const next = Math.max(-2, newAdj[pattern] - 1);
      if (next !== newAdj[pattern]) {
        newAdj[pattern] = next;
        changes.push({ pattern, dir, exName: recent[0].name });
      }
    } else if (dir === 'up') {
      const next = Math.min(2, newAdj[pattern] + 1);
      if (next !== newAdj[pattern]) {
        newAdj[pattern] = next;
        changes.push({ pattern, dir, exName: recent[0].name });
      }
    }
  }
  return { newAdj, changes };
}

/* ── Workout-Abschluss ── */
function finishWorkout() {
  stopAllTimers();
  // Migrations-Stand VOR dem Logbuch-Eintrag erfassen (sonst zählt heute doppelt)
  const trainLogCountBefore = Object.keys(getTrainLog()).length;
  logWorkoutToday();
  clearSessionSnapshot();

  const w = session.workout;

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
      weighted: !!ex.weighted,
      sets:     session.history[i] || [],
      weights:  session.kgHistory[i] || []
    };
  });
  appendExLogEntry({
    date:      new Date().toISOString().slice(0, 10),
    week:      w.week,
    dayIdx:    w.dayIdx,
    workout:   w.name,
    isDeload:  !!w.isDeload,
    exercises: exEntries
  });

  // Plan-Fortschritt hochzählen (vom Logbuch-Kalender entkoppelt)
  const profile = loadProfile();
  let adaptChanges = [];
  if (profile) {
    const current = (typeof profile.sessionsDone === 'number')
      ? profile.sessionsDone
      : Math.max(0, trainLogCountBefore - (profile.planBaseline || 0));

    profile.sessionsDone = current + 1;

    const { newAdj, changes } = evaluateAdaptations(profile, w);
    if (changes.length > 0) {
      profile.levelAdjust = newAdj;
      adaptChanges = changes;
    }
    saveProfile(profile);
  }

  document.getElementById('exView').classList.add('hidden');
  document.getElementById('restView').classList.add('hidden');
  document.getElementById('doneView').classList.remove('hidden');
  document.getElementById('dsExercises').textContent = w.exercises.length;
  document.getElementById('dsSets').textContent      = session.totalSets;
  document.getElementById('dsWeek').textContent      = w.week;
  document.getElementById('pmFill').style.width      = '100%';

  renderAdaptations(adaptChanges.concat(weightProgressions(w)));
  renderToday();
}

// Doppelprogression sichtbar machen: Übungen, bei denen heute alle Sätze am oberen
// Ende lagen, werden beim nächsten Mal automatisch schwerer vorgeschlagen.
function weightProgressions(w) {
  const out = [];
  w.exercises.forEach((ex, i) => {
    if (!ex.weighted) return;
    const reps = session.history[i] || [];
    const kgs  = (session.kgHistory[i] || []).filter(k => k > 0);
    if (reps.length === 0 || kgs.length === 0) return;
    const { upper } = parseTargetRange(ex.target);
    if (upper > 0 && reps.every(r => r >= upper)) {
      const from = Math.max(...kgs);
      out.push({ kind: 'weight', exName: ex.name, from, to: from + WEIGHT_STEP });
    }
  });
  return out;
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
    if (c.kind === 'weight') {
      li.innerHTML = `<span class="adapt-arrow up">↑</span><span class="adapt-pat">Gewicht</span> <b>${c.exName}</b>: alle Sätze am oberen Ende — nächstes Mal ${c.from} → <b>${c.to} kg</b>`;
      list.appendChild(li);
      continue;
    }
    const arrow = c.dir === 'down' ? '↓' : '↑';
    const reason = c.dir === 'down'
      ? `<b>${c.exName}</b> war zu schwer — nächste Einheit eine Stufe leichter`
      : `<b>${c.exName}</b> war zu leicht — nächste Einheit eine Stufe schwerer`;
    li.innerHTML = `<span class="adapt-arrow ${c.dir}">${arrow}</span><span class="adapt-pat">${PATTERN_DE[c.pattern] || c.pattern}</span> ${reason}`;
    list.appendChild(li);
  }
}

/* ── Handler ── */
export function setupPlayerHandlers() {
  // iOS-Audio bei erster Berührung entsperren
  document.addEventListener('pointerdown', primeAudio, { once: true });

  document.getElementById('playerClose').addEventListener('click', () => {
    if (confirm('Training unterbrechen? Dein Fortschritt bleibt gespeichert — du kannst heute fortsetzen.')) {
      closePlayer();
    }
  });

  document.getElementById('btnSkipWarmup').addEventListener('click', skipWarmup);
  document.getElementById('btnWarmupNext').addEventListener('click', nextWarmup);

  document.getElementById('btnSetDone').addEventListener('click', () => completeSet());
  document.getElementById('btnTimerStart').addEventListener('click', startExerciseTimer);
  document.getElementById('btnTimerStop').addEventListener('click', stopExerciseTimerEarly);

  document.getElementById('btnEasier').addEventListener('click', () => swapExercise(-1));
  document.getElementById('btnHarder').addEventListener('click', () => swapExercise(1));

  const setReps = v => {
    session.currentReps = Math.max(0, v);
    document.getElementById('repValue').textContent = session.currentReps;
  };
  document.getElementById('repPlus').addEventListener('click',  () => session && setReps(session.currentReps + 1));
  document.getElementById('repMinus').addEventListener('click', () => session && setReps(session.currentReps - 1));
  document.getElementById('repPlus5').addEventListener('click', () => session && setReps(session.currentReps + 5));
  document.getElementById('repMinus5').addEventListener('click',() => session && setReps(session.currentReps - 5));

  const setKg = v => {
    session.currentKg = Math.max(0, Math.round(v * 2) / 2);   // 0,5-kg-Schritte erlaubt
    document.getElementById('kgValue').textContent = session.currentKg;
  };
  document.getElementById('kgPlus').addEventListener('click',  () => session && setKg(session.currentKg + WEIGHT_STEP));
  document.getElementById('kgMinus').addEventListener('click', () => session && setKg(session.currentKg - WEIGHT_STEP));

  document.getElementById('btnSkipRest').addEventListener('click', () => {
    if (session.restTimer) { session.restTimer.stop(); session.restTimer = null; }
    session.restPhase = false;
    renderPlayer();
  });

  document.getElementById('btnAddRest').addEventListener('click', () => {
    if (session.restTimer) session.restTimer = session.restTimer.addSeconds(15);
  });

  document.getElementById('btnFinish').addEventListener('click', closePlayer);
}
