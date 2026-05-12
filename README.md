# HEIMKRAFT

Bodyweight Muskelaufbau ohne Geräte. Ein 12-Wochen-Trainingsprotokoll als Progressive Web App.

## Features

- **12-Wochen-Progressionsplan** mit drei Phasen (Foundation · Build · Peak) + automatischer Deload-Woche
- **Onboarding-Wizard** in 4 Schritten: Gewicht, Frequenz (3× oder 4×/Woche), 4 Krafttests → individuelle Startlevel
- **Workout-Player** mit Live-Reps-Counter, Set-Tracking, automatischem Pausentimer (90 Sek.) und Ton-Beep
- **Logbuch** mit Streak, Gesamtcount und 8-Wochen-Heatmap
- **Plan-Übersicht** aller 12 Wochen mit aufklappbaren Tages-Details
- **Offline-fähig** via Service Worker
- **Installierbar** auf iOS und Android als App

## iOS-Installation (Safari)

1. Öffne die App-URL in Safari
2. Tippe auf das **Teilen-Symbol** (Quadrat mit Pfeil nach oben)
3. Wähle **„Zum Home-Bildschirm"**
4. Namen bestätigen → **Hinzufügen**

Die App erscheint auf dem Home-Bildschirm und öffnet sich ohne Browser-UI.

## Android-Installation (Chrome)

1. Öffne die App-URL in Chrome
2. Tippe auf die **drei Punkte** oben rechts
3. Wähle **„App installieren"** oder **„Zum Startbildschirm hinzufügen"**
4. Bestätigen

## Tech-Stack

- **Vanilla JS** mit ES Modules — kein Build-Schritt, kein Framework
- **CSS Custom Properties** für das Design-System
- **localStorage** für Persistenz (Keys: `heimkraft-profile-v1`, `heimkraft-log-v1`)
- **Service Worker** für Offline-Caching (Network-First für JS/HTML, Cache-First für SVG/Fonts)
- **PWA**: Web App Manifest + iOS Meta-Tags

## Lokale Entwicklung

```bash
cd heimkraft
python3 -m http.server 8000
# → http://localhost:8000
```

Ein echter HTTP-Server ist notwendig, da ES Modules (`type="module"`) nicht über `file://` funktionieren.

## Lizenz

MIT — siehe [LICENSE](LICENSE)
