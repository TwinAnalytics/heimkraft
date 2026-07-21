import { setupInstallBanner, registerServiceWorker } from './pwa.js';
import { renderLog, setupLogbookHandlers } from './logbook.js';
import { renderToday, isPlanComplete } from './today.js';
import { openWizard, setupWizardHandlers } from './wizard.js';
import { setupPlayerHandlers } from './player.js';
import { openPlan, setupPlanHandlers } from './plan-view.js';
import { openRetest, setupRetestHandlers } from './retest.js';
import { setupSettingsHandlers } from './settings.js';
import { renderGoalCopy } from './goal-copy.js';
import { openDayChooser, setupDayChooserHandlers } from './day-chooser.js';
import { loadProfile, clearProfile, clearSessionSnapshot } from './storage.js';

setupInstallBanner();
registerServiceWorker();

setupLogbookHandlers();
setupWizardHandlers();
setupPlayerHandlers();
setupPlanHandlers();
setupRetestHandlers();
setupSettingsHandlers();
setupDayChooserHandlers();

document.getElementById('ctaStart').addEventListener('click', () => {
  const profile = loadProfile();
  if (!profile) openWizard();
  else if (isPlanComplete(profile)) openRetest();
  else openDayChooser();
});

document.getElementById('ctaReset').addEventListener('click', () => {
  if (confirm('Plan und Profil zurücksetzen? Dein Logbuch bleibt erhalten.')) {
    clearProfile();
    clearSessionSnapshot();
    renderToday();
  }
});

document.getElementById('btnViewPlan').addEventListener('click', () => {
  if (!loadProfile()) openWizard();
  else openPlan();
});

renderLog();
renderToday();
renderGoalCopy();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.principle, .day, .ladder, .rule-block, .log-week, .log-stats').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
