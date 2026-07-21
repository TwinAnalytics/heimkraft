import { loadSettings, saveSettings, exportAllData, importAllData, loadProfile, saveProfile } from './storage.js';
import { renderLog } from './logbook.js';
import { renderToday } from './today.js';

export function openSettings() {
  const s = loadSettings();
  document.getElementById('setRestMain').value      = String(s.restMain);
  document.getElementById('setRestSecondary').value = String(s.restSecondary);
  document.getElementById('setSound').checked       = !!s.sound;

  const profile = loadProfile();
  const dbBox = document.getElementById('setDumbbells');
  dbBox.checked  = !!(profile && profile.dumbbells);
  dbBox.disabled = !profile;

  document.getElementById('settingsModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeSettings() {
  document.getElementById('settingsModal').classList.remove('open');
  document.body.style.overflow = '';
}

function persist() {
  saveSettings({
    restMain:      parseInt(document.getElementById('setRestMain').value) || 120,
    restSecondary: parseInt(document.getElementById('setRestSecondary').value) || 90,
    sound:         document.getElementById('setSound').checked
  });
  // Ausrüstung gehört zum Profil — der Planner wählt danach die Übungsleiter
  const profile = loadProfile();
  if (profile) {
    const wanted = document.getElementById('setDumbbells').checked;
    if (!!profile.dumbbells !== wanted) {
      profile.dumbbells  = wanted;
      // Anpassungen gelten für die alte Übungsauswahl — sauber neu starten
      profile.levelAdjust = { push: 0, pike: 0, pull: 0, squat: 0, hinge: 0, calf: 0, core: 0 };
      saveProfile(profile);
    }
  }
}

function doExport() {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const d    = new Date();
  a.href     = url;
  a.download = `heimkraft-backup-${d.toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function doImport(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      importAllData(JSON.parse(reader.result));
      alert('Daten importiert. Die App lädt neu.');
      location.reload();
    } catch (e) {
      alert('Import fehlgeschlagen: ' + e.message);
    }
  };
  reader.readAsText(file);
}

export function setupSettingsHandlers() {
  document.getElementById('settingsOpen').addEventListener('click', openSettings);
  document.getElementById('settingsClose').addEventListener('click', () => {
    persist();
    closeSettings();
    renderLog();
    renderToday();
  });
  ['setRestMain', 'setRestSecondary', 'setSound', 'setDumbbells'].forEach(id => {
    document.getElementById(id).addEventListener('change', persist);
  });
  document.getElementById('btnExport').addEventListener('click', doExport);
  document.getElementById('btnImportFile').addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) doImport(e.target.files[0]);
  });
}
