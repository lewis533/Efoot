/* js/squad.js — Squad screen controller */
'use strict';

const Squad = (() => {
  let _built = false;
  let _currentTab = 'formation';

  /* 4-3-3 slot positions as % of pitch (x, y) */
  const SLOTS = [
    {x:'50%', y:'91%', player:0},  // GK
    {x:'15%', y:'73%', player:1},  // LB
    {x:'37%', y:'73%', player:2},  // CB1
    {x:'63%', y:'73%', player:3},  // CB2
    {x:'85%', y:'73%', player:4},  // RB
    {x:'26%', y:'53%', player:5},  // CM1
    {x:'50%', y:'51%', player:6},  // CM2
    {x:'74%', y:'53%', player:7},  // CM3
    {x:'15%', y:'26%', player:8},  // LW
    {x:'50%', y:'22%', player:9},  // ST
    {x:'85%', y:'26%', player:10}, // RW
  ];

  function init() {
    tab(document.querySelector('.sq-tab'), 'formation');
    if (!_built) {
      _buildFormation();
      _buildPlayerList('playerList', PlayersDB.squad);
      _buildPlayerList('benchList', PlayersDB.bench);
      _built = true;
    }
  }

  function tab(btn, tabId) {
    document.querySelectorAll('.sq-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    _currentTab = tabId;

    document.getElementById('sqFormation').style.display = tabId === 'formation' ? 'block' : 'none';
    document.getElementById('sqPlayers').style.display   = tabId === 'players'   ? 'block' : 'none';
    document.getElementById('sqBench').style.display     = tabId === 'bench'     ? 'block' : 'none';
  }

  function _buildFormation() {
    const container = document.getElementById('formationPlayers');
    if (!container) return;
    container.innerHTML = '';

    SLOTS.forEach(slot => {
      const p = PlayersDB.squad[slot.player];
      if (!p) return;
      const ovrClass = PlayersDB.getOvrColor(p.ovr);
      const cardClass = PlayersDB.getPosClass(p.posGroup);

      const el = document.createElement('div');
      el.className = 'fp-slot';
      el.style.left = slot.x;
      el.style.top  = slot.y;
      el.innerHTML  = `
        <div class="fp-card-mini ${cardClass}">
          <div class="fpc-ovr ${ovrClass}">${p.ovr}</div>
          <div class="fpc-pos">${p.pos}</div>
        </div>
        <div class="fp-slot-name">${p.short}</div>
      `;
      el.addEventListener('click', () => _showPlayerModal(p));
      container.appendChild(el);
    });
  }

  function _buildPlayerList(containerId, players) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = players.map(p => {
      const ovrClass = PlayersDB.getOvrColor(p.ovr);
      return `
        <div class="player-row" onclick="Squad._showPlayerModalById(${p.id})">
          <div class="pr-num">${p.num}</div>
          <div class="pr-avatar">${p.emoji}</div>
          <div class="pr-info">
            <div class="pr-name">${p.name}</div>
            <div class="pr-meta">${p.pos} · ${p.nation} · ${p.club}</div>
            <div class="pr-bar"><div class="pr-bar-fill" style="width:${p.ovr}%"></div></div>
          </div>
          <div class="pr-ovr ovr-${ovrClass}">${p.ovr}</div>
        </div>
      `;
    }).join('');
  }

  function _showPlayerModalById(id) {
    const p = [...PlayersDB.squad, ...PlayersDB.bench].find(pl => pl.id === id);
    if (p) _showPlayerModal(p);
  }

  function _showPlayerModal(p) {
    const ovrClass = PlayersDB.getOvrColor(p.ovr);
    const ovrColors = {gold:'#f5c400',green:'#00c850',blue:'#00c4ff',white:'#fff',grey:'#8a9cc4'};
    const ovrColor  = ovrColors[ovrClass] || '#fff';
    const posColors = {GK:'#f5a623',DEF:'#00c850',MID:'#00c4ff',FWD:'#e8002a'};
    const posColor  = posColors[p.posGroup] || '#fff';

    document.getElementById('modalPlayerHeader').innerHTML = `
      <div class="mph-avatar">${p.emoji}</div>
      <div class="mph-info">
        <div class="mph-name">${p.name}</div>
        <div class="mph-pos" style="color:${posColor}">${p.pos} · ${p.nation}</div>
        <div class="mph-pos" style="color:var(--grey);margin-top:2px;">${p.club} · #${p.num}</div>
      </div>
      <div class="mph-ovr">
        <div class="mph-ovr-num" style="color:${ovrColor}">${p.ovr}</div>
        <div class="mph-ovr-label">OVR</div>
      </div>
    `;

    const stats = [
      {label:'PAC', val:p.pac, color:'#00c4ff'},
      {label:'SHO', val:p.sho, color:'#e8002a'},
      {label:'PAS', val:p.pas, color:'#00c850'},
      {label:'DRI', val:p.dri, color:'#f5c400'},
      {label:'DEF', val:p.def, color:'#8a9cc4'},
      {label:'PHY', val:p.phy, color:'#ff8c00'},
    ];

    document.getElementById('modalStatRows').innerHTML = stats.map(s => `
      <div class="stat-row">
        <div class="stat-label">${s.label}</div>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill" style="width:${s.val}%;background:${s.color};"></div>
        </div>
        <div class="stat-val">${s.val}</div>
      </div>
    `).join('');

    App.openModal('modalPlayer');
  }

  return { init, tab, _showPlayerModalById };
})();
