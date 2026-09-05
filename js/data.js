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
    { name: 'Pike Push-ups',                      hint: 'Hüfte hoch wie umgekehrtes V, Hände und Füße auf dem Boden. Kopf kontrolliert Richtung Boden absenken. (Bild zeigt eine schwerere Variante – die Bewegung ist dieselbe.)', images: imgs('Handstand_Push-Ups') },
    { name: 'Erhöhte Pike Push-ups (Stuhl)',      hint: 'Füße auf Stuhl, steilerer Winkel. Starker Schulter-Fokus.',                              images: imgs('Handstand_Push-Ups') },
    { name: 'Slow-Neg Erhöhte Pike Push-ups',     hint: 'Erhöht (Füße auf Stuhl). 5 Sek. langsam absenken, dann hochdrücken.',                  images: imgs('Handstand_Push-Ups') },
    { name: 'Pseudo Planche Push-ups',            hint: 'Hände auf Hüfthöhe (nicht unter den Schultern), Finger zeigen nach außen. Oberkörper weit nach vorne lehnen, so dass die Schultern über den Händen liegen. Brust langsam absenken.', images: imgs('Pushups') }
  ],
  pull: [
    { name: 'Superman Hold',                hint: 'Bauchlage, Arme und Beine gleichzeitig heben. 2 Sek. oben halten.',                          images: imgs('Superman') },
    { name: 'W-Raises in Bauchlage',        hint: 'Bauchlage, Arme in W-Form (Ellbogen 90°). Schulterblätter kräftig zusammenziehen.',          images: imgs('Superman') },
    { name: 'Reverse Snow Angels',          hint: 'Bauchlage, Arme gestreckt am Körper. Über den Kopf führen und zurück.',                     images: imgs('Superman') },
    { name: 'Swimmers (Bauchlage)',         hint: 'Bauchlage, Brust und Arme bleiben durchgehend in der Luft. Arme gestreckt von vorne über die Seite bis zur Hüfte führen und zurück. 2 Sek. Pause vorne und hinten.', images: imgs('Superman') },
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
    { name: 'Sliding Leg Curls (beidbeinig)',     hint: 'Rückenlage neben der Matte, Fersen auf Socken oder Handtuch (glatter Boden). Hüfte heben, Fersen langsam wegschieben und wieder heranziehen. Hüfte bleibt oben – Hamstring-Fokus.', images: imgs('Butt_Lift_Bridge') },
    { name: 'Sliding Leg Curls (einbeinig)',      hint: 'Wie beidbeinig, aber nur eine Ferse gleitet – das andere Bein bleibt angewinkelt in der Luft. Hüfte oben halten. Beide Seiten.', images: imgs('Single_Leg_Glute_Bridge'), unilateral: true }
  ],
  calf: [
    { name: 'Wadenheben (beidbeinig)',            hint: 'Fußballen auf der Mattenkante, flacher Stand geht auch. Maximal hochdrücken, 2 Sek. oben halten, 3 Sek. absenken.', images: imgs('Calf_Raise_On_A_Dumbbell') },
    { name: 'Wadenheben (einbeinig)',             hint: 'Einbeinig, Fußballen auf der Mattenkante. Voller Bewegungsumfang, kontrolliert. Beide Seiten.', images: imgs('Calf_Raise_On_A_Dumbbell'), unilateral: true },
    { name: 'Wadenheben einbeinig (Tempo)',       hint: 'Einbeinig, 3 Sek. hoch, 2 Sek. halten, 3 Sek. tief. Ohne Festhalten für extra Balance-Reiz. Beide Seiten.', images: imgs('Calf_Raise_On_A_Dumbbell'), unilateral: true }
  ],
  core: [
    { name: 'Dead Bug',                           hint: 'Auf Rücken, gegenüberliegende Arm/Bein-Paare absenken. Lendenwirbel bleibt unten.',  images: imgs('Dead_Bug') },
    { name: 'Plank Hold',                         hint: 'Unterarme oder Hände, gerade Linie vom Kopf bis zu den Fersen.',                       images: imgs('Plank'),       static: true },
    { name: 'Side Plank',                         hint: 'Seitlich auf Unterarm. Hüfte hoch, gerade Linie halten. Beide Seiten.',                images: imgs('Side_Bridge'),  static: true, unilateral: true },
    { name: 'Hollow Body Hold',                   hint: 'Auf Rücken, Arme über Kopf, Beine 20 cm vom Boden – alles schwebt.',                  images: imgs('Flutter_Kicks'), static: true },
    { name: 'Tuck L-Sit (zwei Stühle)',           hint: 'Hände auf zwei Stuhlkanten neben dir. Knie zur Brust heben und halten.',              images: imgs('Seated_Leg_Tucks'), static: true },
    { name: 'L-Sit (zwei Stühle)',                hint: 'Hände auf zwei Stuhlkanten. Beine gestreckt waagerecht halten.',                       images: imgs('Seated_Leg_Tucks'), static: true }
  ],
  // Oberer Rücken & hintere Schulter ohne Hantel
  rear: [
    { name: 'Reverse Snow Angels',                hint: 'Bauchlage, Arme gestreckt am Körper. Handrücken zeigen nach oben, Arme flach über den Kopf führen und zurück — durchgehend leicht vom Boden abgehoben.', images: imgs('Superman') },
    { name: 'W-Raises in Bauchlage',              hint: 'Bauchlage, Arme in W-Form (Ellbogen 90°). Schulterblätter kräftig zusammenziehen, Arme abheben.', images: imgs('Superman') },
    { name: 'Superman Hold',                      hint: 'Bauchlage, Arme und Beine gleichzeitig heben und 2 Sek. oben halten.', images: imgs('Superman') }
  ],
  crunch: [
    { name: 'Crunch',                             hint: 'Rückenlage, Beine angestellt, Hände an den Schläfen. Oberkörper einrollen, unterer Rücken bleibt am Boden. Oben kurz anspannen.', images: imgs('Crunches') },
    { name: 'Cross-Body Crunch',                  hint: 'Wie der Crunch, aber den Ellbogen diagonal zum gegenüberliegenden Knie führen. Trifft die seitliche Bauchmuskulatur. Beide Seiten.', images: imgs('Cross-Body_Crunch') }
  ]
};

