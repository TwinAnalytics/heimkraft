import { setupInstallBanner, registerServiceWorker } from './pwa.js';
import { renderLog, setupLogbookHandlers } from './logbook.js';
import { renderToday } from './today.js';
import { openWizard, setupWizardHandlers } from './wizard.js';
import { openPlayer, setupPlayerHandlers } from './player.js';
import { openPlan, setupPlanHandlers } from './plan-view.js';
import { loadProfile, clearProfile } from './storage.js';

setupInstallBanner();
registerServiceWorker();

setupLogbookHandlers();
setupWizardHandlers();
setupPlayerHandlers();
setupPlanHandlers();

document.getElementById('ctaStart').addEventListener('click', () => {
  if (!loadProfile()) openWizard();
  else openPlayer();
});

document.getElementById('ctaReset').addEventListener('click', () => {
  if (confirm('Plan und Profil zurücksetzen? Dein Logbuch bleibt erhalten.')) {
    clearProfile();
    renderToday();
  }
});

document.getElementById('btnViewPlan').addEventListener('click', () => {
  if (!loadProfile()) openWizard();
  else openPlan();
});

renderLog();
renderToday();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.principle, .day, .ladder, .rule-block, .log-week, .log-stats').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
