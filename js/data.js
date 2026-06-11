const IMG = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const imgs = (slug) => [`${IMG}${slug}/0.jpg`, `${IMG}${slug}/1.jpg`];

export const PROGRESSIONS = {
  push: [
    { name: 'Knie-Liegestütze',           hint: 'Auf den Knien, voller Bewegungsumfang. Brust fast zum Boden. 3 Sek. absenken.',                 images: imgs('Incline_Push-Up') },
    { name: 'Standard-Liegestütze',       hint: 'Gerader Körper, Brust zum Boden. 3 Sek. absenken, 1 Sek. halten.',                              images: imgs('Pushups') },
    { name: 'Diamond Push-ups',           hint: 'Hände zu einem Dreieck. Trizeps-Fokus, Ellbogen nah am Körper.',                                images: imgs('Push-Ups_-_Close_Triceps_Position') },
    { name: 'Erhöhte Liegestütze',        hint: 'Füße auf Stuhl. Mehr Last auf Schultern und obere Brust.',                                       images: imgs('Push-Ups_With_Feet_Elevated') },
    { name: 'Decline Diamond Push-ups',   hint: 'Füße auf Stuhl, Hände unter der Brust zu einem Dreieck. Brust kontrolliert zum Boden, Ellbogen am Körper.', images: [`${IMG}Decline_Push-Up/0.jpg`, `${IMG}Push-Ups_-_Close_Triceps_Position/0.jpg`] },
    { name: 'One-Arm Push-up',            hint: 'Einarmig, Beine schulterbreit. Körper gerade halten, Hüfte nicht drehen. Beide Seiten.',       images: imgs('Single-Arm_Push-Up'),                  unilateral: true }
  ],
  pike: [
    { name: 'Pike Push-ups',                      hint: 'Hüfte hoch wie umgekehrtes V. Kopf kontrolliert zum Boden absenken. (Bild zeigt die schwerere Wand-Variante – gleiche Bewegung, Hüfte hoch.)', images: imgs('Handstand_Push-Ups') },
    { name: 'Erhöhte Pike Push-ups (Stuhl)',      hint: 'Füße auf Stuhl, steilerer Winkel. Starker Schulter-Fokus.',                              images: imgs('Handstand_Push-Ups') },
    { name: 'Slow-Neg Erhöhte Pike Push-ups',     hint: 'Erhöht (Füße auf Stuhl). 5 Sek. langsam absenken, dann hochdrücken.',                  images: imgs('Handstand_Push-Ups') },
    { name: 'Pseudo Planche Push-ups',            hint: 'Hände auf Hüfthöhe (nicht unter den Schultern), Finger zeigen nach außen. Oberkörper weit nach vorne lehnen, so dass die Schultern über den Händen liegen. Brust langsam absenken.', images: imgs('Pushups') }
  ],
  pull: [
    { name: 'Superman Hold',                hint: 'Bauchlage, Arme und Beine gleichzeitig heben. 2 Sek. oben halten.',                          images: imgs('Superman') },
    { name: 'W-Raises in Bauchlage',        hint: 'Bauchlage, Arme in W-Form (Ellbogen 90°). Schulterblätter kräftig zusammenziehen.',          images: imgs('Superman') },
    { name: 'Reverse Snow Angels',          hint: 'Bauchlage, Arme gestreckt am Körper. Über den Kopf führen und zurück.',                     images: imgs('Superman') },
    { name: 'Tisch-Rudern',                 hint: 'Rückenlage unter einem stabilen Esstisch. Tischkante schulterbreit greifen, Körper gestreckt, Brust zur Kante ziehen. Je flacher der Körper, desto schwerer.', images: imgs('Inverted_Row') },
    { name: 'Stuhl-Rudern',                 hint: 'Rückenlage unter stabilem Stuhlsitz. Stuhl greifen, Brust hochziehen.',                      images: imgs('Inverted_Row') },
    { name: 'Stuhl-Rudern (einarmig)',      hint: 'Stuhl-Rudern mit einem Arm. Andere Hand an der Seite. Beide Seiten.',                        images: imgs('Inverted_Row'),                        unilateral: true }
  ],
  squat: [
    { name: 'Stuhl-Kniebeugen',             hint: 'Kontrolliert auf Stuhl absetzen, sofort wieder hochkommen. Knie nach außen.',               images: imgs('Sit_Squats') },
    { name: 'Standard-Kniebeugen',          hint: 'Hüfte unter Knielinie. Knie nach außen, Fersen bleiben auf dem Boden.',                     images: imgs('Bodyweight_Squat') },
    { name: 'Tempo-Kniebeugen',             hint: '5 Sek. absenken, 2 Sek. halten, explosive 1 Sek. hochkommen.',                              images: imgs('Bodyweight_Squat') },
    { name: 'Bulgarische Splitkniebeugen',  hint: 'Hinterer Fuß auf Stuhl. Vorderes Knie zeigt nach außen. Einbeinig, beide Seiten.',           images: imgs('Split_Squats'),             unilateral: true },
    { name: 'Pistol Squat Negativ',         hint: 'Einbeinig langsam absenken (5 Sek.), mit beiden Beinen hochdrücken. Beide Seiten. Arme nach vorne als Gegengewicht – ohne Zusatzgewicht.', images: imgs('Kettlebell_Pistol_Squat'),  unilateral: true },
    { name: 'Voller Pistol Squat',          hint: 'Einbeinig freistehend, anderes Bein waagerecht. Beide Seiten. Arme nach vorne als Gegengewicht – ohne Zusatzgewicht.', images: imgs('Kettlebell_Pistol_Squat'),  unilateral: true }
  ],
  hinge: [
    { name: 'Glute Bridge (beidbeinig)',          hint: 'Rückenlage, Füße hüftbreit. Hüfte explosiv hochdrücken, 2 Sek. oben halten.',         images: imgs('Butt_Lift_Bridge') },
    { name: 'Einbeinige Glute Bridge',            hint: 'Ein Bein gestreckt in die Luft. Hüfte gerade halten. Beide Seiten.',                  images: imgs('Single_Leg_Glute_Bridge'),                       unilateral: true },
    { name: 'Hip Thrust (Schultern auf Stuhl)',   hint: 'Schulterblätter auf Stuhlkante. Hüfte tief absenken, dann explosiv hochdrücken.',     images: imgs('Butt_Lift_Bridge') },
    { name: 'Single-Leg Hip Thrust (Stuhl)',      hint: 'Hip Thrust auf Stuhl, ein Bein angehoben und gestreckt. Hüfte gerade halten. Beide Seiten.', images: imgs('Single_Leg_Glute_Bridge'),                 unilateral: true },
    { name: 'Sliding Leg Curls (Handtuch)',       hint: 'Rückenlage, Fersen auf Handtuch (glatter Boden) oder Socken. Hüfte heben, Fersen langsam wegschieben und wieder heranziehen. Hüfte bleibt oben – Hamstring-Fokus.', images: imgs('Butt_Lift_Bridge') },
    { name: 'Nordic Negativ (Sofa)',              hint: 'Kniend, Füße unter Sofa/Bett geklemmt. Körper gestreckt so langsam wie möglich nach vorne absenken (5+ Sek.), mit den Händen abfangen, zurückdrücken.', images: imgs('Natural_Glute_Ham_Raise') }
  ],
  calf: [
    { name: 'Wadenheben (beidbeinig)',            hint: 'Fußballen auf Treppenstufe oder Buch, Fersen tief absenken, dann maximal hochdrücken. 2 Sek. oben halten, 3 Sek. absenken.', images: imgs('Calf_Raise_On_A_Dumbbell') },
    { name: 'Wadenheben (einbeinig)',             hint: 'Einbeinig auf Stufe/Buch. Voller Bewegungsumfang, Ferse tief unter die Kante. Beide Seiten.', images: imgs('Calf_Raise_On_A_Dumbbell'), unilateral: true },
    { name: 'Wadenheben einbeinig (Tempo)',       hint: 'Einbeinig, 3 Sek. hoch, 2 Sek. halten, 3 Sek. tief. Ohne Festhalten für extra Balance-Reiz. Beide Seiten.', images: imgs('Calf_Raise_On_A_Dumbbell'), unilateral: true }
  ],
  core: [
    { name: 'Dead Bug',                           hint: 'Auf Rücken, gegenüberliegende Arm/Bein-Paare absenken. Lendenwirbel bleibt unten.',  images: imgs('Dead_Bug') },
    { name: 'Plank Hold',                         hint: 'Unterarme oder Hände, gerade Linie vom Kopf bis zu den Fersen.',                       images: imgs('Plank'),       static: true },
    { name: 'Side Plank',                         hint: 'Seitlich auf Unterarm. Hüfte hoch, gerade Linie halten. Beide Seiten.',                images: imgs('Side_Bridge'),  static: true, unilateral: true },
    { name: 'Hollow Body Hold',                   hint: 'Auf Rücken, Arme über Kopf, Beine 20 cm vom Boden – alles schwebt.',                  images: imgs('Flutter_Kicks'), static: true },
    { name: 'Tuck L-Sit (zwei Stühle)',           hint: 'Hände auf zwei Stuhlkanten neben dir. Knie zur Brust heben und halten.',              images: imgs('Seated_Leg_Tucks'), static: true },
    { name: 'L-Sit (zwei Stühle)',                hint: 'Hände auf zwei Stuhlkanten. Beine gestreckt waagerecht halten.',                       images: imgs('Seated_Leg_Tucks'), static: true }
  ]
};

