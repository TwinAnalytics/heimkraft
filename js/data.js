export const PROGRESSIONS = {
  push: [
    { name: 'Wand-Liegestütze',           hint: 'Hände an die Wand auf Brusthöhe. Körper schräg, kontrolliert absenken.' },
    { name: 'Schräg-Liegestütze (Tisch)', hint: 'Hände auf stabilem Tisch oder Bank. Brust zur Kante.' },
    { name: 'Knie-Liegestütze',           hint: 'Auf den Knien, voller Bewegungsumfang. Brust fast zum Boden.' },
    { name: 'Standard-Liegestütze',       hint: 'Gerader Körper, Brust zum Boden. 3 Sek. absenken.' },
    { name: 'Diamond Push-ups',           hint: 'Hände zu einem Dreieck zusammen. Trizeps-Fokus.' },
    { name: 'Erhöhte Liegestütze',        hint: 'Füße auf Stuhl/Sofa. Mehr Last auf Schultern.' },
    { name: 'Archer Push-ups',            hint: 'Gewicht auf einen Arm verlagern, andere Hand stützt nur.' },
    { name: 'One-Arm Push-up',            hint: 'Einarmig, Beine breit zur Stabilität. Königsdisziplin.' }
  ],
  pike: [
    { name: 'Wand-Pike-Push-ups',         hint: 'Pike-Position mit Wand-Unterstützung. Kopf Richtung Wand.' },
    { name: 'Pike Push-ups (Boden)',      hint: 'Hüfte hoch wie umgekehrtes V. Kopf zum Boden absenken.' },
    { name: 'Erhöhte Pike Push-ups',      hint: 'Füße auf Stuhl. Schulter wird stark belastet.' },
    { name: 'Wand-Handstand-Hold',        hint: 'Kopfüber an der Wand, Spannung halten.' },
    { name: 'Handstand Push-ups (Wand)',  hint: 'Vollständige Wiederholungen kopfüber.' }
  ],
  pull: [
    { name: 'Superman Hold',                hint: 'Bauchlage, Arme und Beine heben, oben halten.' },
    { name: 'Tischrudern (steil)',          hint: 'Unter Tisch, Beine angewinkelt. Brust zum Tisch ziehen.' },
    { name: 'Tischrudern (flach)',          hint: 'Beine ausgestreckt – schwerer Hebel.' },
    { name: 'Handtuch-Türrahmen-Rudern',    hint: 'Handtuch um Türrahmen, rückwärts wegziehen.' },
    { name: 'Einarmige Tischrudern',        hint: 'Ein Arm zieht, andere Hand stützt.' },
    { name: 'Negativ-Klimmzüge',            hint: 'Hochspringen, 5 Sek. langsam absenken.' },
    { name: 'Vollständige Klimmzüge',       hint: 'Volle Wiederholungen an Stange/Türzarge.' }
  ],
  squat: [
    { name: 'Stuhl-Kniebeugen',              hint: 'Auf Stuhl absetzen, kontrolliert wieder hochkommen.' },
    { name: 'Standard-Kniebeugen',           hint: 'Hüfte unter Knielinie, Knie nach außen.' },
    { name: 'Tempo-Kniebeugen',              hint: '5 Sek. absenken, 1 Sek. halten, 1 Sek. hoch.' },
    { name: 'Bulgarische Splitkniebeugen',   hint: 'Hinterer Fuß erhöht auf Stuhl. Einbeinig.' },
    { name: 'Unterstützte Pistols',          hint: 'Eine Hand am Türrahmen, einbeinig absenken.' },
    { name: 'Voller Pistol Squat',           hint: 'Einbeinig freistehend, anderes Bein vorgestreckt.' }
  ],
  hinge: [
    { name: 'Glute Bridge (beidbeinig)',     hint: 'Rückenlage, Hüfte hoch, oben halten.' },
    { name: 'Einbeinige Glute Bridge',       hint: 'Ein Bein gestreckt in die Luft.' },
    { name: 'Hip Thrust auf Couch',          hint: 'Schultern auf Sofa, größerer Bewegungsumfang.' },
    { name: 'Sliding Leg Curls',             hint: 'Handtücher unter den Füßen auf glattem Boden.' },
    { name: 'Nordic Curl Eccentrics',        hint: 'Knie auf Polster, Füße fixiert. Langsam nach vorn senken.' },
    { name: 'Voller Nordic Curl',            hint: 'Konzentrisch und exzentrisch ohne Hilfe.' }
  ],
  core: [
    { name: 'Dead Bug',                       hint: 'Auf Rücken, gegensätzliche Arm/Bein-Bewegung. Kontrolliert.' },
    { name: 'Plank Hold',                     hint: 'Spannung, gerade Linie. Gesäß angespannt.', static: true },
    { name: 'Side Plank',                     hint: 'Seitlich, beide Seiten. Hüfte hoch halten.', static: true },
    { name: 'Hollow Body Hold',               hint: 'Auf Rücken, Arme und Beine schweben über Boden.', static: true },
    { name: 'Hanging Knee Raises',            hint: 'An Stange, Knie zur Brust ziehen.' },
    { name: 'L-Sit Progression',              hint: 'Auf zwei Stühlen, Beine waagerecht halten.', static: true }
  ]
};