// Hantel-Progressionen. Anders als beim Körpergewicht steigerst du hier primär
// über das Gewicht (Doppelprogression), nicht über härtere Varianten — deshalb
// sind diese Leitern kurz. Push und Core bleiben bewusst Körpergewicht:
// die Liegestütz-Leiter trägt weiter und Planks brauchen keine Hanteln.
export const PROGRESSIONS_DB = {
  // Brust: kein Schwierigkeits-Aufbau, sondern ein Variations-Pool. Mit Hanteln
  // steigert das Gewicht (Doppelprogression), deshalb wechselt die App hier
  // wochenweise durch verschiedene Reize — Druck, Flys, Dehnung, innere Brust.
  push: [
    { name: 'Kurzhantel Floor Press',         hint: 'Rückenlage auf der Matte, Hanteln über der Brust. Absenken bis die Oberarme den Boden berühren, kurz halten, dann kraftvoll hoch. Die beste Brustübung ohne Bank.', images: imgs('Dumbbell_Floor_Press'), weighted: true, startKg: 10 },
    { name: 'Kurzhantel Flys (am Boden)',     hint: 'Rückenlage, Arme leicht gebeugt über der Brust. Hanteln in weitem Bogen zur Seite absenken, bis die Oberarme den Boden berühren, dann wie eine Umarmung zusammenführen. Der Boden begrenzt die Tiefe und schützt die Schulter — bewusst leicht starten.', images: imgs('Dumbbell_Flyes'), weighted: true, startKg: 6 },
    { name: 'Überzug (Pullover)',             hint: 'Rückenlage, eine Hantel beidhändig über der Brust. Mit fast gestreckten Armen hinter den Kopf absenken bis du die Dehnung in Brust und Flanken spürst, dann zurückziehen. Öffnet den Brustkorb.', images: imgs('Straight-Arm_Dumbbell_Pullover'), weighted: true, startKg: 10, oneDb: true },
    { name: 'Enges Floor Press',              hint: 'Floor Press mit engem Griff, Ellbogen dicht am Körper. Verlagert die Arbeit auf Trizeps und innere Brust.', images: imgs('Close-Grip_Dumbbell_Press'), weighted: true, startKg: 8 },
    { name: 'Squeeze Press',                  hint: 'Zwei Hanteln über der Brust fest aneinanderdrücken und so — gegeneinander pressend — absenken und hochdrücken. Der Druck nach innen aktiviert die innere Brust maximal.', images: imgs('Isometric_Chest_Squeezes'), weighted: true, startKg: 8 },
    { name: 'Einarmiges Floor Press',         hint: 'Nur eine Hantel, die freie Hand liegt am Boden. Der Rumpf muss gegen die Drehung arbeiten. Beide Seiten.', images: imgs('Dumbbell_Floor_Press'), weighted: true, startKg: 10, unilateral: true, oneDb: true }
  ],
  biceps: [
    { name: 'Bizeps-Curls',                   hint: 'Ellbogen bleiben am Körper fixiert. Zügig hoch, drei Sekunden kontrolliert ab — das Absenken bringt den Reiz. Kein Schwung aus der Hüfte.', images: imgs('Dumbbell_Bicep_Curl'), weighted: true, startKg: 8 },
    { name: 'Hammer-Curls',                   hint: 'Handflächen zeigen zueinander (Daumen oben). Trifft zusätzlich den Unterarm und lässt den Arm breiter wirken.', images: imgs('Hammer_Curls'), weighted: true, startKg: 8 },
    { name: 'Konzentrations-Curls',           hint: 'Sitzend, Ellbogen an der Innenseite des Oberschenkels abstützen. Maximale Isolation, oben kurz anspannen. Beide Seiten.', images: imgs('Concentration_Curls'), weighted: true, startKg: 6, unilateral: true, oneDb: true },
    { name: 'Stuhl-Rudern (Untergriff)',      hint: 'Rückenlage unter dem Stuhl, Handflächen zeigen zu dir. Der enge Untergriff holt den Bizeps stark mit rein. Ohne Hanteln die beste Bizepsübung.', images: imgs('Inverted_Row') }
  ],
  triceps: [
    { name: 'Trizeps-Strecken über Kopf',     hint: 'Eine Hantel beidhändig hinter dem Kopf, Ellbogen zeigen nach vorne und bleiben eng. Streckt den langen Trizepskopf — der macht die Armrückseite dick.', images: imgs('Standing_Dumbbell_Triceps_Extension'), weighted: true, startKg: 8, oneDb: true },
    { name: 'Trizeps-Kickbacks',              hint: 'Vorgebeugt, Oberarm parallel zum Körper fixiert. Nur der Unterarm bewegt sich, oben zwei Sekunden anspannen. Beide Seiten.', images: imgs('Tricep_Dumbbell_Kickback'), weighted: true, startKg: 5, unilateral: true, oneDb: true },
    { name: 'Dips am Stuhl',                  hint: 'Hände auf der Stuhlkante hinter dir, Füße nach vorne. Körper absenken bis die Ellbogen 90° erreichen, dann hochdrücken.', images: imgs('Bench_Dips') }
  ],
  pike: [
    { name: 'Schulterdrücken (sitzend)',      hint: 'Auf dem Stuhl sitzend, Rücken gerade. Hanteln von Schulterhöhe über den Kopf drücken, Ellbogen leicht vor dem Körper. 3 Sek. absenken.', images: imgs('Seated_Dumbbell_Press'),  weighted: true, startKg: 8 },
    { name: 'Schulterdrücken (stehend)',      hint: 'Im Stand, Bauch fest, Rippen unten – kein Hohlkreuz. Ganzkörperspannung macht die Übung schwerer als sitzend.', images: imgs('Standing_Dumbbell_Press'), weighted: true, startKg: 8 },
    { name: 'Arnold Press',                   hint: 'Start mit Handflächen zum Körper, beim Drücken nach außen drehen. Volle Rotation für die gesamte Schulter.', images: imgs('Arnold_Dumbbell_Press'),  weighted: true, startKg: 6 }
  ],
  pull: [
    { name: 'Einarmiges Kurzhantel-Rudern',   hint: 'Eine Hand und ein Knie auf dem Stuhl, Rücken flach wie ein Tisch. Hantel eng am Körper zur Hüfte ziehen, Schulterblatt zuletzt. Beide Seiten.', images: imgs('One-Arm_Dumbbell_Row'),      weighted: true, startKg: 12, unilateral: true, oneDb: true },
    { name: 'Vorgebeugtes Rudern (beidarmig)',hint: 'Hüfte nach hinten, Oberkörper ca. 45°, Rücken gerade. Beide Hanteln gleichzeitig zur Hüfte ziehen.', images: imgs('Bent_Over_Two-Dumbbell_Row'), weighted: true, startKg: 10 },
    { name: 'Rudern mit Pause',               hint: 'Vorgebeugtes Rudern, oben 2 Sek. halten und Schulterblätter maximal zusammenziehen, dann 3 Sek. absenken.', images: imgs('Bent_Over_Two-Dumbbell_Row'), weighted: true, startKg: 10 }
  ],
  squat: [
    { name: 'Goblet Squat',                   hint: 'Eine Hantel senkrecht vor der Brust halten, Ellbogen nach unten. Tief in die Hocke, Brust bleibt aufrecht.', images: imgs('Goblet_Squat'),               weighted: true, startKg: 14, oneDb: true },
    { name: 'Ausfallschritte mit Hanteln',    hint: 'Hanteln seitlich hängen lassen. Großer Schritt nach vorne, hinteres Knie fast zum Boden. Beide Seiten.', images: imgs('Dumbbell_Lunges'),            weighted: true, startKg: 8, unilateral: true },
    { name: 'Bulgarische Splitkniebeuge',     hint: 'Hinterer Fuß auf dem Stuhl, Hanteln seitlich. Vorderes Bein macht die Arbeit. Beide Seiten.', images: imgs('Split_Squat_with_Dumbbells'), weighted: true, startKg: 8, unilateral: true }
  ],
  hinge: [
    { name: 'Rumänisches Kreuzheben',         hint: 'Knie leicht gebeugt und fixiert. Hüfte weit nach hinten schieben, Hanteln dicht am Bein entlang. Nur so tief, wie der Rücken gerade bleibt.', images: imgs('Stiff-Legged_Dumbbell_Deadlift'), weighted: true, startKg: 12 },
    { name: 'RDL mit Pause',                  hint: 'Rumänisches Kreuzheben, unten 2 Sek. in der Dehnung halten. Maximaler Hamstring-Reiz.', images: imgs('Stiff-Legged_Dumbbell_Deadlift'), weighted: true, startKg: 12 },
    { name: 'Einbeiniges RDL',                hint: 'Auf einem Bein, anderes streckt nach hinten. Hantel in der Gegenhand. Hüfte gerade halten, nicht öffnen. Beide Seiten.', images: imgs('Stiff-Legged_Dumbbell_Deadlift'), weighted: true, startKg: 8, unilateral: true, oneDb: true }
  ],
  calf: [
    { name: 'Wadenheben mit Hanteln',         hint: 'Hanteln seitlich, Fußballen auf der Mattenkante. Maximal hoch, 2 Sek. halten, 3 Sek. tief absenken.', images: imgs('Standing_Dumbbell_Calf_Raise'), weighted: true, startKg: 12 },
    { name: 'Einbeiniges Wadenheben',         hint: 'Eine Hantel in der Hand, einbeinig. Volle Streckung oben. Beide Seiten.', images: imgs('Standing_Dumbbell_Calf_Raise'), weighted: true, startKg: 10, unilateral: true, oneDb: true }
  ],
  // Oberer Rücken & hintere Schulter — die Haltungsmuskeln, die vom vielen
  // Sitzen und Vorbeugen schwach werden. Bewusst leichtes Startgewicht.
  rear: [
    { name: 'Reverse Flys',                   hint: 'Vorgebeugt, Rücken gerade, leicht gebeugte Arme in weitem Bogen nach außen-oben führen. Schulterblätter oben maximal zusammenziehen, Arme bleiben im gleichen Winkel.', images: imgs('Reverse_Flyes'), weighted: true, startKg: 4 },
    { name: 'Reverse Flys mit Pause',         hint: 'Wie Reverse Flys, oben 2 Sek. die Spannung zwischen den Schulterblättern halten, dann langsam ab. Noch stärkerer Reiz für den oberen Rücken.', images: imgs('Reverse_Flyes'), weighted: true, startKg: 4 },
    { name: 'Sitzende Reverse Flys',          hint: 'Auf der Stuhlkante sitzend, Oberkörper weit nach vorne über die Oberschenkel. Nimmt den unteren Rücken raus, isoliert die hintere Schulter.', images: imgs('Reverse_Flyes'), weighted: true, startKg: 4 }
  ],
  // Gerade Bauchmuskulatur mit Zusatzgewicht — der Finisher des Supersatz-Plans
  crunch: [
    { name: 'Crunch mit Gewicht',             hint: 'Rückenlage, Beine angestellt. Eine Hantel auf der Brust halten und geradlinig nach oben schieben — nur der Oberkörper rollt ein, der untere Rücken bleibt am Boden.', images: imgs('Weighted_Crunches'), weighted: true, startKg: 6, oneDb: true },
    { name: 'Cross-Body Crunch mit Gewicht',  hint: 'Wie der Crunch, aber die Hantel diagonal zur gegenüberliegenden Hüfte schieben. Trainiert zusätzlich die seitliche Bauchmuskulatur. Beide Seiten.', images: imgs('Cross-Body_Crunch'), weighted: true, startKg: 4, oneDb: true }
  ]
};

