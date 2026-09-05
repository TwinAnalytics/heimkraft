import { PROGRESSIONS, PROGRESSIONS_DB, PROGRESSIONS_POWER, DAY_TEMPLATES } from './data.js';

// Muster, die mit Hanteln nicht einer Schwierigkeits-Leiter folgen, sondern
// wochenweise durch einen Variations-Pool rotieren. Das Gewicht steigert über
// die Doppelprogression, deshalb darf die Übungsauswahl abwechseln.
const VARIETY_DB = new Set(['push', 'pull', 'pike', 'biceps', 'triceps', 'rear']);

export function goalOf(profile) {
  return (profile && profile.goal) || 'hypertrophy';
}

export function isPowerGoal(profile) {
  return goalOf(profile) === 'power';
}

// Welche Übungsleiter gilt für dieses Muster?
// Athletik-Ziel: eigene Schnellkraft-Leitern; ohne Hanteln fallen beladene
// Varianten heraus. Hypertrophie: mit Hanteln wechseln pull/squat/hinge/pike/
// calf auf die Hantel-Varianten, push und core bleiben Körpergewicht.
export function ladderFor(pattern, profile) {
  const hasDb = !!(profile && profile.dumbbells);

  // Variations-Pool (z.B. Brust) hat mit Hanteln Vorrang — der Pool bestimmt die
  // Übung, das Gewicht die Last. isVarietyLadder regelt, in welchem Modus das gilt.
  if (isVarietyLadder(pattern, profile)) {
    return PROGRESSIONS_DB[pattern];
  }

  let ladder;
  if (isPowerGoal(profile) && PROGRESSIONS_POWER[pattern]) {
    ladder = PROGRESSIONS_POWER[pattern];
  } else if (hasDb && PROGRESSIONS_DB[pattern]) {
    ladder = PROGRESSIONS_DB[pattern];
  } else {
    ladder = PROGRESSIONS[pattern] || PROGRESSIONS_DB[pattern] || PROGRESSIONS_POWER[pattern];
  }
  if (!ladder) return [];

  // Ohne Hanteln fallen beladene Varianten heraus — jede Leiter hält dafür
  // mindestens eine Körpergewichtsübung bereit.
  if (!hasDb) {
    const bodyweight = ladder.filter(e => !e.weighted);
    if (bodyweight.length) return bodyweight;
  }
  return ladder;
}

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

export function isVarietyLadder(pattern, profile) {
  if (!(profile && profile.dumbbells) || !PROGRESSIONS_DB[pattern] || !VARIETY_DB.has(pattern)) {
    return false;
  }
  // Brust rotiert in beiden Modi. Die übrigen Oberkörper-Muster rotieren nur im
  // Aufbau-Modus — im Athletik-Modus bleiben dort die Schnellkraft-Varianten
  // (z.B. Push Press) erhalten.
  if (pattern === 'push') return true;
  return !isPowerGoal(profile);
}

// Löst die Leiter-Stufe für eine Übung auf (vor dem Klemmen, inkl. Secondary-Abschlag).
// Bei Hantelübungen zählt die Krafteinstufung aus dem Wizard nicht — dort steuert
// das Gewicht die Last, deshalb startet jeder auf der Basis-Variante.
export function resolveLadderIndex(spec, profile, week) {
  const phase   = Math.ceil(week / 4);
  const ladder  = ladderFor(spec.pattern, profile);
  const adjust  = (profile.levelAdjust && profile.levelAdjust[spec.pattern]) || 0;

  // Variations-Pool: über die Wochen durchrotieren (mit Wrap-around), ein
  // Zweitslot am selben Tag startet versetzt für einen anderen Reiz.
  if (isVarietyLadder(spec.pattern, profile)) {
    const off = spec.priority === 'secondary' ? Math.floor(ladder.length / 2) : 0;
    const vi  = (week - 1) + adjust + off;
    return ((vi % ladder.length) + ladder.length) % ladder.length;
  }

  // Bei Hantel- und Schnellkraft-Übungen zählt die Krafteinstufung nicht:
  // dort steuern Gewicht bzw. Technik die Belastung, nicht die Wizard-Werte.
  const fromScratch = isPowerGoal(profile) ||
                      !!(profile.dumbbells && PROGRESSIONS_DB[spec.pattern]) ||
                      !PROGRESSIONS[spec.pattern];
  const baseIdx = fromScratch ? 0 : (profile.levels[spec.pattern] ?? (spec.pattern === 'calf' ? 0 : 1));
  let idx = baseIdx + (phase - 1) + adjust;
  if (spec.priority === 'secondary') idx -= 1;
  return Math.max(0, Math.min(idx, ladder.length - 1));
}

