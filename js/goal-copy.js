import { loadProfile } from './storage.js';
import { isPowerGoal } from './planner.js';

// Zwei Textstellen widersprechen dem Athletik-Ziel direkt: das Prinzip
// "Nahe an Versagen" (Ermüdung senkt die Bewegungsgeschwindigkeit) und die
// Empfehlung eines Kalorienüberschusses (Ziel ist Definition). Beide werden
// hier passend zum eingestellten Ziel ausgetauscht.

const PRINCIPLE = {
  hypertrophy: {
    title: 'Nahe an Versagen',
    text: 'Die letzten zwei bis drei Wiederholungen jedes Satzes müssen schwer sein. Wenn du saubere zwanzig Liegestütze machst, ist es Zeit für die nächste Stufe – nicht für vierzig.'
  },
  power: {
    title: 'Qualität vor Erschöpfung',
    text: 'Jede Wiederholung wird so schnell wie möglich bewegt – und der Satz endet, solange sie noch schnell ist. Sobald Sprunghöhe oder Tempo sichtbar abfallen, ist der Reiz vorbei und es beginnt reines Ermüdungstraining. Zwei bis drei Wiederholungen bleiben immer im Tank.'
  }
};

const NUTRITION = {
  hypertrophy: {
    lead: 'Muskeln bauen sich aus Aminosäuren auf. Ohne ausreichend Eiweiß bleibt jeder Trainingsplan wirkungslos.',
    items: [
      '<b>1,6–2,0 g Protein</b> pro kg Körpergewicht täglich',
      '<b>Leichter Kalorienüberschuss</b> für maximale Hypertrophie (+200–300 kcal)',
      'Verteile Protein auf 3–4 Mahlzeiten',
      'Kreatin-Monohydrat (5g/Tag) ist das einzige Supplement mit klarer Studienlage'
    ]
  },
  power: {
    lead: 'Definiert wirst du in der Küche, explosiv im Training. Beides gleichzeitig verlangt einen schmalen Grat: genug Energie für Sprungkraft, aber kein Überschuss.',
    items: [
      '<b>1,8–2,2 g Protein</b> pro kg Körpergewicht – schützt die Muskeln, während du schlanker wirst',
      '<b>Kalorien auf Erhaltung</b> oder maximal 300 kcal darunter. Schärfere Defizite kosten dich Sprungkraft und Spritzigkeit',
      '<b>Kohlenhydrate vor dem Spiel</b> nicht streichen – sie sind der Treibstoff für Antritte und Sprünge',
      'An Spieltagen ausreichend trinken und Salz nicht vergessen: im Sand verlierst du deutlich mehr, als du merkst',
      'Kreatin-Monohydrat (5g/Tag) unterstützt genau die kurzen, maximalen Belastungen im Spiel'
    ]
  }
};

export function renderGoalCopy() {
  const key = isPowerGoal(loadProfile()) ? 'power' : 'hypertrophy';

  const pBlock = document.getElementById('principle03');
  if (pBlock) {
    const p = PRINCIPLE[key];
    pBlock.querySelector('h3').textContent = p.title;
    pBlock.querySelector('p').textContent  = p.text;
  }

  const nBlock = document.getElementById('ruleNutrition');
  if (nBlock) {
    const n = NUTRITION[key];
    nBlock.querySelector('p').textContent = n.lead;
    nBlock.querySelector('ul').innerHTML  = n.items.map(i => `<li>${i}</li>`).join('');
  }
}
