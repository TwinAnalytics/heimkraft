import { classifyLevel } from './planner.js';
import { PROGRESSIONS } from './data.js';
import { saveProfile } from './storage.js';
import { renderToday } from './today.js';
import { openPlayer } from './player.js';
import { getTrainLog } from './logbook.js';

let wizStep = 1;
const wizData = { weight: null, frequency: null, push: null, pull: null, squat: null, plank: null };

export function openWizard() {
  document.getElementById('wizardModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  setWizStep(1);
}

export function closeWizard() {
  document.getElementById('wizardModal').classList.remove('open');
  document.body.style.overflow = '';
}

function setWizStep(n) {
  wizStep = n;
  document.querySelectorAll('.wiz-step').forEach(s => s.classList.toggle('active', +s.dataset.step === n));
  document.querySelectorAll('.wiz-bar').forEach((b, i) => {
    b.classList.toggle('done', i + 1 < n);
    b.classList.toggle('active', i + 1 === n);
  });
  document.getElementById('wizBack').disabled = n === 1;
  document.getElementById('wizNext').textContent = n === 4 ? 'Plan generieren' : 'Weiter';
  if (n === 4) renderWizSummary();
}

function readWizStep() {
  if (wizStep === 1) {
    const v = parseInt(document.getElementById('inWeight').value);
    if (!v || v < 30 || v > 250) { alert('Bitte ein gültiges Gewicht eingeben (30–250 kg).'); return false; }
    wizData.weight = v;
  } else if (wizStep === 2) {
    if (!wizData.frequency) { alert('Bitte Frequenz wählen.'); return false; }
  } else if (wizStep === 3) {
    wizData.push  = parseInt(document.getElementById('inPush').value)  || 0;
    wizData.pull  = parseInt(document.getElementById('inPull').value)  || 0;
    wizData.squat = parseInt(document.getElementById('inSquat').value) || 0;
    wizData.plank = parseInt(document.getElementById('inPlank').value) || 0;
  }
  return true;
}

function renderWizSummary() {
  const pushL  = classifyLevel('push',  wizData.push);
  const pullL  = classifyLevel('pull',  wizData.pull);
  const squatL = classifyLevel('squat', wizData.squat);
  const plankL = classifyLevel('plank', wizData.plank);
  const avg    = (pushL + pullL + squatL + plankL) / 4;
  const levelLabel = avg < 1 ? 'Einsteiger' : avg < 2 ? 'Anfänger' : avg < 3 ? 'Fortgeschritten' : 'Profi';
  const startEx = {
    push:  PROGRESSIONS.push[pushL].name,
    pull:  PROGRESSIONS.pull[pullL].name,
    squat: PROGRESSIONS.squat[squatL].name,
    core:  PROGRESSIONS.core[plankL].name
  };
  const protein = Math.round(wizData.weight * 1.8);
  document.getElementById('wizSummary').innerHTML = `
    <div class="wiz-summary-row"><span>Körpergewicht</span><b>${wizData.weight} kg</b></div>
    <div class="wiz-summary-row"><span>Frequenz</span><b>${wizData.frequency}× pro Woche</b></div>
    <div class="wiz-summary-row"><span>Eingestuftes Level</span><b>${levelLabel}</b></div>
    <div class="wiz-summary-row"><span>Start Push</span><b>${startEx.push}</b></div>
    <div class="wiz-summary-row"><span>Start Pull</span><b>${startEx.pull}</b></div>
    <div class="wiz-summary-row"><span>Start Squat</span><b>${startEx.squat}</b></div>
    <div class="wiz-summary-row"><span>Start Core</span><b>${startEx.core}</b></div>
    <div class="wiz-summary-row"><span>Protein-Empfehlung</span><b>${protein} g / Tag</b></div>
  `;
}

function finishWizard() {
  const pushL  = classifyLevel('push',  wizData.push);
  const pullL  = classifyLevel('pull',  wizData.pull);
  const squatL = classifyLevel('squat', wizData.squat);
  const plankL = classifyLevel('plank', wizData.plank);
  const profile = {
    weight:    wizData.weight,
    frequency: wizData.frequency,
    levels: {
      push:  pushL,
      pike:  pushL,
      pull:  pullL,
      squat: squatL,
      hinge: squatL,
      core:  plankL
    },
    tests:        { push: wizData.push, pull: wizData.pull, squat: wizData.squat, plank: wizData.plank },
    planBaseline: Object.keys(getTrainLog()).length,
    createdAt:    new Date().toISOString()
  };
  saveProfile(profile);
  closeWizard();
  renderToday();
  document.querySelector('header.hero').scrollIntoView({ behavior: 'smooth' });
  setTimeout(openPlayer, 800);
}

export function setupWizardHandlers() {
  document.getElementById('wizClose').addEventListener('click', closeWizard);
  document.getElementById('wizBack').addEventListener('click', () => {
    if (wizStep > 1) setWizStep(wizStep - 1);
  });
  document.getElementById('wizNext').addEventListener('click', () => {
    if (!readWizStep()) return;
    if (wizStep < 4) setWizStep(wizStep + 1);
    else finishWizard();
  });
  document.querySelectorAll('#freqChoice .wiz-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#freqChoice .wiz-choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      wizData.frequency = parseInt(btn.dataset.freq);
    });
  });
}
