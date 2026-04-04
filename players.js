/* data/players.js — Player database */
const PlayersDB = {

  /* ── Starting XI (4-3-3) ── */
  squad: [
    {id:1, name:'Alisson',    short:'Alisson',  pos:'GK',  posGroup:'GK',  nation:'Brazil',    club:'Liverpool',  ovr:89, emoji:'🧤', num:1,  pac:55, sho:20, pas:62, dri:58, def:89, phy:78},
    {id:2, name:'Robertson',  short:'Robertson',pos:'LB',  posGroup:'DEF', nation:'Scotland',  club:'Liverpool',  ovr:87, emoji:'👤', num:26, pac:85, sho:68, pas:76, dri:72, def:82, phy:76},
    {id:3, name:'Van Dijk',   short:'Van Dijk', pos:'CB',  posGroup:'DEF', nation:'Netherlands',club:'Liverpool', ovr:91, emoji:'🛡️', num:4,  pac:72, sho:58, pas:70, dri:65, def:93, phy:90},
    {id:4, name:'Konaté',     short:'Konate',   pos:'CB',  posGroup:'DEF', nation:'France',    club:'Liverpool',  ovr:86, emoji:'👤', num:5,  pac:80, sho:45, pas:65, dri:60, def:88, phy:86},
    {id:5, name:'Alexander-Arnold',short:'AlexArnold',pos:'RB',posGroup:'DEF',nation:'England',club:'Liverpool',  ovr:87, emoji:'👤', num:66, pac:82, sho:78, pas:88, dri:80, def:78, phy:72},
    {id:6, name:'Thiago',     short:'Thiago',   pos:'CM',  posGroup:'MID', nation:'Spain',     club:'Liverpool',  ovr:87, emoji:'🎯', num:6,  pac:70, sho:74, pas:90, dri:86, def:78, phy:68},
    {id:7, name:'Szoboszlai', short:'Szoboszlai',pos:'CM', posGroup:'MID', nation:'Hungary',   club:'Liverpool',  ovr:86, emoji:'💫', num:8,  pac:78, sho:80, pas:82, dri:84, def:64, phy:74},
    {id:8, name:'Jones',      short:'Jones',    pos:'CM',  posGroup:'MID', nation:'England',   club:'Liverpool',  ovr:83, emoji:'👤', num:17, pac:76, sho:70, pas:78, dri:80, def:68, phy:72},
    {id:9, name:'Salah',      short:'Salah',    pos:'LW',  posGroup:'FWD', nation:'Egypt',     club:'Liverpool',  ovr:93, emoji:'⭐', num:11, pac:92, sho:90, pas:80, dri:93, def:52, phy:78},
    {id:10,name:'Núñez',      short:'Nuñez',    pos:'ST',  posGroup:'FWD', nation:'Uruguay',   club:'Liverpool',  ovr:87, emoji:'🔥', num:9,  pac:90, sho:86, pas:64, dri:82, def:42, phy:84},
    {id:11,name:'Díaz',       short:'Diaz',     pos:'RW',  posGroup:'FWD', nation:'Colombia',  club:'Liverpool',  ovr:87, emoji:'💨', num:7,  pac:88, sho:82, pas:74, dri:88, def:50, phy:72},
  ],

  /* ── Bench ── */
  bench: [
    {id:12,name:'Kelleher',   short:'Kelleher', pos:'GK',  posGroup:'GK',  nation:'Ireland',   club:'Liverpool',  ovr:78, emoji:'🧤', num:62, pac:50, sho:15, pas:52, dri:48, def:78, phy:70},
    {id:13,name:'Gomez',      short:'Gomez',    pos:'CB',  posGroup:'DEF', nation:'England',   club:'Liverpool',  ovr:82, emoji:'👤', num:2,  pac:78, sho:38, pas:62, dri:58, def:85, phy:80},
    {id:14,name:'Curtis Jones',short:'C.Jones', pos:'CM',  posGroup:'MID', nation:'England',   club:'Liverpool',  ovr:81, emoji:'👤', num:80, pac:72, sho:75, pas:78, dri:82, def:60, phy:66},
    {id:15,name:'Elliott',    short:'Elliott',  pos:'RW',  posGroup:'FWD', nation:'England',   club:'Liverpool',  ovr:80, emoji:'👤', num:19, pac:84, sho:74, pas:72, dri:82, def:48, phy:62},
    {id:16,name:'Gakpo',      short:'Gakpo',    pos:'LW',  posGroup:'FWD', nation:'Netherlands',club:'Liverpool', ovr:83, emoji:'👤', num:18, pac:83, sho:80, pas:74, dri:80, def:46, phy:70},
  ],

  /* ── Pack pool (random players from) ── */
  packPool: [
    {name:'Mbappé',     pos:'ST',  nation:'France',      ovr:97, emoji:'⚡', tier:'legendary'},
    {name:'Vinicius Jr',pos:'LW',  nation:'Brazil',      ovr:95, emoji:'🔥', tier:'legendary'},
    {name:'Bellingham', pos:'CM',  nation:'England',     ovr:94, emoji:'💫', tier:'legendary'},
    {name:'Haaland',    pos:'ST',  nation:'Norway',      ovr:95, emoji:'💪', tier:'legendary'},
    {name:'Yamal',      pos:'RW',  nation:'Spain',       ovr:90, emoji:'🌟', tier:'rare'},
    {name:'Rodri',      pos:'CDM', nation:'Spain',       ovr:92, emoji:'🛡️', tier:'legendary'},
    {name:'Pedri',      pos:'CM',  nation:'Spain',       ovr:91, emoji:'🎯', tier:'rare'},
    {name:'Salah',      pos:'LW',  nation:'Egypt',       ovr:93, emoji:'⭐', tier:'legendary'},
    {name:'De Bruyne',  pos:'CAM', nation:'Belgium',     ovr:92, emoji:'👑', tier:'legendary'},
    {name:'Musiala',    pos:'CAM', nation:'Germany',     ovr:89, emoji:'🎨', tier:'rare'},
    {name:'Saka',       pos:'RW',  nation:'England',     ovr:88, emoji:'🏃', tier:'rare'},
    {name:'Gvardiol',   pos:'LB',  nation:'Croatia',     ovr:87, emoji:'🛡️', tier:'rare'},
    {name:'Ter Stegen', pos:'GK',  nation:'Germany',     ovr:89, emoji:'🧤', tier:'rare'},
    {name:'Lewandowski',pos:'ST',  nation:'Poland',      ovr:90, emoji:'⚽', tier:'rare'},
    {name:'Son',        pos:'LW',  nation:'South Korea', ovr:88, emoji:'🌸', tier:'rare'},
    {name:'Wirtz',      pos:'CAM', nation:'Germany',     ovr:88, emoji:'✨', tier:'rare'},
    {name:'Gusto',      pos:'RB',  nation:'France',      ovr:84, emoji:'👤', tier:'epic'},
    {name:'Mainoo',     pos:'CM',  nation:'England',     ovr:82, emoji:'👤', tier:'epic'},
    {name:'Kudus',      pos:'RW',  nation:'Ghana',       ovr:83, emoji:'👤', tier:'epic'},
    {name:'Pulisic',    pos:'LW',  nation:'USA',         ovr:84, emoji:'🦅', tier:'epic'},
    {name:'Osimhen',    pos:'ST',  nation:'Nigeria',     ovr:88, emoji:'🐆', tier:'rare'},
    {name:'Saliba',     pos:'CB',  nation:'France',      ovr:88, emoji:'🗼', tier:'rare'},
    {name:'Lookman',    pos:'LW',  nation:'Nigeria',     ovr:85, emoji:'💚', tier:'epic'},
    {name:'Zaire-Emery',pos:'CM', nation:'France',      ovr:82, emoji:'🌟', tier:'epic'},
  ],

  getOvrColor(ovr){
    if(ovr>=93) return 'gold';
    if(ovr>=88) return 'green';
    if(ovr>=84) return 'blue';
    return 'white';
  },

  getPosClass(posGroup){
    const map={GK:'gk-card',DEF:'def-card',MID:'mid-card',FWD:'fwd-card'};
    return map[posGroup]||'mid-card';
  },

  randomPackPlayer(tier=null){
    let pool = this.packPool;
    if(tier) pool = pool.filter(p=>p.tier===tier);
    if(!pool.length) pool = this.packPool;
    return pool[Math.floor(Math.random()*pool.length)];
  }
};
