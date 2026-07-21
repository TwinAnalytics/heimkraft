import { loadSettings, saveSettings, exportAllData, importAllData, loadProfile, saveProfile, clearSessionSnapshot } from './storage.js';
import { renderLog } from './logbook.js';
import { renderToday } from './today.js';
import { renderGoalCopy } from './goal-copy.js';

export function openSettings() {
  const s = loadSettings();
  document.getElementById('setRestMain').value      = String(s.restMain);
  document.getElementById('setRestSecondary').value = String(s.restSecondary);
  document.getElementById('setSound').checked       = !!s.sound;

  const profile = loadProfile();
  const dbBox = document.getElementById('setDumbbells');
  dbBox.checked  = !!(profile && profile.dumbbells);
  dbBox.disabled = !profile;

  const goalSel  = document.getElementById('setGoal');
  const splitSel = document.getElementById('setSplit');
  goalSel.value  = (profile && profile.goal) || 'hypertrophy';
  goalSel.disabled  = !profile;
  splitSel.value = (profile && /^power/.test(profile.split || '')) ? profile.split : 'power2';
  splitSel.disabled = !profile;
  syncSplitRow();

  document.getElementById('settingsModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Die Split-Auswahl ist nur im Athletik-Modus relevant
function syncSplitRow() {
  const isPower = document.getElementById('setGoal').value === 'power';
  document.getElementById('setSplitRow').style.display = isPower ? '' : 'none';
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
  // Ziel und Ausrüstung gehören zum Profil — danach wählt der Planner die Leitern
  const profile = loadProfile();
  if (!profile) return;

  const wantDb    = document.getElementById('setDumbbells').checked;
  const wantGoal  = document.getElementById('setGoal').value;
  const wantSplit = document.getElementById('setSplit').value;

  const goalChanged  = (profile.goal || 'hypertrophy') !== wantGoal;
  const dbChanged    = !!profile.dumbbells !== wantDb;
  const splitChanged = wantGoal === 'power' && profile.split !== wantSplit;

  if (!goalChanged && !dbChanged && !splitChanged) return;

  profile.dumbbells = wantDb;
  profile.goal      = wantGoal;

  if (wantGoal === 'power') {
    profile.split     = wantSplit;
    profile.frequency = wantSplit === 'power3' ? 3 : 2;
  } else if (goalChanged) {
    // Zurück zum Muskelaufbau: auf den zuletzt genutzten Kraft-Split zurückfallen
    profile.split     = profile.strengthSplit || '3';
    profile.frequency = profile.split === '4' ? 4 : 3;
  }
  if (wantGoal === 'hypertrophy') profile.strengthSplit = profile.split;

  // Anpassungen und angefangene Einheit gelten für die alte Auswahl
  profile.levelAdjust = {
    push: 0, pike: 0, pull: 0, squat: 0, hinge: 0, calf: 0,
    core: 0, jump: 0, bound: 0, rotate: 0, condition: 0
  };
  saveProfile(profile);
  clearSessionSnapshot();
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
    renderGoalCopy();
  });
  ['setRestMain', 'setRestSecondary', 'setSound', 'setDumbbells', 'setGoal', 'setSplit'].forEach(id => {
    document.getElementById(id).addEventListener('change', persist);
  });
  document.getElementById('setGoal').addEventListener('change', syncSplitRow);
  document.getElementById('btnExport').addEventListener('click', doExport);
  document.getElementById('btnImportFile').addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) doImport(e.target.files[0]);
  });
}
