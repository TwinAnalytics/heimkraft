const PROFILE_KEY  = 'heimkraft-profile-v1';
const LOG_KEY      = 'heimkraft-log-v1';
const EXLOG_KEY    = 'heimkraft-exlog-v1';
const SETTINGS_KEY = 'heimkraft-settings-v1';
const WEIGHT_KEY   = 'heimkraft-weight-v1';
const SESSION_KEY  = 'heimkraft-session-v1';
const INSTALL_KEY  = 'heimkraft-install-dismissed';

const ALL_KEYS = [PROFILE_KEY, LOG_KEY, EXLOG_KEY, SETTINGS_KEY, WEIGHT_KEY];

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

export function saveProfile(p) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch(e) {}
}

export function clearProfile() {
  try { localStorage.removeItem(PROFILE_KEY); } catch(e) {}
}

export function loadLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

export function saveLog(l) {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(l)); } catch(e) {}
}

export function loadExLog() {
  try {
    const raw = localStorage.getItem(EXLOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

export function saveExLog(l) {
  try { localStorage.setItem(EXLOG_KEY, JSON.stringify(l)); } catch(e) {}
}

export function appendExLogEntry(entry) {
  const log = loadExLog();
  log.push(entry);
  // Cap retention to last 60 entries (~ 4-5 Monate Training)
  while (log.length > 60) log.shift();
  saveExLog(log);
}

export function clearExLog() {
  try { localStorage.removeItem(EXLOG_KEY); } catch(e) {}
}

const DEFAULT_SETTINGS = { restMain: 120, restSecondary: 90, sound: true };

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch(e) { return { ...DEFAULT_SETTINGS }; }
}

export function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch(e) {}
}

export function loadWeightLog() {
  try {
    const raw = localStorage.getItem(WEIGHT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

export function saveWeightLog(l) {
  try { localStorage.setItem(WEIGHT_KEY, JSON.stringify(l)); } catch(e) {}
}

// Laufende Trainings-Session sichern, damit ein App-Kill nichts verliert
export function saveSessionSnapshot(s) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch(e) {}
}

export function loadSessionSnapshot() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

export function clearSessionSnapshot() {
  try { localStorage.removeItem(SESSION_KEY); } catch(e) {}
}

export function exportAllData() {
  const out = { exportedAt: new Date().toISOString(), app: 'heimkraft', version: 1, data: {} };
  for (const k of ALL_KEYS) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) out.data[k] = JSON.parse(raw);
    } catch(e) {}
  }
  return out;
}

export function importAllData(obj) {
  if (!obj || obj.app !== 'heimkraft' || !obj.data) {
    throw new Error('Keine gültige Heimkraft-Sicherung.');
  }
  for (const k of ALL_KEYS) {
    if (k in obj.data) {
      try { localStorage.setItem(k, JSON.stringify(obj.data[k])); } catch(e) {}
    }
  }
}

export function dismissInstall() {
  try { localStorage.setItem(INSTALL_KEY, '1'); } catch(e) {}
}

export function isInstallDismissed() {
  try { return !!localStorage.getItem(INSTALL_KEY); } catch(e) { return false; }
}
