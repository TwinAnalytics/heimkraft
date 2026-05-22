export const PROGRESSIONS = {
  push: [
    { name: 'Knie-Liegestütze',           hint: 'Auf den Knien, voller Bewegungsumfang. Brust fast zum Boden. 3 Sek. absenken.' },
    { name: 'Standard-Liegestütze',       hint: 'Gerader Körper, Brust zum Boden. 3 Sek. absenken, 1 Sek. halten.' },
    { name: 'Diamond Push-ups',           hint: 'Hände zu einem Dreieck. Trizeps-Fokus, Ellbogen nah am Körper.' },
    { name: 'Erhöhte Liegestütze',        hint: 'Füße auf Stuhl. Mehr Last auf Schultern und obere Brust.' },
    { name: 'Archer Push-ups',            hint: 'Arme weit auseinander, Gewicht auf einen Arm verlagern. Abwechselnd.' },
    { name: 'One-Arm Push-up',            hint: 'Einarmig, Beine schulterbreit. Körper gerade halten, Hüfte nicht drehen.' }
  ],
  pike: [
    { name: 'Pike Push-ups',                      hint: 'Hüfte hoch wie umgekehrtes V. Kopf kontrolliert zum Boden absenken.' },
    { name: 'Erhöhte Pike Push-ups (Stuhl)',       hint: 'Füße auf Stuhl, steilerer Winkel. Starker Schulter-Fokus.' },
    { name: 'Slow-Neg Erhöhte Pike Push-ups',      hint: 'Erhöht (Füße auf Stuhl). 5 Sek. langsam absenken, dann hochdrücken.' },
    { name: 'Archer Pike Push-ups (Erhöht)',       hint: 'Erhöht, Gewicht auf eine Schulter verlagern. Anderer Arm bleibt gestreckt.' }
  ],
  pull: [
    { name: 'Superman Hold',                hint: 'Bauchlage, Arme und Beine gleichzeitig heben. 2 Sek. oben halten.' },
    { name: 'W-Raises in Bauchlage',        hint: 'Bauchlage, Arme in W-Form (Ellbogen 90°). Schulterblätter kräftig zusammenziehen.' },
    { name: 'Reverse Snow Angels',          hint: 'Bauchlage, Arme gestreckt am Körper. Über den Kopf führen und zurück.' },
    { name: 'Stuhl-Rudern',                hint: 'Rückenlage unter stabilem Stuhlsitz. Stuhl greifen, Brust hochziehen.' },
    { name: 'Stuhl-Rudern (einarmig)',      hint: 'Stuhl-Rudern mit einem Arm. Andere Hand an der Seite. Beide Seiten.' }
  ],
  squat: [
    { name: 'Stuhl-Kniebeugen',             hint: 'Kontrolliert auf Stuhl absetzen, sofort wieder hochkommen. Knie nach außen.' },
    { name: 'Standard-Kniebeugen',          hint: 'Hüfte unter Knielinie. Knie nach außen, Fersen bleiben auf dem Boden.' },
    { name: 'Tempo-Kniebeugen',             hint: '5 Sek. absenken, 2 Sek. halten, explosive 1 Sek. hochkommen.' },
    { name: 'Bulgarische Splitkniebeugen',  hint: 'Hinterer Fuß auf Stuhl. Vorderes Knie zeigt nach außen. Einbeinig.' },
    { name: 'Pistol Squat Negativ',         hint: 'Einbeinig langsam absenken (5 Sek.), mit beiden Beinen hochdrücken.' },
    { name: 'Voller Pistol Squat',          hint: 'Einbeinig freistehend, anderes Bein waagerecht. Beide Seiten.' }
  ],
  hinge: [
    { name: 'Glute Bridge (beidbeinig)',          hint: 'Rückenlage, Füße hüftbreit. Hüfte explosiv hochdrücken, 2 Sek. oben halten.' },
    { name: 'Einbeinige Glute Bridge',            hint: 'Ein Bein gestreckt in die Luft. Hüfte gerade halten. Beide Seiten.' },
    { name: 'Hip Thrust (Schultern auf Stuhl)',   hint: 'Schulterblätter auf Stuhlkante. Hüfte tief absenken, dann explosiv hochdrücken.' },
    { name: 'Single-Leg Hip Thrust (Stuhl)',      hint: 'Hip Thrust auf Stuhl, ein Bein angehoben und gestreckt. Hüfte gerade halten.' },
    { name: 'Donkey Kicks mit Pause',             hint: 'Auf allen Vieren, Bein nach hinten-oben strecken. 2 Sek. oben halten. Beide Seiten.' },
    { name: 'Reverse Hyperextension (Stuhl)',     hint: 'Oberkörper auf Stuhlsitz, Hüfte an der Kante, Beine hängen. Gestreckt heben und halten.' }
  ],
  core: [
    { name: 'Dead Bug',                           hint: 'Auf Rücken, gegenüberliegende Arm/Bein-Paare absenken. Lendenwirbel bleibt unten.' },
    { name: 'Plank Hold',                         hint: 'Unterarme oder Hände, gerade Linie vom Kopf bis zu den Fersen.', static: true },
    { name: 'Side Plank',                         hint: 'Seitlich auf Unterarm. Hüfte hoch, gerade Linie halten. Beide Seiten.', static: true },
    { name: 'Hollow Body Hold',                   hint: 'Auf Rücken, Arme über Kopf, Beine 20 cm vom Boden – alles schwebt.', static: true },
    { name: 'Tuck L-Sit (zwei Stühle)',           hint: 'Hände auf zwei Stuhlkanten neben dir. Knie zur Brust heben und halten.', static: true },
    { name: 'L-Sit (zwei Stühle)',                hint: 'Hände auf zwei Stuhlkanten. Beine gestreckt waagerecht halten.', static: true }
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