export const PATTERN_LABELS = {
  push:  'PUSH · HORIZONTAL',
  pike:  'PUSH · VERTIKAL',
  pull:  'PULL · ZIEHEN',
  squat: 'SQUAT · BEINE',
  hinge: 'HINGE · POSTERIOR',
  core:  'CORE · STABILITÄT'
};

export const DAY_TEMPLATES = {
  '3': [
    { key: 'push',  name: 'Push',  focus: 'Brust · Schultern · Trizeps',
      ex: [
        { pattern: 'push',  priority: 'main' },
        { pattern: 'pike',  priority: 'main' },
        { pattern: 'push',  priority: 'secondary' },
        { pattern: 'core',  priority: 'main' }
      ]
    },
    { key: 'pull',  name: 'Pull',  focus: 'Rücken · Bizeps · hintere Schulter',
      ex: [
        { pattern: 'pull',  priority: 'main' },
        { pattern: 'pull',  priority: 'secondary' },
        { pattern: 'pike',  priority: 'secondary' },
        { pattern: 'core',  priority: 'main' }
      ]
    },
    { key: 'legs',  name: 'Legs',  focus: 'Quads · Glutes · Hamstrings · Core',
      ex: [
        { pattern: 'squat', priority: 'main' },
        { pattern: 'hinge', priority: 'main' },
        { pattern: 'squat', priority: 'secondary' },
        { pattern: 'core',  priority: 'main' }
      ]
    }
  ],
  '4': [
    { key: 'upperA', name: 'Upper A', focus: 'Push-Fokus · Brust & Schultern',
      ex: [
        { pattern: 'push',  priority: 'main' },
        { pattern: 'pike',  priority: 'main' },
        { pattern: 'pull',  priority: 'secondary' },
        { pattern: 'core',  priority: 'main' }
      ]
    },
    { key: 'lowerA', name: 'Lower A', focus: 'Quad-Fokus · vordere Kette',
      ex: [
        { pattern: 'squat', priority: 'main' },
        { pattern: 'squat', priority: 'secondary' },
        { pattern: 'hinge', priority: 'secondary' },
        { pattern: 'core',  priority: 'main' }
      ]
    },
    { key: 'upperB', name: 'Upper B', focus: 'Pull-Fokus · Rücken & Bizeps',
      ex: [
        { pattern: 'pull',  priority: 'main' },
        { pattern: 'pull',  priority: 'secondary' },
        { pattern: 'push',  priority: 'secondary' },
        { pattern: 'core',  priority: 'main' }
      ]
    },
    { key: 'lowerB', name: 'Lower B', focus: 'Posterior · Hamstring & Glute',
      ex: [
        { pattern: 'hinge', priority: 'main' },
        { pattern: 'hinge', priority: 'secondary' },
        { pattern: 'squat', priority: 'secondary' },
        { pattern: 'core',  priority: 'main' }
      ]
    }
  ]
};

export const MONTHS_DE = ['Jan.','Feb.','März','Apr.','Mai','Juni','Juli','Aug.','Sept.','Okt.','Nov.','Dez.'];
export const DAYS_DE   = ['Mo','Di','Mi','Do','Fr','Sa','So'];
