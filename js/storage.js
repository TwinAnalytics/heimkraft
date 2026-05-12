const PROFILE_KEY = 'heimkraft-profile-v1';
const LOG_KEY     = 'heimkraft-log-v1';
const INSTALL_KEY = 'heimkraft-install-dismissed';

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

export function dismissInstall() {
  try { localStorage.setItem(INSTALL_KEY, '1'); } catch(e) {}
}

export function isInstallDismissed() {
  try { return !!localStorage.getItem(INSTALL_KEY); } catch(e) { return false; }
}