// Muster, die bei aktiven Hanteln auf die Hantel-Leiter wechseln.
export const DB_PATTERNS = Object.keys(PROGRESSIONS_DB);

// ── ATHLETIK / SCHNELLKRAFT ──────────────────────────────────────────────
// Ziel ist maximale Bewegungsgeschwindigkeit, nicht Muskelversagen. Deshalb
// wenige Wiederholungen, volle Absicht bei jeder einzelnen, lange Pausen.
// Einträge mit weighted:true werden ohne Hanteln automatisch übersprungen.
export const PROGRESSIONS_POWER = {
  // Sprungkraft — Schwerpunkt vertikal
  jump: [
    { name: 'Pogo Hops',                 hint: 'Kleine, sehr schnelle Sprünge nur aus dem Sprunggelenk. Knie fast gestreckt, Boden wie eine heiße Herdplatte verlassen. Baut die Federkraft der Achillessehne auf.', images: imgs('Fast_Skipping') },
    { name: 'Strecksprünge',             hint: 'Aus der Halbhocke explosiv so hoch wie möglich. Weich landen, kurz zurücksetzen, dann erst der nächste Sprung. Jeder Sprung ist ein Maximalversuch.', images: imgs('Freehand_Jump_Squat') },
    { name: 'Tuck Jumps',                hint: 'Maximal hoch springen und beide Knie zur Brust ziehen. Kontrolliert landen. Sobald die Höhe sichtbar abfällt: Satz beenden.', images: imgs('Knee_Tuck_Jump') },
    { name: 'Einbeinige Strecksprünge',  hint: 'Einbeinig maximal hoch, auf demselben Bein weich landen und stabilisieren. Übertragung auf den einbeinigen Absprung im Spiel. Beide Seiten.', images: imgs('Rocket_Jump'), unilateral: true },
    { name: 'Absprung vom Stuhl',        hint: 'Vom Stuhl heruntersteigen (nicht springen), bei Bodenkontakt sofort maximal hoch. Bodenkontakt so kurz wie möglich. Nur ausgeruht und nur an spielfreien Tagen.', images: imgs('Bench_Jump') }
  ],
  // Antritt & Richtungswechsel — horizontal und seitlich
  bound: [
    { name: 'Seitliche Sprünge',         hint: 'Von einem Bein seitlich auf das andere abspringen, weich landen und 1 Sek. stabilisieren. Wie der Ausfallschritt zum Ball.', images: imgs('Lateral_Bound'), unilateral: true },
    { name: 'Standweitsprung',           hint: 'Aus dem Stand so weit wie möglich nach vorne, beidbeinig weich landen. Zwischen den Sprüngen komplett zurückstellen.', images: imgs('Standing_Long_Jump') },
    { name: 'Sprung-Ausfallschritte',    hint: 'Im Ausfallschritt explosiv hochspringen und in der Luft die Beine wechseln. Aufrechter Oberkörper.', images: imgs('Split_Jump'), unilateral: true }
  ],
  // Rumpfrotation & Schusshärte
  rotate: [
    { name: 'Russian Twist',             hint: 'Sitzend, Oberkörper zurückgelehnt, Füße frei. Zügig von Seite zu Seite drehen — die Rotation kommt aus dem Rumpf, nicht aus den Armen.', images: imgs('Russian_Twist'), unilateral: true },
    { name: 'Russian Twist mit Hantel',  hint: 'Wie zuvor, eine Hantel vor der Brust. Sauber und zügig rotieren, nicht schleudern. Beide Seiten.', images: imgs('Russian_Twist'), weighted: true, startKg: 6, unilateral: true, oneDb: true },
    { name: 'Liegestütz mit Rotation',   hint: 'Liegestütz, oben eine Hand zur Decke öffnen und den Rumpf mit aufdrehen. Hüfte bleibt hoch. Verbindet Druckkraft mit Rotation. Beide Seiten.', images: imgs('Push_Up_to_Side_Plank'), unilateral: true }
  ],
  // Wiederholungskraft — kurz und hart, gegen den Leistungsabfall im Spiel
  condition: [
    { name: 'Fersen-Sprints auf der Stelle', hint: 'Auf der Stelle sprinten, Knie hoch, Arme mit. All-out für die volle Zeit — das ist ein Sprint, kein Jogging.', images: imgs('Fast_Skipping'), restSec: 40 },
    { name: 'Star Jumps',                    hint: 'Explosiv aus der Hocke in die Streckung springen, Arme und Beine weit auseinander. Tempo hochhalten.', images: imgs('Star_Jump'), restSec: 40 },
    { name: 'Bergsteiger',                   hint: 'In der Liegestützposition die Knie so schnell wie möglich abwechselnd zur Brust ziehen. Hüfte bleibt tief.', images: imgs('Spider_Crawl'), restSec: 40 }
  ],
  // Kraftbasis — explosiv bewegt, bewusst nicht bis zum Versagen.
  // Hantelvarianten stehen vorn; die Körpergewichtsübung greift, wenn keine
  // Hanteln da sind (beladene Einträge werden dann herausgefiltert).
  hinge: [
    { name: 'Rumänisches Kreuzheben',    hint: 'Die wichtigste Kraftbasis für den Absprung. Hüfte weit zurück, Rücken gerade, aus der Dehnung zügig hochkommen. 2–3 Wdh. im Tank lassen.', images: imgs('Stiff-Legged_Dumbbell_Deadlift'), weighted: true, startKg: 12 },
    { name: 'RDL mit Pause',             hint: 'Rumänisches Kreuzheben, unten 2 Sek. in der Dehnung halten, dann zügig hoch. Härtet die Hamstrings genau dort, wo sie im Sprint reißen.', images: imgs('Stiff-Legged_Dumbbell_Deadlift'), weighted: true, startKg: 12 },
    { name: 'Einbeiniges RDL',           hint: 'Einbeinig, Hantel in der Gegenhand. Hüfte gerade halten — schult genau die Stabilität, die im Sand fehlt. Beide Seiten.', images: imgs('Stiff-Legged_Dumbbell_Deadlift'), weighted: true, startKg: 8, unilateral: true, oneDb: true },
    { name: 'Explosive Glute Bridge',    hint: 'Hüfte so schnell wie möglich nach oben schnellen, oben 1 Sek. maximal anspannen, kontrolliert ab. Beidbeinig.', images: imgs('Butt_Lift_Bridge') }
  ],
  squat: [
    { name: 'Bulgarische Splitkniebeuge',hint: 'Hinterer Fuß auf dem Stuhl. Kontrolliert runter, zügig hoch. Einbeinige Stabilität für Landungen und Richtungswechsel. Beide Seiten.', images: imgs('Split_Squat_with_Dumbbells'), weighted: true, startKg: 8, unilateral: true },
    { name: 'Goblet Squat (explosiv)',   hint: 'Eine Hantel vor der Brust. Kontrolliert runter, so schnell wie möglich hoch. Moderates Gewicht — Geschwindigkeit schlägt Last.', images: imgs('Goblet_Squat'), weighted: true, startKg: 12, oneDb: true },
    { name: 'Kniebeuge mit Sprung',      hint: 'Tief in die Hocke, explosiv nach oben abspringen, weich landen. Ohne Zusatzgewicht.', images: imgs('Freehand_Jump_Squat') }
  ],
  // Oberkörper: hier geht es um Muskelaufbau und Definition, nicht um
  // Schnellkraft. Deshalb mittlere Wiederholungen, sauber geführt, mit
  // ein bis zwei Wiederholungen Reserve statt bis zum Muskelversagen.
  push: [
    { name: 'Kurzhantel Floor Press',    hint: 'Rückenlage auf der Matte, Hanteln über der Brust. Absenken bis die Oberarme den Boden berühren, dann kraftvoll hoch. Der beste Brustreiz ohne Bank.', images: imgs('Dumbbell_Floor_Press'), weighted: true, startKg: 10 },
    { name: 'Enges Floor Press',         hint: 'Floor Press mit engem Griff, Ellbogen dicht am Körper. Verlagert die Arbeit auf Trizeps und innere Brust.', images: imgs('Close-Grip_Dumbbell_Press'), weighted: true, startKg: 8 },
    { name: 'Explosive Liegestütze',     hint: 'Runter kontrolliert, hoch so schnell, dass die Hände fast abheben. Ergänzt das Drücken um einen Schnellkraftreiz.', images: imgs('Pushups') },
    { name: 'Plyo Push-ups',             hint: 'So kräftig hochdrücken, dass die Hände den Boden verlassen. Weich abfangen. Auf der Matte, nicht auf hartem Boden.', images: imgs('Plyo_Push-up') }
  ],
  pike: [
    { name: 'Schulterdrücken (sitzend)', hint: 'Auf dem Stuhl, Rücken gerade. Hanteln von Schulterhöhe über den Kopf drücken, kontrolliert absenken. Die Basisübung für runde Schultern.', images: imgs('Seated_Dumbbell_Press'), weighted: true, startKg: 8 },
    { name: 'Schulterdrücken (stehend)', hint: 'Im Stand, Bauch fest, Rippen unten — kein Hohlkreuz. Die Ganzkörperspannung macht es schwerer als sitzend.', images: imgs('Standing_Dumbbell_Press'), weighted: true, startKg: 8 },
    { name: 'Arnold Press',              hint: 'Start mit Handflächen zum Körper, beim Drücken nach außen drehen. Trifft durch die Rotation die gesamte Schulter.', images: imgs('Arnold_Dumbbell_Press'), weighted: true, startKg: 6 },
    { name: 'Pike Push-ups',             hint: 'Hüfte hoch wie ein umgekehrtes V, Kopf Richtung Boden absenken und kraftvoll hochdrücken.', images: imgs('Handstand_Push-Ups') }
  ],
  pull: [
    { name: 'Einarmiges Kurzhantel-Rudern', hint: 'Hand und Knie auf dem Stuhl, Rücken flach wie ein Tisch. Hantel eng am Körper zur Hüfte ziehen, Schulterblatt zuletzt. Beide Seiten.', images: imgs('One-Arm_Dumbbell_Row'), weighted: true, startKg: 12, unilateral: true, oneDb: true },
    { name: 'Vorgebeugtes Rudern',       hint: 'Hüfte zurück, Oberkörper ca. 45°, Rücken gerade. Beide Hanteln zur Hüfte ziehen, oben kurz halten.', images: imgs('Bent_Over_Two-Dumbbell_Row'), weighted: true, startKg: 10 },
    { name: 'Reverse Flyes',             hint: 'Vorgebeugt, leicht gebeugte Arme seitlich nach außen und oben führen. Trifft die hintere Schulter und den oberen Rücken — die beste Haltungsübung.', images: imgs('Reverse_Flyes'), weighted: true, startKg: 4 },
    { name: 'Reverse Snow Angels',       hint: 'Bauchlage, Arme gestreckt über den Kopf und zurück. Hält die Schultern hinten — Gegengewicht zum vielen Vorbeugen im Spiel.', images: imgs('Superman') }
  ],
  biceps: [
    { name: 'Bizeps-Curls',              hint: 'Ellbogen bleiben am Körper fixiert. Zügig hoch, drei Sekunden kontrolliert ab — das Absenken bringt den Reiz. Kein Schwung aus der Hüfte.', images: imgs('Dumbbell_Bicep_Curl'), weighted: true, startKg: 8 },
    { name: 'Hammer-Curls',              hint: 'Handflächen zeigen zueinander (Daumen oben). Trifft zusätzlich den Unterarm und lässt den Arm breiter wirken.', images: imgs('Hammer_Curls'), weighted: true, startKg: 8 },
    { name: 'Konzentrations-Curls',      hint: 'Sitzend, Ellbogen an der Innenseite des Oberschenkels abstützen. Maximale Isolation, oben kurz anspannen. Beide Seiten.', images: imgs('Concentration_Curls'), weighted: true, startKg: 6, unilateral: true, oneDb: true }
  ],
  triceps: [
    { name: 'Trizeps-Strecken über Kopf',hint: 'Eine Hantel beidhändig hinter dem Kopf, Ellbogen zeigen nach vorne und bleiben eng. Streckt den langen Trizepskopf — der macht die Armrückseite dick.', images: imgs('Standing_Dumbbell_Triceps_Extension'), weighted: true, startKg: 8, oneDb: true },
    { name: 'Trizeps-Kickbacks',         hint: 'Vorgebeugt, Oberarm parallel zum Körper fixiert. Nur der Unterarm bewegt sich, oben zwei Sekunden anspannen. Beide Seiten.', images: imgs('Tricep_Dumbbell_Kickback'), weighted: true, startKg: 5, unilateral: true, oneDb: true },
    { name: 'Dips am Stuhl',             hint: 'Hände auf der Stuhlkante hinter dir, Füße nach vorne. Körper absenken bis die Ellbogen 90° erreichen, dann hochdrücken.', images: imgs('Bench_Dips') }
  ],
  core: [
    { name: 'Hollow Body Hold',          hint: 'Auf dem Rücken, Arme über Kopf, Beine tief — alles schwebt. Lendenwirbelsäule bleibt am Boden. Der Grundspannungs-Test für Fallrückzieher.', images: imgs('Flutter_Kicks'), static: true },
    { name: 'Side Plank',                hint: 'Seitlich auf dem Unterarm, Hüfte hoch. Stabilisiert seitlich gegen das Wegkippen bei Landungen. Beide Seiten.', images: imgs('Side_Bridge'), static: true, unilateral: true },
    { name: 'Hollow Rocks',              hint: 'Aus dem Hollow Hold in eine schaukelnde Bewegung kommen, Spannung nie verlieren. Elastische Rumpfspannung.', images: imgs('Cocoons'), static: true }
  ]
};