export function generateExercise(spec, profile, week, indexOverride = null) {
  const phase       = Math.ceil(week / 4);
  const weekInPhase = ((week - 1) % 4) + 1;
  const isDeload    = isDeloadWeek(week);

  const ladder  = ladderFor(spec.pattern, profile);
  const idx = indexOverride !== null
    ? Math.max(0, Math.min(indexOverride, ladder.length - 1))
    : resolveLadderIndex(spec, profile, week);
  const exercise = ladder[idx];

  const unilateral = !!exercise.unilateral;
  const weighted   = !!exercise.weighted;
  const oneDb      = !!exercise.oneDb;
  const startKg    = exercise.startKg || null;
  // W12 (weekInPhase 4 in Phase 3) trainiert auf Woche-3-Niveau weiter
  const rangeIdx = Math.min(weekInPhase, 3) - 1;

  const power      = isPowerGoal(profile);
  const isSuperset = spec.ss !== undefined && spec.ss !== null;

  let sets, target, type;
  if (isSuperset) {
    // Supersatz-Ganzkörperplan: 3 Runden pro Block. Erste zwei Blöcke schwerer
    // (weniger Wdh.), letzte zwei höher — für Kraft UND Aufbau (wie im Video).
    type = 'reps';
    sets = isDeload ? 2 : 3;
    const heavy = spec.ss <= 1;
    const range = isDeload ? (heavy ? '6' : '10') : (heavy ? '8–10' : '12–15');
    target = unilateral ? `${range} Wdh. pro Seite` : `${range} Wdh.`;
  } else if (spec.pattern === 'condition') {
    // Intervalle: kurz und all-out, die Pause dazwischen ist Teil des Reizes
    type = 'time';
    sets = isDeload ? 4 : [5, 6, 7][rangeIdx] || 6;
    const secs = isDeload ? 20 : [20, 25, 30][rangeIdx] || 25;
    target = `${secs} Sek. all-out`;
  } else if (exercise.static) {
    type = 'time';
    sets = 3;
    const times = isDeload ? [25, 25, 25] : [25, 35, 45];
    const secs  = times[rangeIdx] || 30;
    target = unilateral ? `${secs} Sek. pro Seite` : `${secs} Sek.`;
  } else if (power && (spec.pattern === 'jump' || spec.pattern === 'bound')) {
    // Sprünge: viele Sätze, wenige Wiederholungen, jede maximal.
    // Volumen bleibt niedrig, weil der Sand die Beine ohnehin belastet.
    type = 'reps';
    sets = isDeload ? 3 : [4, 5, 5][rangeIdx] || 4;
    const ranges = isDeload ? ['3'] : ['3–4', '4–5', '5–6'];
    const range  = isDeload ? '3' : ranges[rangeIdx];
    target = unilateral ? `${range} Sprünge pro Seite` : `${range} Sprünge`;
  } else {
    type = 'reps';
    // Arme, Waden und Bauch brauchen keine vier Sätze — sie arbeiten mit
    const isArm  = spec.pattern === 'biceps' || spec.pattern === 'triceps';
    const isSmall = isArm || spec.pattern === 'calf' || spec.pattern === 'crunch' || spec.pattern === 'rear';
    sets = isDeload ? 3 : (isSmall ? 3 : 4);
    let ranges;
    if (power) {
      // Zwei Welten in einem Plan: Beine werden explosiv und mit Reserve
      // trainiert (Ermüdung senkt die Bewegungsgeschwindigkeit), der
      // Oberkörper dagegen im Aufbaubereich — Ziel ist sichtbare Muskulatur.
      const armPattern   = spec.pattern === 'biceps' || spec.pattern === 'triceps';
      const upperPattern = spec.pattern === 'push' || spec.pattern === 'pike' || spec.pattern === 'pull';
      if (armPattern) {
        ranges = ['10–12', '12–14', '12–15'];
      } else if (upperPattern) {
        ranges = spec.priority === 'main' ? ['8–10', '9–12', '10–12'] : ['10–12', '10–12', '12–15'];
      } else if (spec.pattern === 'rotate') {
        ranges = ['8–10', '10–12', '12–14'];
      } else {
        ranges = spec.priority === 'main' ? ['4–6', '5–6', '6–8'] : ['6–8', '6–8', '8–10'];
      }
    } else if (spec.pattern === 'calf') {
      // Waden vertragen bei Zusatzlast weniger Wdh. als im reinen Körpergewicht
      ranges = weighted ? ['12–15', '14–18', '15–20'] : ['15–20', '18–22', '20–25'];
    } else if (spec.pattern === 'crunch') {
      ranges = ['12–15', '15–18', '15–20'];
    } else if (spec.pattern === 'rear') {
      // Hintere Schulter: leicht und sauber, höhere Wdh.
      ranges = ['12–15', '12–15', '15–18'];
    } else if (weighted) {
      // Doppelprogression: Wdh.-Fenster bleibt schmal, gesteigert wird über kg
      ranges = spec.priority === 'main' ? ['8–10', '9–11', '10–12'] : ['10–12', '11–13', '12–15'];
    } else if (spec.priority === 'main') {
      ranges = ['8–10', '10–12', '12–15'];
    } else {
      ranges = ['6–8', '8–10', '10–12'];
    }
    const deloadRange = power
      ? (spec.pattern === 'biceps' || spec.pattern === 'triceps' ? '10'
         : (['push','pike','pull','rotate'].includes(spec.pattern) ? '8' : '4'))
      : (spec.pattern === 'calf' ? '12' : (spec.priority === 'main' ? '8' : '6'));
    const range = isDeload ? deloadRange : ranges[rangeIdx];
    target = unilateral ? `${range} Wdh. pro Seite` : `${range} Wdh.`;
  }

  return {
    pattern: spec.pattern, priority: spec.priority,
    name: exercise.name, hint: exercise.hint, images: exercise.images || [],
    sets, target, type, unilateral, weighted, oneDb, startKg, isDeload,
    restSec: exercise.restSec || null,
    ss: (spec.ss !== undefined ? spec.ss : null),
    ladderIdx: idx
  };
}

