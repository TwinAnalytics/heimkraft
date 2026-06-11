import { PROGRESSIONS, DAY_TEMPLATES } from './data.js';

export function ytLink(exerciseName) {
  const q = encodeURIComponent(exerciseName + ' richtig ausführen Anleitung');
  return `https://www.youtube.com/results?search_query=${q}`;
}

export function parseTargetDefault(target) {
  const m = target.match(/(\d+)(?:[–\-](\d+))?/);
  if (!m) return 0;
  return parseInt(m[2] || m[1]);
}

export function parseTargetRange(target) {
  const m = target.match(/(\d+)(?:[–\-](\d+))?/);
  if (!m) return { lower: 0, upper: 0 };
  const a = parseInt(m[1]);
  const b = m[2] ? parseInt(m[2]) : a;
  return { lower: Math.min(a, b), upper: Math.max(a, b) };
}

export function classifyLevel(pattern, reps) {
  if (pattern === 'push' || pattern === 'squat') {
    if (reps < 5)  return 0;
    if (reps < 10) return 1;
    if (reps < 20) return 2;
    if (reps < 35) return 3;
    return 4;
  }
  if (pattern === 'pull') {
    if (reps < 3)  return 0;
    if (reps < 8)  return 1;
    if (reps < 15) return 2;
    if (reps < 25) return 3;
    return 4;
  }
  if (pattern === 'plank') {
    if (reps < 15) return 0;
    if (reps < 45) return 1;
    if (reps < 90) return 2;
    return 3;
  }
  return 1;
}

// Deload in W4 und W8. W12 ist das Peak-Finale (volle Last), danach kommt der Abschluss-Test.
export function isDeloadWeek(week) {
  const phase       = Math.ceil(week / 4);
  const weekInPhase = ((week - 1) % 4) + 1;
  return weekInPhase === 4 && phase < 3;
}

export function generateExercise(spec, profile, week) {
  const phase       = Math.ceil(week / 4);
  const weekInPhase = ((week - 1) % 4) + 1;
  const isDeload    = isDeloadWeek(week);

  const ladder  = PROGRESSIONS[spec.pattern];
  const baseIdx = profile.levels[spec.pattern] ?? (spec.pattern === 'calf' ? 0 : 1);
  const adjust  = (profile.levelAdjust && profile.levelAdjust[spec.pattern]) || 0;
  let idx = baseIdx + (phase - 1) + adjust;
  if (spec.priority === 'secondary') idx = Math.max(0, idx - 1);
  idx = Math.max(0, Math.min(idx, ladder.length - 1));
  const exercise = ladder[idx];

  const unilateral = !!exercise.unilateral;
  // W12 (weekInPhase 4 in Phase 3) trainiert auf Woche-3-Niveau weiter
  const rangeIdx = Math.min(weekInPhase, 3) - 1;

  let sets, target, type;
  if (exercise.static) {
    type = 'time';
    sets = 3;
    const times = isDeload ? [25, 25, 25] : [25, 35, 45];
    const secs  = times[rangeIdx] || 30;
    target = unilateral ? `${secs} Sek. pro Seite` : `${secs} Sek.`;
  } else {
    type = 'reps';
    sets = isDeload ? 3 : (spec.pattern === 'calf' ? 3 : 4);
    let ranges;
    if (spec.pattern === 'calf') {
      ranges = ['15–20', '18–22', '20–25'];
    } else if (spec.priority === 'main') {
      ranges = ['8–10', '10–12', '12–15'];
    } else {
      ranges = ['6–8', '8–10', '10–12'];
    }
    const deloadRange = spec.pattern === 'calf' ? '12' : (spec.priority === 'main' ? '8' : '6');
    const range = isDeload ? deloadRange : ranges[rangeIdx];
    target = unilateral ? `${range} Wdh. pro Seite` : `${range} Wdh.`;
  }

  return { pattern: spec.pattern, priority: spec.priority, name: exercise.name, hint: exercise.hint, images: exercise.images || [], sets, target, type, unilateral, isDeload };
}

export function templateKey(profile) {
  return profile.split || String(profile.frequency);
}

export function generateWorkout(dayIdx, week, profile) {
  const template = DAY_TEMPLATES[templateKey(profile)][dayIdx];
  return {
    key: template.key,
    name: template.name,
    focus: template.focus,
    week,
    dayIdx,
    isDeload: isDeloadWeek(week),
    isFinale: week === 12,
    exercises: template.ex.map(spec => generateExercise(spec, profile, week))
  };
}

// Plan-Fortschritt: zählt im Player abgeschlossene Workouts (profile.sessionsDone).
// Migration für Bestandsprofile: Logbuch-Einträge minus Baseline.
export function planProgress(profile, completedCount) {
  if (!profile) return 0;
  if (typeof profile.sessionsDone === 'number') return profile.sessionsDone;
  const baseline = profile.planBaseline || 0;
  return Math.max(0, (completedCount || 0) - baseline);
}

export function todaysWorkout(profile, completedCount) {
  if (!profile) return null;
  const numDays   = profile.frequency;
  const effective = planProgress(profile, completedCount);
  const dayIdx    = effective % numDays;
  const week      = Math.min(12, Math.floor(effective / numDays) + 1);
  return generateWorkout(dayIdx, week, profile);
}
