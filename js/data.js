const IMG = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const imgs = (slug) => [`${IMG}${slug}/0.jpg`, `${IMG}${slug}/1.jpg`];

export const PROGRESSIONS = {
  push: [
    { name: 'Knie-Liegestütze',           hint: 'Auf den Knien, voller Bewegungsumfang. Brust fast zum Boden. 3 Sek. absenken.',                 images: imgs('Incline_Push-Up') },
    { name: 'Standard-Liegestütze',       hint: 'Gerader Körper, Brust zum Boden. 3 Sek. absenken, 1 Sek. halten.',                              images: imgs('Pushups') },
    { name: 'Diamond Push-ups',           hint: 'Hände zu einem Dreieck. Trizeps-Fokus, Ellbogen nah am Körper.',                                images: imgs('Push-Ups_-_Close_Triceps_Position') },
    { name: 'Erhöhte Liegestütze',        hint: 'Füße auf Stuhl. Mehr Last auf Schultern und obere Brust.',                                       images: imgs('Push-Ups_With_Feet_Elevated') },
    { name: 'Decline Diamond Push-ups',   hint: 'Füße auf Stuhl, Hände unter der Brust zu einem Dreieck. Brust kontrolliert zum Boden, Ellbogen am Körper.', images: [`${IMG}Decline_Push-Up/0.jpg`, `${IMG}Push-Ups_-_Close_Triceps_Position/0.jpg`] },
    { name: 'One-Arm Push-up',            hint: 'Einarmig, Beine schulterbreit. Körper gerade halten, Hüfte nicht drehen.',                      images: imgs('Single-Arm_Push-Up') }
  ],
  pike: [
    { name: 'Pike Push-ups',                      hint: 'Hüfte hoch wie umgekehrtes V. Kopf kontrolliert zum Boden absenken.',                  images: imgs('Handstand_Push-Ups') },
    { name: 'Erhöhte Pike Push-ups (Stuhl)',      hint: 'Füße auf Stuhl, steilerer Winkel. Starker Schulter-Fokus.',                              images: imgs('Handstand_Push-Ups') },
    { name: 'Slow-Neg Erhöhte Pike Push-ups',     hint: 'Erhöht (Füße auf Stuhl). 5 Sek. langsam absenken, dann hochdrücken.',                  images: imgs('Handstand_Push-Ups') },
    { name: 'Archer Pike Push-ups (Erhöht)',      hint: 'Erhöht, Gewicht auf eine Schulter verlagern. Anderer Arm bleibt gestreckt.',           images: imgs('Handstand_Push-Ups') }
  ],
  pull: [
    { name: 'Superman Hold',                hint: 'Bauchlage, Arme und Beine gleichzeitig heben. 2 Sek. oben halten.',                          images: imgs('Superman') },
    { name: 'W-Raises in Bauchlage',        hint: 'Bauchlage, Arme in W-Form (Ellbogen 90°). Schulterblätter kräftig zusammenziehen.',          images: imgs('Superman') },
    { name: 'Reverse Snow Angels',          hint: 'Bauchlage, Arme gestreckt am Körper. Über den Kopf führen und zurück.',                     images: imgs('Superman') },
    { name: 'Stuhl-Rudern',                 hint: 'Rückenlage unter stabilem Stuhlsitz. Stuhl greifen, Brust hochziehen.',                      images: imgs('Inverted_Row') },
    { name: 'Stuhl-Rudern (einarmig)',      hint: 'Stuhl-Rudern mit einem Arm. Andere Hand an der Seite. Beide Seiten.',                        images: imgs('Inverted_Row') }
  ],
  squat: [
    { name: 'Stuhl-Kniebeugen',             hint: 'Kontrolliert auf Stuhl absetzen, sofort wieder hochkommen. Knie nach außen.',               images: imgs('Sit_Squats') },
    { name: 'Standard-Kniebeugen',          hint: 'Hüfte unter Knielinie. Knie nach außen, Fersen bleiben auf dem Boden.',                     images: imgs('Bodyweight_Squat') },
    { name: 'Tempo-Kniebeugen',             hint: '5 Sek. absenken, 2 Sek. halten, explosive 1 Sek. hochkommen.',                              images: imgs('Bodyweight_Squat') },
    { name: 'Bulgarische Splitkniebeugen',  hint: 'Hinterer Fuß auf Stuhl. Vorderes Knie zeigt nach außen. Einbeinig.',                        images: imgs('Split_Squats') },
    { name: 'Pistol Squat Negativ',         hint: 'Einbeinig langsam absenken (5 Sek.), mit beiden Beinen hochdrücken.',                       images: imgs('Kettlebell_Pistol_Squat') },
    { name: 'Voller Pistol Squat',          hint: 'Einbeinig freistehend, anderes Bein waagerecht. Beide Seiten.',                              images: imgs('Kettlebell_Pistol_Squat') }
  ],
  hinge: [
    { name: 'Glute Bridge (beidbeinig)',          hint: 'Rückenlage, Füße hüftbreit. Hüfte explosiv hochdrücken, 2 Sek. oben halten.',         images: imgs('Butt_Lift_Bridge') },
    { name: 'Einbeinige Glute Bridge',            hint: 'Ein Bein gestreckt in die Luft. Hüfte gerade halten. Beide Seiten.',                  images: imgs('Single_Leg_Glute_Bridge') },
    { name: 'Hip Thrust (Schultern auf Stuhl)',   hint: 'Schulterblätter auf Stuhlkante. Hüfte tief absenken, dann explosiv hochdrücken.',     images: imgs('Butt_Lift_Bridge') },
    { name: 'Single-Leg Hip Thrust (Stuhl)',      hint: 'Hip Thrust auf Stuhl, ein Bein angehoben und gestreckt. Hüfte gerade halten.',         images: imgs('Single_Leg_Glute_Bridge') },
    { name: 'Donkey Kicks mit Pause',             hint: 'Auf allen Vieren, Bein nach hinten-oben strecken. 2 Sek. oben halten. Beide Seiten.', images: imgs('Glute_Kickback') },
    { name: 'Reverse Hyperextension (Stuhl)',     hint: 'Oberkörper auf Stuhlsitz, Hüfte an der Kante, Beine hängen. Gestreckt heben und halten.', images: imgs('Hyperextensions_With_No_Hyperextension_Bench') }
  ],
  core: [
    { name: 'Dead Bug',                           hint: 'Auf Rücken, gegenüberliegende Arm/Bein-Paare absenken. Lendenwirbel bleibt unten.',  images: imgs('Dead_Bug') },
    { name: 'Plank Hold',                         hint: 'Unterarme oder Hände, gerade Linie vom Kopf bis zu den Fersen.',                       images: imgs('Plank'),       static: true },
    { name: 'Side Plank',                         hint: 'Seitlich auf Unterarm. Hüfte hoch, gerade Linie halten. Beide Seiten.',                images: imgs('Side_Bridge'),  static: true },
    { name: 'Hollow Body Hold',                   hint: 'Auf Rücken, Arme über Kopf, Beine 20 cm vom Boden – alles schwebt.',                  images: imgs('Plank'),       static: true },
    { name: 'Tuck L-Sit (zwei Stühle)',           hint: 'Hände auf zwei Stuhlkanten neben dir. Knie zur Brust heben und halten.',              images: imgs('Hanging_Pike'), static: true },
    { name: 'L-Sit (zwei Stühle)',                hint: 'Hände auf zwei Stuhlkanten. Beine gestreckt waagerecht halten.',                       images: imgs('Hanging_Pike'), static: true }
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