// Wählt für eine Kollision die nächstgelegene freie Stufe – bevorzugt leichter (runter),
// sonst schwerer (hoch). Verhindert dieselbe Übung zweimal am selben Tag.
function pickDistinctIndex(idx, used, len) {
  for (let d = 1; d < len; d++) {
    if (idx - d >= 0      && !used.has(idx - d)) return idx - d;
    if (idx + d <= len - 1 && !used.has(idx + d)) return idx + d;
  }
  return idx;
}

export function templateKey(profile) {
  return profile.split || String(profile.frequency);
}

export function dayCount(profile) {
  return DAY_TEMPLATES[templateKey(profile)].length;
}

export function generateWorkout(dayIdx, week, profile) {
  const days     = DAY_TEMPLATES[templateKey(profile)];
  const template = days[dayIdx % days.length];   // wrap: Ein-Tages-Pläne wiederholen sich
  const usedByPattern = {};
  const exercises = template.ex.map(spec => {
    const ex   = generateExercise(spec, profile, week);
    const used = usedByPattern[spec.pattern] || (usedByPattern[spec.pattern] = new Set());
    let idx = ex.ladderIdx;
    if (used.has(idx)) idx = pickDistinctIndex(idx, used, ladderFor(spec.pattern, profile).length);
    used.add(idx);
    return idx === ex.ladderIdx ? ex : generateExercise(spec, profile, week, idx);
  });
  return {
    key: template.key,
    name: template.name,
    focus: template.focus,
    week,
    dayIdx,
    isDeload: isDeloadWeek(week),
    isFinale: week === 12,
    exercises
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

export function currentPlanWeek(profile, completedCount) {
  if (!profile) return 1;
  const effective = planProgress(profile, completedCount);
  return Math.min(12, Math.floor(effective / profile.frequency) + 1);
}

export function nextDayIdx(profile, completedCount) {
  if (!profile) return 0;
  return planProgress(profile, completedCount) % profile.frequency;
}

export function todaysWorkout(profile, completedCount, dayIdxOverride = null) {
  if (!profile) return null;
  const week   = currentPlanWeek(profile, completedCount);
  const dayIdx = dayIdxOverride !== null ? dayIdxOverride : nextDayIdx(profile, completedCount);
  return generateWorkout(dayIdx, week, profile);
}
