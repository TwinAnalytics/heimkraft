import { isInstallDismissed, dismissInstall } from './storage.js';

export function setupInstallBanner() {
  const isiOS       = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  if (isiOS && !isStandalone && !isInstallDismissed()) {
    setTimeout(() => {
      const banner = document.getElementById('installBanner');
      if (banner) banner.classList.add('show');
    }, 2500);
  }
  const dismissBtn = document.getElementById('installDismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      document.getElementById('installBanner').classList.remove('show');
      dismissInstall();
    });
  }
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(console.error);
  }
}
