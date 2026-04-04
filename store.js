/* js/store.js — Store controller */
'use strict';

const Store = (() => {
  let _currentTab = 'scouts';
  let _currentPack = null;
  let _packRevealed = false;

  function init() {
    if (!document.getElementById('storeBody').dataset.built) {
      _buildTab('scouts');
      document.getElementById('storeBody').dataset.built = '1';
    }
    _updateGP();
  }

  function tab(btn, tabId) {
    document.querySelectorAll('.str-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _currentTab = tabId;
    _buildTab(tabId);
  }

  function _buildTab(tabId) {
    const body = document.getElementById('storeBody');
    if (tabId === 'scouts') body.innerHTML = _buildScouts();
    else if (tabId === 'coins') body.innerHTML = _buildCoins();
    else if (tabId === 'items') body.innerHTML = _buildItems();
    else if (tabId === 'gp') body.innerHTML = _buildGPShop();
  }

  /* ── Scouts ── */
  function _buildScouts() {
    return `<div class="scouts-grid">` +
      EventsDB.scouts.map(s => `
        <div class="scout-card" onclick="Store.openPack('${s.id}')">
          <div class="scout-img" style="background:${s.bg};">
            <div class="scout-stars">${_stars(s.stars, s.maxStars)}</div>
            <div class="scout-tier">${s.tier}</div>
          </div>
          <div class="scout-info">
            <div class="scout-name">${s.name}</div>
            <div class="scout-price">
              <div class="price-icon price-${s.currency}">${s.currency === 'gp' ? 'GP' : 'EP'}</div>
              <span class="price-amt">${s.price} ${s.currency.toUpperCase()}</span>
            </div>
            <div class="scout-guarantee" style="color:${s.guaranteeColor}">${s.guarantee}</div>
          </div>
        </div>
      `).join('') +
    `</div>`;
  }

  function _stars(filled, total) {
    let html = '';
    for (let i = 0; i < total; i++) {
      html += `<span class="${i < filled ? 'star-gold' : 'star-grey'}">★</span>`;
    }
    return html;
  }

  /* ── GP/Coins ── */
  function _buildCoins() {
    return `<div class="coins-grid">` +
      EventsDB.gpPacks.map(p => `
        <div class="coin-pack" onclick="App.showToast('${p.price} — Purchase GP in full game!')">
          <div class="coin-icon-big">${p.emoji}</div>
          <div class="coin-info">
            <div class="coin-amount">${p.amount}</div>
            ${p.bonus ? `<div class="coin-bonus">+ ${p.bonus} BONUS</div>` : '<div style="height:14px;"></div>'}
          </div>
          <div style="text-align:right;">
            <div class="coin-price">${p.price}</div>
            ${p.badge ? `<div class="coin-badge">${p.badge}</div>` : ''}
          </div>
        </div>
      `).join('') +
    `</div>`;
  }

  /* ── Items ── */
  function _buildItems() {
    return `<div class="items-grid">` +
      EventsDB.items.map(item => `
        <div class="item-card" onclick="App.showToast('${item.name}: ${item.desc}')">
          <div class="item-icon">${item.emoji}</div>
          <div class="item-name">${item.name}</div>
          <div class="item-desc">${item.desc}</div>
          <div class="item-price">${item.price}</div>
        </div>
      `).join('') +
    `</div>`;
  }

  /* ── GP Shop ── */
  function _buildGPShop() {
    const exchanges = [
      {from:'100 EP', to:'5,000 GP', rate:'50 GP/EP'},
      {from:'50 EP',  to:'2,000 GP', rate:'40 GP/EP'},
      {from:'10 EP',  to:'350 GP',   rate:'35 GP/EP'},
    ];
    return `
      <div style="margin-bottom:16px;">
        <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:#fff;margin-bottom:8px;">Exchange EP → GP</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${exchanges.map(ex => `
            <div class="coin-pack" onclick="App.showToast('Exchange ${ex.from} for ${ex.to}?')">
              <div style="font-size:28px;">🔄</div>
              <div class="coin-info">
                <div class="coin-amount" style="color:#00c4ff;">${ex.from}</div>
                <div class="coin-bonus">→ ${ex.to} (${ex.rate})</div>
              </div>
              <div class="pause-btn primary" style="width:auto;padding:8px 14px;font-size:12px;">Exchange</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:#fff;margin-bottom:8px;">GP Boosters</div>
        <div class="items-grid">
          <div class="item-card" onclick="App.showToast('GP Booster activated! +500 GP');App.earnGP(500);">
            <div class="item-icon">🚀</div>
            <div class="item-name">Daily Bonus</div>
            <div class="item-desc">Claim 500 GP</div>
            <div class="item-price" style="color:var(--green);">FREE</div>
          </div>
          <div class="item-card" onclick="App.showToast('Watch ad for GP in full game!')">
            <div class="item-icon">📺</div>
            <div class="item-name">Watch Ad</div>
            <div class="item-desc">Earn 200 GP</div>
            <div class="item-price" style="color:var(--green);">FREE</div>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Pack opening ── */
  function openPack(packId) {
    const pack = EventsDB.scouts.find(s => s.id === packId);
    if (!pack) return;

    // Check currency
    if (pack.currency === 'gp') {
      if (!App.spendGP(pack.priceRaw)) return;
    } else {
      if (!App.spendEP(pack.priceRaw)) return;
    }
    _updateGP();

    _currentPack = pack;
    _packRevealed = false;

    document.getElementById('packTitle').textContent = pack.name;
    document.getElementById('packSub').textContent = 'Tap the pack to reveal your player!';
    document.getElementById('packIcon').textContent = '📦';
    document.getElementById('packIcon').style.fontSize = '80px';
    document.getElementById('packReveal').style.display = 'none';
    document.getElementById('packActions').style.display = 'none';
    document.getElementById('packGlow').style.background = 'radial-gradient(circle,rgba(0,81,255,.2) 0%,transparent 70%)';

    App.openModal('modalPack');
  }

  function revealPack() {
    if (_packRevealed || !_currentPack) return;
    _packRevealed = true;

    const icon = document.getElementById('packIcon');
    icon.textContent = '✨';
    icon.style.fontSize = '60px';

    // Glow effect
    const tierColors = {
      legendary:'rgba(255,80,0,.4)',
      rare:'rgba(0,196,255,.3)',
      epic:'rgba(168,85,247,.3)',
    };
    const glowColor = tierColors[_currentPack.packTier] || 'rgba(0,81,255,.3)';
    document.getElementById('packGlow').style.background = `radial-gradient(circle,${glowColor} 0%,transparent 65%)`;

    setTimeout(() => {
      const player = PlayersDB.randomPackPlayer(_currentPack.packTier);
      _showPackedPlayer(player);
    }, 600);
  }

  function _showPackedPlayer(player) {
    const ovrColors = {'legendary':'#ff6600','rare':'#00c4ff','epic':'#a855f7'};
    const ovrColor = ovrColors[player.tier] || '#fff';

    document.getElementById('packReveal').style.display = 'block';
    document.getElementById('packReveal').innerHTML = `
      <div class="pr-player-emoji">${player.emoji}</div>
      <div class="pr-player-ovr" style="color:${ovrColor};">${player.ovr}</div>
      <div class="pr-player-name">${player.name}</div>
      <div class="pr-player-pos">${player.pos} · ${player.nation}</div>
      <div style="margin-top:10px;">
        <span style="background:rgba(255,255,255,.1);border-radius:6px;padding:3px 10px;font-size:10px;color:${ovrColor};font-weight:700;letter-spacing:2px;text-transform:uppercase;">${player.tier}</span>
      </div>
    `;

    document.getElementById('packSub').textContent = '🎉 New player unlocked!';
    document.getElementById('packIcon').style.display = 'none';
    document.getElementById('packActions').style.display = 'block';
  }

  function keepPlayer() {
    App.showToast('Player added to your squad! 🎉');
    App.closeModal('modalPack');
    _updateGP();
  }

  function _updateGP() {
    const el = document.getElementById('storeGP');
    if (el) el.textContent = '💰 ' + App.state.gp.toLocaleString();
  }

  return { init, tab, openPack, revealPack, keepPlayer };
})();