export const PATTERN_LABELS = {
  push:  'PUSH · HORIZONTAL',
  pike:  'PUSH · VERTIKAL',
  pull:  'PULL · ZIEHEN',
  squat: 'SQUAT · BEINE',
  hinge: 'HINGE · POSTERIOR',
  calf:  'CALVES · WADEN',
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
    { key: 'legs',  name: 'Legs',  focus: 'Quads · Glutes · Hamstrings · Waden',
      ex: [
        { pattern: 'squat', priority: 'main' },
        { pattern: 'hinge', priority: 'main' },
        { pattern: 'squat', priority: 'secondary' },
        { pattern: 'calf',  priority: 'main' },
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
    { key: 'lowerB', name: 'Lower B', focus: 'Posterior · Hamstring & Glute & Waden',
      ex: [
        { pattern: 'hinge', priority: 'main' },
        { pattern: 'hinge', priority: 'secondary' },
        { pattern: 'squat', priority: 'secondary' },
        { pattern: 'calf',  priority: 'main' },
        { pattern: 'core',  priority: 'main' }
      ]
    }
  ],
  'fullbody': [
    { key: 'fbA', name: 'Ganzkörper A', focus: 'Push · Pull · Quads',
      ex: [
        { pattern: 'push',  priority: 'main' },
        { pattern: 'pull',  priority: 'main' },
        { pattern: 'squat', priority: 'main' },
        { pattern: 'core',  priority: 'main' }
      ]
    },
    { key: 'fbB', name: 'Ganzkörper B', focus: 'Schultern · Posterior · Rücken',
      ex: [
        { pattern: 'pike',  priority: 'main' },
        { pattern: 'hinge', priority: 'main' },
        { pattern: 'pull',  priority: 'secondary' },
        { pattern: 'core',  priority: 'main' }
      ]
    },
    { key: 'fbC', name: 'Ganzkörper C', focus: 'Rücken · Brust · Beine · Waden',
      ex: [
        { pattern: 'pull',  priority: 'main' },
        { pattern: 'push',  priority: 'secondary' },
        { pattern: 'squat', priority: 'secondary' },
        { pattern: 'calf',  priority: 'main' },
        { pattern: 'core',  priority: 'main' }
      ]
    }
  ]
};

export const WARMUP = [
  { name: 'Hampelmänner',              seconds: 45, hint: 'Gleichmäßiges Tempo, Arme komplett nach oben, Beine schulterbreit auseinander. Locker atmen.' },
  { name: 'Armkreisen',                seconds: 45, hint: 'Erst klein vorwärts, dann größer werden. Bei der Hälfte umdrehen und rückwärts kreisen. Schultern bewusst mitbewegen.' },
  { name: 'Hüftkreisen & Beinpendel',  seconds: 45, hint: 'Erst Hüfte 15 Sek. in beide Richtungen kreisen. Danach Bein vorne/hinten pendeln lassen, locker — 15 Sek. pro Seite.' },
  { name: 'Inchworms',                 seconds: 50, hint: 'Aus dem Stand mit gestreckten Beinen vorbeugen, mit den Händen nach vorne bis in die Plank-Position wandern. Kurz halten, mit den Füßen nachholen.' },
  { name: 'Cat-Cow & T-Spine',         seconds: 45, hint: 'Vierfüßlerstand: 4× Rücken rund und durchhängen. Dann eine Hand zur Decke öffnen, Brustwirbelsäule rotieren — je 4× pro Seite.' }
];

export const MONTHS_DE = ['Jan.','Feb.','März','Apr.','Mai','Juni','Juli','Aug.','Sept.','Okt.','Nov.','Dez.'];
export const DAYS_DE   = ['Mo','Di','Mi','Do','Fr','Sa','So'];
