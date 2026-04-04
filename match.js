/* js/match.js — Match engine */
'use strict';

const Match = (() => {
  /* ── State ── */
  let scoreHome = 0, scoreAway = 0;
  let matchSeconds = 0;
  let matchMins = 0;
  let running = false;
  let paused = false;
  let ended = false;
  let timer = null;
  let stamina = 100;
  let sprinting = false;
  let staminaTimer = null;
  let tactic = 'Normal';
  let momentum = 50; // 0=away dominating, 100=home dominating
  let currentMode = 'QUICK MATCH';

  /* ── Ball & player positions (% of field) ── */
  let ball = { x: 50, y: 50 };
  let selectedPlayerIdx = 8; // Salah (index in squad)
  let playerPositions = [];
  let awayPositions = [];

  /* 4-3-3 base positions for home team (x%, y%) */
  const HOME_FORMATION = [
    {x:50,y:8},   // GK
    {x:20,y:28},  // LB
    {x:38,y:28},  // CB1
    {x:62,y:28},  // CB2
    {x:80,y:28},  // RB
    {x:25,y:50},  // CM1
    {x:50,y:48},  // CM2
    {x:75,y:50},  // CM3
    {x:18,y:72},  // LW  ← selected
    {x:50,y:75},  // ST
    {x:82,y:72},  // RW
  ];

  const AWAY_FORMATION = [
    {x:50,y:92},
    {x:20,y:78},{x:38,y:78},{x:62,y:78},{x:80,y:78},
    {x:28,y:62},{x:50,y:60},{x:72,y:62},
    {x:18,y:40},{x:50,y:38},{x:82,y:40},
  ];

  const AWAY_TEAM = {name:'FC ELITE', crest:'🦁', ovr:85};
  const HOME_TEAM = {name:'MY TEAM',  crest:'🦅', ovr:88};

  /* ── Init ── */
  function init() {
    scoreHome = 0; scoreAway = 0;
    matchSeconds = 0; matchMins = 0;
    running = false; paused = false; ended = false;
    stamina = 100; momentum = 50;

    _resetPositions();
    _renderHUD();
    _renderPlayers();
    _renderBall();
    _drawField();

    document.getElementById('pauseOverlay').style.display = 'none';
    document.getElementById('ftOverlay').style.display = 'none';
    document.getElementById('goalOverlay').querySelector('.goal-word').className = 'goal-word';
    document.getElementById('hudHT').style.display = 'none';

    // Set mode label
    document.getElementById('hudMode').textContent = currentMode;

    setTimeout(() => _startTimer(), 600);
  }

  function startMode(modeId) {
    const mt = EventsDB.matchTypes.find(m => m.id === modeId);
    if (mt) currentMode = mt.mode;
    App.goto('match');
  }

  function _resetPositions() {
    playerPositions = HOME_FORMATION.map(p => ({...p}));
    awayPositions   = AWAY_FORMATION.map(p => ({...p}));
    ball = { x: 50, y: 50 };
    selectedPlayerIdx = 8; // LW (Salah)
  }

  /* ── Field canvas (pitch lines) ── */
  function _drawField() {
    const canvas = document.getElementById('fieldCanvas');
    if (!canvas) return;
    const fw = canvas.parentElement.clientWidth;
    const fh = canvas.parentElement.clientHeight;
    canvas.width = fw; canvas.height = fh;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,fw,fh);

    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.2;

    // Outline
    ctx.strokeRect(8,8,fw-16,fh-16);
    // Halfway
    ctx.beginPath(); ctx.moveTo(8,fh/2); ctx.lineTo(fw-8,fh/2); ctx.stroke();
    // Centre circle
    ctx.beginPath(); ctx.arc(fw/2,fh/2,Math.min(fw,fh)*0.14,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(fw/2,fh/2,4,0,Math.PI*2); ctx.fill();

    ctx.strokeStyle='rgba(255,255,255,0.2)';
    // Penalty box home
    const pb = fw*0.18, phh = fh*0.2;
    ctx.strokeRect(fw/2-pb, 8, pb*2, phh);
    // Penalty box away
    ctx.strokeRect(fw/2-pb, fh-8-phh, pb*2, phh);
    // Small box home
    const sb = fw*0.1, sbh = fh*0.09;
    ctx.strokeRect(fw/2-sb, 8, sb*2, sbh);
    // Small box away
    ctx.strokeRect(fw/2-sb, fh-8-sbh, sb*2, sbh);
    // Penalty spots
    ctx.fillStyle='rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.arc(fw/2, 8+phh*0.5, 3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(fw/2, fh-8-phh*0.5, 3,0,Math.PI*2); ctx.fill();
    // Penalty arcs
    ctx.strokeStyle='rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.arc(fw/2, 8+phh*0.5, Math.min(fw,fh)*0.13, 0.35*Math.PI, 0.65*Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(fw/2, fh-8-phh*0.5, Math.min(fw,fh)*0.13, 1.35*Math.PI, 1.65*Math.PI); ctx.stroke();
    // Goal lines
    const gl = fw*0.12;
    ctx.strokeStyle='rgba(255,255,255,0.35)';
    ctx.lineWidth=2.5;
    ctx.strokeRect(fw/2-gl, 0, gl*2, 6);
    ctx.strokeRect(fw/2-gl, fh-6, gl*2, 6);
  }

  /* ── Render players ── */
  function _renderPlayers() {
    const container = document.getElementById('fieldPlayers');
    if (!container) return;
    container.innerHTML = '';

    // Home team
    PlayersDB.squad.forEach((p, i) => {
      const pos = playerPositions[i];
      const el = document.createElement('div');
      el.className = 'field-player' + (i === selectedPlayerIdx ? ' selected' : '');
      el.id = 'fp-' + i;
      el.style.left = pos.x + '%';
      el.style.top  = pos.y + '%';
      el.innerHTML = `
        <div class="fp-avatar" style="background:${_teamColor(p.posGroup)};">${p.emoji}</div>
        <div class="fp-name-tag">${p.short}</div>
      `;
      el.addEventListener('click', () => _selectPlayer(i));
      container.appendChild(el);
    });

    // Away team (no clicking)
    awayPositions.forEach((pos, i) => {
      const el = document.createElement('div');
      el.className = 'field-player away';
      el.id = 'awy-' + i;
      el.style.left = pos.x + '%';
      el.style.top  = pos.y + '%';
      el.innerHTML = `
        <div class="fp-avatar" style="background:rgba(180,20,20,.85);">👤</div>
        <div class="fp-name-tag" style="background:rgba(150,0,0,.65);">Away ${i+1}</div>
      `;
      container.appendChild(el);
    });
  }

  function _teamColor(posGroup) {
    const map = {GK:'rgba(180,90,0,.85)',DEF:'rgba(0,100,40,.85)',MID:'rgba(0,60,180,.85)',FWD:'rgba(0,60,180,.85)'};
    return map[posGroup] || 'rgba(0,60,180,.85)';
  }

  function _selectPlayer(idx) {
    if (idx < 0 || idx >= PlayersDB.squad.length) return;
    document.getElementById('fp-'+selectedPlayerIdx)?.classList.remove('selected');
    selectedPlayerIdx = idx;
    document.getElementById('fp-'+idx)?.classList.add('selected');
  }

  function _renderBall() {
    const el = document.getElementById('ballEl');
    if (!el) return;
    el.style.left = ball.x + '%';
    el.style.top  = ball.y + '%';
  }

  /* ── Movement ── */
  function move(dx, dy) {
    if (!running || paused || ended) return;
    const speed = sprinting ? 4.5 : 3;
    const drainPerMove = sprinting ? 2 : 0;

    // Move selected player
    const pos = playerPositions[selectedPlayerIdx];
    if (pos) {
      pos.x = Math.max(3, Math.min(97, pos.x + dx * speed));
      pos.y = Math.max(3, Math.min(97, pos.y + dy * speed));
      const el = document.getElementById('fp-' + selectedPlayerIdx);
      if (el) { el.style.left = pos.x + '%'; el.style.top = pos.y + '%'; }
    }

    // Move ball if close to player
    const dist = Math.hypot(ball.x - pos.x, ball.y - pos.y);
    if (dist < 8) {
      ball.x = Math.max(2, Math.min(98, ball.x + dx * speed * 0.85));
      ball.y = Math.max(2, Math.min(98, ball.y + dy * speed * 0.85));
      _renderBall();
      // Build momentum when pushing forward (toward away goal = low y)
      if (dy < 0) _addMomentum(1);
    }

    // Stamina drain
    if (drainPerMove > 0) {
      stamina = Math.max(0, stamina - drainPerMove);
      _updateStamina();
    }
  }

  /* ── Actions ── */
  function pass() {
    if (!running || paused || ended) return;
    App.showToast('Pass!');
    // Move ball toward next open player
    const targets = playerPositions.filter((_, i) => i !== selectedPlayerIdx && i !== 0);
    if (targets.length) {
      const t = targets[Math.floor(Math.random() * targets.length)];
      const newX = t.x + (Math.random()*10-5);
      const newY = t.y + (Math.random()*10-5);
      _animateBall(newX, newY, 300);
    }
    _addMomentum(2);
  }

  function through() {
    if (!running || paused || ended) return;
    App.showToast('Through ball!');
    // Send ball into space ahead of striker
    const striker = playerPositions[9]; // ST
    _animateBall(striker.x + (Math.random()*16-8), Math.max(10, striker.y - 12), 250);
    _selectPlayer(9);
    _addMomentum(3);
  }

  function skill() {
    if (!running || paused || ended) return;
    App.showToast('Skill move! 🌀');
    _addMomentum(2);
  }

  function shoot() {
    if (!running || paused || ended) return;
    const pos = playerPositions[selectedPlayerIdx];
    // Must be in attacking half (top 50%)
    if (pos.y > 65) { App.showToast('Too far! Get closer to shoot.'); return; }

    const player = PlayersDB.squad[selectedPlayerIdx];
    const shotPower = (player.sho + momentum/2) / 100;
    const chance = shotPower * (pos.y < 30 ? 0.75 : pos.y < 50 ? 0.45 : 0.2);

    // Animate ball toward goal
    _animateBall(50 + (Math.random()*20-10), 2, 350);

    setTimeout(() => {
      if (Math.random() < chance) {
        _goalScored('home', player.name);
      } else {
        const saves = ['Great save!','Off the post!','Over the bar!','Blocked!'];
        App.showToast(saves[Math.floor(Math.random()*saves.length)]);
        _animateBall(50, 50, 500);
        _addMomentum(-5);
      }
    }, 380);
  }

  function _animateBall(tx, ty, dur) {
    const el = document.getElementById('ballEl');
    if (!el) return;
    el.style.transition = `left ${dur}ms ease, top ${dur}ms ease`;
    ball.x = tx; ball.y = ty;
    el.style.left = tx + '%'; el.style.top = ty + '%';
    setTimeout(() => { el.style.transition = 'left 0.25s ease, top 0.25s ease'; }, dur+50);
  }

  /* ── Goal ── */
  function _goalScored(team, scorer) {
    if (team === 'home') {
      scoreHome++;
      _addMomentum(15);
    } else {
      scoreAway++;
      _addMomentum(-15);
    }
    _renderHUD();

    const overlay = document.getElementById('goalOverlay');
    const word    = overlay.querySelector('.goal-word');
    const scorerEl = overlay.querySelector('.goal-scorer');

    word.className = 'goal-word show';
    scorerEl.textContent = scorer ? '⚽ ' + scorer : '';
    scorerEl.className = 'goal-scorer show';

    setTimeout(() => { word.className = 'goal-word hide'; scorerEl.className = 'goal-scorer'; }, 1800);
    setTimeout(() => { word.className = 'goal-word'; _kickOff(); }, 2400);

    if (team === 'home') App.showToast(`⚽ GOAL! ${scorer} scores! ${scoreHome}–${scoreAway}`);
    else                 App.showToast(`😬 Conceded! ${scoreHome}–${scoreAway}`);
  }

  function _kickOff() {
    _resetPositions();
    _renderPlayers();
    _renderBall();
  }

  /* ── AI ── */
  function _aiTick() {
    if (!running || paused || ended) return;

    // Move away players slightly toward ball
    awayPositions.forEach((pos, i) => {
      if (i === 0) return; // GK stays
      const targetX = ball.x + (Math.random()*10-5);
      const targetY = ball.y + (Math.random()*10-5);
      pos.x += (targetX - pos.x) * 0.03;
      pos.y += (targetY - pos.y) * 0.03;
      pos.x = Math.max(3, Math.min(97, pos.x));
      pos.y = Math.max(3, Math.min(97, pos.y));
      const el = document.getElementById('awy-' + i);
      if (el) { el.style.left = pos.x + '%'; el.style.top = pos.y + '%'; }
    });

    // Occasional AI shot when momentum is low
    if (momentum < 35 && Math.random() < 0.003) {
      const aOvr = AWAY_TEAM.ovr;
      const chance = (aOvr - 80) / 60 + (1 - momentum/100) * 0.15;
      if (Math.random() < chance) {
        _goalScored('away', null);
      }
    }
  }

  /* ── Timer ── */
  function _startTimer() {
    running = true;
    paused = false;
    if (timer) clearInterval(timer);
    timer = setInterval(_tick, 200); // 200ms = ~1 game minute (90 mins in ~18s real time... or slower)
  }

  function _tick() {
    if (!running || paused) return;
    matchSeconds += 0.2;
    matchMins = Math.floor(matchSeconds / 1.2); // ~1.2 real seconds = 1 game minute → 90 mins = ~108s

    if (matchMins >= 90) { _fullTime(); return; }
    if (matchMins === 45 && matchSeconds < 47) _halfTime();

    // Stamina recovery when not sprinting
    if (!sprinting && stamina < 100) {
      stamina = Math.min(100, stamina + 0.08);
      _updateStamina();
    }

    document.getElementById('hudTime').textContent = matchMins + "'";
    _aiTick();
    _driftMomentum();
    _updateMomentumUI();
  }

  function _halfTime() {
    document.getElementById('hudHT').style.display = 'inline-block';
    App.showToast('Half Time! ' + scoreHome + '–' + scoreAway);
    stamina = Math.min(100, stamina + 20);
    _updateStamina();
    setTimeout(() => document.getElementById('hudHT').style.display = 'none', 3000);
  }

  function _fullTime() {
    running = false;
    ended = true;
    clearInterval(timer);

    const result = scoreHome > scoreAway ? 'win' : scoreHome < scoreAway ? 'loss' : 'draw';
    const gpEarned = result === 'win' ? 800 : result === 'draw' ? 400 : 200;
    App.earnGP(gpEarned);

    document.getElementById('ftScore').textContent  = scoreHome + ' : ' + scoreAway;
    const ftRes = document.getElementById('ftResult');
    const labels = {win:'WIN 🏆',draw:'DRAW 🤝',loss:'LOSS'};
    ftRes.textContent = labels[result];
    ftRes.className   = 'ft-result ' + result;
    document.getElementById('ftRewards').textContent = `+${gpEarned.toLocaleString()} GP earned`;
    document.getElementById('ftOverlay').style.display = 'flex';
  }

  /* ── Momentum ── */
  function _addMomentum(v) {
    momentum = Math.max(0, Math.min(100, momentum + v));
    _updateMomentumUI();
  }
  function _driftMomentum() {
    // Naturally drifts toward 50
    if (momentum > 50) momentum -= 0.05;
    else if (momentum < 50) momentum += 0.05;
  }
  function _updateMomentumUI() {
    document.getElementById('momentumFill').style.width = momentum + '%';
    document.getElementById('momentumBall').style.left  = momentum + '%';
  }

  /* ── Stamina ── */
  function startSprint() { sprinting = true; }
  function stopSprint()  { sprinting = false; }
  function _updateStamina() {
    const el = document.getElementById('staminaFill');
    if (el) {
      el.style.width = stamina + '%';
      el.style.background = stamina > 60 ? 'linear-gradient(90deg,#00c850,#00ff80)'
                          : stamina > 30 ? 'linear-gradient(90deg,#f5c400,#ff9800)'
                          : 'linear-gradient(90deg,#e8002a,#ff4444)';
    }
  }

  /* ── Tactics ── */
  function setTactic(btn, t) {
    document.querySelectorAll('.tac-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tactic = t;
    App.showToast('Tactic: ' + t);
    const tacticMomentum = {Normal:0,Attack:8,Defend:-5,Press:5,Counter:3};
    _addMomentum(tacticMomentum[t] || 0);
  }

  /* ── HUD ── */
  function _renderHUD() {
    document.getElementById('hudScore').textContent = scoreHome + ' : ' + scoreAway;
    document.getElementById('pauseScore').textContent = scoreHome + ' : ' + scoreAway;
    document.getElementById('homeTeamName').textContent = HOME_TEAM.name;
    document.getElementById('awayTeamName').textContent = AWAY_TEAM.name;
    document.getElementById('homeCrest').textContent = HOME_TEAM.crest;
    document.getElementById('awayCrest').textContent = AWAY_TEAM.crest;
  }

  /* ── Pause / Resume ── */
  function pause() {
    if (ended) { App.goto('home'); return; }
    paused = true;
    document.getElementById('pauseOverlay').style.display = 'flex';
    document.getElementById('pauseTime').textContent = matchMins + "'";
    document.getElementById('pauseScore').textContent = scoreHome + ' : ' + scoreAway;
  }
  function resume() {
    paused = false;
    document.getElementById('pauseOverlay').style.display = 'none';
  }
  function restart() {
    clearInterval(timer);
    document.getElementById('pauseOverlay').style.display = 'none';
    document.getElementById('ftOverlay').style.display = 'none';
    init();
  }

  return { init, startMode, move, pass, through, skill, shoot, setTactic, pause, resume, restart, startSprint, stopSprint };
})();
