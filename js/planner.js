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

export function generateExercise(spec, profile, week) {
  const phase       = Math.ceil(week / 4);
  const weekInPhase = ((week - 1) % 4) + 1;
  const isDeload    = weekInPhase === 4;

  const ladder = PROGRESSIONS[spec.pattern];
  let baseIdx = profile.levels[spec.pattern] || 1;
  let idx = baseIdx + (phase - 1);
  if (spec.priority === 'secondary') idx = Math.max(0, idx - 1);
  idx = Math.max(0, Math.min(idx, ladder.length - 1));
  const exercise = ladder[idx];

  let sets, target, type;
  if (exercise.static) {
    type = 'time';
    sets = 3;
    const times = isDeload ? [25, 25, 25] : [25, 35, 45];
    const secs = times[Math.min(weekInPhase, 3) - 1] || 30;
    target = `${secs} Sek.`;
  } else {
    type = 'reps';
    sets = isDeload ? 3 : 4;
    const mainRanges      = ['8–10', '10–12', '12–15'];
    const secondaryRanges = ['6–8',  '8–10',  '10–12'];
    const ranges = spec.priority === 'main' ? mainRanges : secondaryRanges;
    const range = isDeload ? (spec.priority === 'main' ? '8' : '6') : ranges[weekInPhase - 1];
    target = `${range} Wdh.`;
  }

  return { pattern: spec.pattern, name: exercise.name, hint: exercise.hint, images: exercise.images || [], sets, target, type, isDeload };
}

export function generateWorkout(dayIdx, week, profile) {
  const template = DAY_TEMPLATES[String(profile.frequency)][dayIdx];
  return {
    key: template.key,
    name: template.name,
    focus: template.focus,
    week,
    dayIdx,
    isDeload: ((week - 1) % 4) + 1 === 4,
    exercises: template.ex.map(spec => generateExercise(spec, profile, week))
  };
}

export function todaysWorkout(profile, completedCount) {
  if (!profile) return null;
  const numDays = profile.frequency;
  const dayIdx  = completedCount % numDays;
  const week    = Math.min(12, Math.floor(completedCount / numDays) + 1);
  return generateWorkout(dayIdx, week, profile);
}