// Aufwärmen für den Athletik-Modus: mehr Hüftöffnung und Aktivierung,
// weniger Herz-Kreislauf — der Sprungteil braucht frische Beine.
export const WARMUP_POWER = [
  { name: 'Lockeres Einlaufen',         seconds: 45, hint: 'Auf der Stelle traben, Schultern locker ausschütteln. Nur den Kreislauf hochfahren, nicht ermüden.' },
  { name: 'Hüftkreisen & Beinpendel',   seconds: 60, hint: 'Hüfte in beide Richtungen kreisen. Dann Bein vor/zurück und seitlich pendeln — je 15 Sek. pro Seite. Amplitude langsam größer werden lassen.' },
  { name: 'Tiefe Hocke & Groiners',     seconds: 60, hint: 'In die tiefe Hocke setzen, mit den Ellbogen die Knie nach außen drücken. Dann im Ausfallschritt den Ellbogen neben den Fuß bringen — je 5× pro Seite.' },
  { name: 'Cat-Cow & Rumpfrotation',    seconds: 45, hint: 'Vierfüßlerstand, Rücken runden und durchhängen. Dann eine Hand zur Decke öffnen und die Brustwirbelsäule aufdrehen — je 5× pro Seite.' },
  { name: 'Anfersen & Kniehebelauf',    seconds: 45, hint: 'Je 20 Sek. Fersen zum Gesäß und Knie auf Hüfthöhe. Sauberer Fußaufsatz auf dem Ballen.' },
  { name: 'Probesprünge',               seconds: 30, hint: 'Fünf lockere Strecksprünge bei etwa 70 Prozent. Weiche Landungen üben, dann bist du bereit für den ersten Satz.' }
];

