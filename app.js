/* js/app.js — Core app controller */
'use strict';

const App = (() => {
  let _currentScreen = 'splash';
  let _toastTimer = null;

  const state = {
    gp: 12450,
    ep: 380,
    level: 42,
    energy: 12,
    energyMax: 12,
  };

  /* ── Screen routing ── */
  function goto(screenId) {
    const prev = document.getElementById('screen-' + _currentScreen);
    const next = document.getElementById('screen-' + screenId);
    if (!next) return;

    if (prev) prev.classList.remove('active');
    next.classList.add('active');
    _currentScreen = screenId;

    // Trigger screen init hooks
    if (screenId === 'home')       Home.init();
    if (screenId === 'match-type') _initMatchType();
    if (screenId === 'squad')      Squad.init();
    if (screenId === 'store')      Store.init();
    if (screenId === 'match')      Match.init();

    // Update bottom nav active state
    document.querySelectorAll('.nav-btn[data-screen]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === screenId);
    });
  }

  /* ── Match type screen ── */
  function _initMatchType() {
    const grid = document.getElementById('matchTypeGrid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';
    grid.innerHTML = EventsDB.matchTypes.map(mt => `
      <button class="mt-card ${mt.tag==='HOT'?'hot':''} ${mt.tag==='NEW'?'premium':''}"
              onclick="Match.startMode('${mt.id}')">
        <span class="mt-icon">${mt.emoji}</span>
        <h4>${mt.label}</h4>
        <p>${mt.desc}</p>
        ${mt.tag ? `<div class="mt-tag ${mt.tagColor}">${mt.tag}</div>` : ''}
      </button>
    `).join('');
  }

  /* ── Toast ── */
  function showToast(msg, duration = 2500) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), duration);
  }

  /* ── Modal ── */
  function openModal(id) {
    document.getElementById(id).style.display = 'flex';
  }
  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  /* ── Currency helpers ── */
  function spendGP(amount) {
    if (state.gp < amount) { showToast('Not enough GP! Visit the Store.'); return false; }
    state.gp -= amount;
    _updateCurrencyUI();
    return true;
  }
  function spendEP(amount) {
    if (state.ep < amount) { showToast('Not enough EP! Buy more in Store.'); return false; }
    state.ep -= amount;
    _updateCurrencyUI();
    return true;
  }
  function earnGP(amount) {
    state.gp += amount;
    _updateCurrencyUI();
  }
  function _updateCurrencyUI() {
    const fmt = n => n.toLocaleString();
    ['home-gp','store-gp-val'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = fmt(state.gp);
    });
    const storeGP = document.getElementById('storeGP');
    if (storeGP) storeGP.textContent = '💰 ' + fmt(state.gp);
    const homeGP = document.getElementById('home-gp');
    if (homeGP) homeGP.textContent = fmt(state.gp);
    const homeEP = document.getElementById('home-ep');
    if (homeEP) homeEP.textContent = fmt(state.ep);
  }

  /* ── Splash ── */
  function _runSplash() {
    const fill = document.getElementById('loaderFill');
    const loadingText = document.getElementById('loadingText');
    const steps = [
      [10,'Loading assets...'],
      [30,'Preparing players...'],
      [55,'Building stadium...'],
      [75,'Connecting servers...'],
      [90,'Almost ready...'],
      [100,'Welcome!'],
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => goto('home'), 300);
        return;
      }
      const [pct, txt] = steps[i++];
      fill.style.width = pct + '%';
      loadingText.textContent = txt;
    }, 380);
  }

  /* ── D-pad setup ── */
  function _setupDpad() {
    document.querySelectorAll('.dp').forEach(btn => {
      const dx = parseFloat(btn.dataset.dx || 0);
      const dy = parseFloat(btn.dataset.dy || 0);
      let interval = null;
      const start = () => {
        Match.move(dx, dy);
        interval = setInterval(() => Match.move(dx, dy), 120);
      };
      const stop = () => clearInterval(interval);
      btn.addEventListener('pointerdown', start);
      btn.addEventListener('pointerup', stop);
      btn.addEventListener('pointerleave', stop);
    });
  }

  /* ── Boot ── */
  function boot() {
    _runSplash();
    _setupDpad();
  }

  return { goto, showToast, openModal, closeModal, spendGP, spendEP, earnGP, state, boot };
})();

document.addEventListener('DOMContentLoaded', () => App.boot());