export const PATTERN_LABELS = {
  push:      'PUSH · HORIZONTAL',
  pike:      'PUSH · VERTIKAL',
  pull:      'PULL · ZIEHEN',
  squat:     'SQUAT · BEINE',
  hinge:     'HINGE · POSTERIOR',
  calf:      'CALVES · WADEN',
  core:      'CORE · STABILITÄT',
  jump:      'PLYO · SPRUNGKRAFT',
  bound:     'PLYO · ANTRITT',
  rotate:    'CORE · ROTATION',
  condition: 'KONDITION · INTERVALL',
  biceps:    'ARME · BIZEPS',
  triceps:   'ARME · TRIZEPS',
  rear:      'RÜCKEN · HINTERE SCHULTER',
  crunch:    'CORE · BAUCH'
};

export const DAY_TEMPLATES = {
  // Ganzkörper mit Supersätzen (nach dem Video). Übungen mit demselben `ss`-Wert
  // bilden einen Supersatz: direkt hintereinander, Pause erst nach dem Paar.
  // Erste zwei Blöcke schwerer (weniger Wdh.), letzte zwei höher — die App
  // steuert das über die ss-Nummer. Braucht Kurzhanteln.
  // Gewichtsgepaarte Supersätze: beide Übungen eines Blocks nutzen dasselbe
  // Gewicht (spec.kg) — mit einer verstellbaren Hantel stellst du pro Block
  // einmal ein und wechselst innerhalb des Blocks nie. Nur 3 Umstellungen im
  // ganzen Workout (12 → 10 → 10 → 8 kg). Erste zwei Blöcke schwerer.
  'super': [
    { key: 'gkA', name: 'Ganzkörper Supersätze', focus: 'Ganzer Körper · gleiche Gewichte pro Block',
      ex: [
        // Block 1 · 12 kg — Rücken + Beinrückseite
        { pattern: 'pull',    priority: 'main', ss: 0, pick: 'Vorgebeugtes Rudern (beidarmig)', kg: 12 },
        { pattern: 'hinge',   priority: 'main', ss: 0, pick: 'Rumänisches Kreuzheben',          kg: 12 },
        // Block 2 · 10 kg — Beine + Brust
        { pattern: 'squat',   priority: 'main', ss: 1, pick: 'Bulgarische Splitkniebeuge',      kg: 10 },
        { pattern: 'push',    priority: 'main', ss: 1, pick: 'Kurzhantel Floor Press',          kg: 10 },
        // Block 3 · 10 kg — Schultern + Bizeps
        { pattern: 'pike',    priority: 'main', ss: 2, pick: 'Schulterdrücken (sitzend)',       kg: 10 },
        { pattern: 'biceps',  priority: 'main', ss: 2, pick: 'Bizeps-Curls',                    kg: 10 },
        // Block 4 · 8 kg — Trizeps + Bauch (Bauch ohne Gewicht)
        { pattern: 'triceps', priority: 'main', ss: 3, pick: 'Trizeps-Kickbacks',               kg: 8 },
        { pattern: 'crunch',  priority: 'main', ss: 3, bw: true, pick: 'Crunch' }
      ]
    }
  ],
  '3': [
    { key: 'push',  name: 'Push',  focus: 'Brust · Schultern · Trizeps',
      ex: [
        { pattern: 'push',    priority: 'main' },
        { pattern: 'pike',    priority: 'main' },
        { pattern: 'push',    priority: 'secondary' },
        { pattern: 'triceps', priority: 'main' },
        { pattern: 'core',    priority: 'main' }
      ]
    },
    { key: 'pull',  name: 'Pull',  focus: 'Rücken · Bizeps · hintere Schulter',
      ex: [
        { pattern: 'pull',   priority: 'main' },
        { pattern: 'pull',   priority: 'secondary' },
        { pattern: 'pike',   priority: 'secondary' },
        { pattern: 'biceps', priority: 'main' },
        { pattern: 'core',   priority: 'main' }
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
        { pattern: 'push',    priority: 'main' },
        { pattern: 'pike',    priority: 'main' },
        { pattern: 'pull',    priority: 'secondary' },
        { pattern: 'triceps', priority: 'main' },
        { pattern: 'core',    priority: 'main' }
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
        { pattern: 'pull',   priority: 'main' },
        { pattern: 'pull',   priority: 'secondary' },
        { pattern: 'push',   priority: 'secondary' },
        { pattern: 'biceps', priority: 'main' },
        { pattern: 'core',   priority: 'main' }
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
  // Athletik-Split: Sprungkraft zuerst (mit frischen Beinen), danach Kraftbasis.
  // Bewusst wenig Beinvolumen — der Sand liefert davon schon reichlich.
  // Jede Einheit paart einen Sprung- oder Schnellkraftreiz mit zwei
  // Hantelübungen: die Sprünge machen dich schnell, die Hanteln liefern
  // die Kraft, aus der die Geschwindigkeit überhaupt entstehen kann.
  // Sprungkraft steht immer am Anfang (mit frischen Beinen), danach folgt
  // der Oberkörper mit Aufbau-Wiederholungen. Beinvolumen bleibt bewusst
  // gering — dafür sorgt schon der Sand.
  'power3': [
    { key: 'pwA', name: 'Druck & Sprungkraft', focus: 'Absprung · Brust · Schultern · Trizeps',
      ex: [
        { pattern: 'jump',    priority: 'main' },
        { pattern: 'push',    priority: 'main' },
        { pattern: 'pike',    priority: 'main' },
        { pattern: 'triceps', priority: 'main' },
        { pattern: 'core',    priority: 'main' }
      ]
    },
    { key: 'pwB', name: 'Zug & Kraftbasis', focus: 'Rücken · Bizeps · Hüfte',
      ex: [
        { pattern: 'hinge',  priority: 'main' },
        { pattern: 'pull',   priority: 'main' },
        { pattern: 'pull',   priority: 'secondary' },
        { pattern: 'biceps', priority: 'main' },
        { pattern: 'rotate', priority: 'main' }
      ]
    },
    { key: 'pwC', name: 'Beine & Ausdauer', focus: 'Richtungswechsel · Beinkraft · Wiederholungskraft',
      ex: [
        { pattern: 'bound',     priority: 'main' },
        { pattern: 'squat',     priority: 'main' },
        { pattern: 'condition', priority: 'main' },
        { pattern: 'core',      priority: 'main' }
      ]
    }
  ],
  // Kompaktvariante für Wochen mit vier Spieleinheiten
  'power2': [
    { key: 'pwSA', name: 'Druck & Sprungkraft', focus: 'Absprung · Brust · Schultern · Trizeps',
      ex: [
        { pattern: 'jump',    priority: 'main' },
        { pattern: 'push',    priority: 'main' },
        { pattern: 'pike',    priority: 'main' },
        { pattern: 'triceps', priority: 'main' },
        { pattern: 'core',    priority: 'main' }
      ]
    },
    { key: 'pwSB', name: 'Zug & Beine', focus: 'Rücken · Bizeps · Hüfte · Ausdauer',
      ex: [
        { pattern: 'hinge',     priority: 'main' },
        { pattern: 'pull',      priority: 'main' },
        { pattern: 'biceps',    priority: 'main' },
        { pattern: 'squat',     priority: 'secondary' },
        { pattern: 'condition', priority: 'main' }
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
