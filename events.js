/* data/events.js — Events, match types, store packs */
const EventsDB = {

  featured: [
    {id:1, title:'La Liga Fiesta',  sub:'Top picks available', emoji:'⚽', bg:'linear-gradient(135deg,#001266,#0051ff)', timer:'3d 12h', reward:'Epic Scout'},
    {id:2, title:'UCL Showdown',    sub:'Epic scout rewards',  emoji:'🏆', bg:'linear-gradient(135deg,#1a0a0a,#c80000)', timer:'1d 4h',  reward:'Legendary Player'},
    {id:3, title:'EPL Challenge',   sub:'Earn bonus GP',       emoji:'🌟', bg:'linear-gradient(135deg,#0a1a00,#007800)', timer:'5d',     reward:'+2000 GP'},
    {id:4, title:'Coin Rush',       sub:'Double rewards',      emoji:'💎', bg:'linear-gradient(135deg,#1a0e00,#c87000)', timer:'2d',     reward:'×2 GP'},
    {id:5, title:'Serie A Stars',   sub:'Italian legends',     emoji:'🔵', bg:'linear-gradient(135deg,#00003a,#0000cc)', timer:'6d',     reward:'Rare Scout'},
    {id:6, title:'Bundesliga Cup',  sub:'German excellence',   emoji:'🦅', bg:'linear-gradient(135deg,#1a0000,#880000)', timer:'4d 8h',  reward:'Epic Scout'},
  ],

  matchTypes: [
    {id:'quick',   label:'Quick Match',   desc:'vs AI · Any style',     emoji:'⚡', tag:'HOT',  tagColor:'red',  mode:'QUICK MATCH'},
    {id:'online',  label:'Online Match',  desc:'vs Players · Ranked',   emoji:'🌐', tag:null,   tagColor:null,   mode:'ONLINE MATCH'},
    {id:'dream',   label:'Dream League',  desc:'Compete for top prizes', emoji:'🏆', tag:'NEW',  tagColor:'gold', mode:'DREAM LEAGUE'},
    {id:'challenge',label:'Challenge',    desc:'Skill challenges',       emoji:'🎯', tag:null,   tagColor:null,   mode:'CHALLENGE'},
    {id:'coop',    label:'Co-op Match',   desc:'Team with friends',      emoji:'🤝', tag:null,   tagColor:null,   mode:'CO-OP'},
    {id:'campaign',label:'Campaign',      desc:'Story missions',         emoji:'📋', tag:null,   tagColor:null,   mode:'CAMPAIGN'},
  ],

  recentResults: [
    {homeTeam:'My Team', awayTeam:'AI United', homeScore:3, awayScore:1, result:'win'},
    {homeTeam:'My Team', awayTeam:'FC Elite',  homeScore:2, awayScore:2, result:'draw'},
    {homeTeam:'My Team', awayTeam:'Real Stars',homeScore:1, awayScore:2, result:'loss'},
  ],

  scouts: [
    {
      id:'epic', name:'Epic Scout', tier:'EPIC',
      stars:3, maxStars:5,
      bg:'linear-gradient(135deg,#0a0a2e,#1a0a5e)',
      currency:'gp', price:'3,000', priceRaw:3000,
      guarantee:'★ Epic player guaranteed',
      guaranteeColor:'#a855f7',
      packTier:'epic',
    },
    {
      id:'premium', name:'Premium Scout', tier:'RARE',
      stars:4, maxStars:5,
      bg:'linear-gradient(135deg,#0a1a3e,#0051ff)',
      currency:'ep', price:'100', priceRaw:100,
      guarantee:'★★ Rare player guaranteed',
      guaranteeColor:'#00c4ff',
      packTier:'rare',
    },
    {
      id:'legendary', name:'Legendary Scout', tier:'LEGENDARY',
      stars:5, maxStars:5,
      bg:'linear-gradient(135deg,#2e0a0a,#8b0000)',
      currency:'ep', price:'300', priceRaw:300,
      guarantee:'🔥 Legendary guaranteed',
      guaranteeColor:'#ff6600',
      packTier:'legendary',
    },
    {
      id:'laliga', name:'La Liga Scout', tier:'FEATURED',
      stars:3, maxStars:5,
      bg:'linear-gradient(135deg,#1a0a2e,#5500aa)',
      currency:'gp', price:'5,000', priceRaw:5000,
      guarantee:'⚡ La Liga specialists',
      guaranteeColor:'#f5c400',
      packTier:'epic',
    },
    {
      id:'ucl', name:'UCL Scout', tier:'UCL',
      stars:4, maxStars:5,
      bg:'linear-gradient(135deg,#001a3e,#003399)',
      currency:'ep', price:'200', priceRaw:200,
      guarantee:'🏆 UCL star guaranteed',
      guaranteeColor:'#00c4ff',
      packTier:'rare',
    },
    {
      id:'basic', name:'Basic Scout', tier:'BASIC',
      stars:2, maxStars:5,
      bg:'linear-gradient(135deg,#0e1535,#1a2550)',
      currency:'gp', price:'800', priceRaw:800,
      guarantee:'Random player',
      guaranteeColor:'#8a9cc4',
      packTier:null,
    },
  ],

  gpPacks: [
    {emoji:'💰', amount:'1,000 GP',  bonus:'',          price:'Free',    badge:null},
    {emoji:'💰', amount:'5,000 GP',  bonus:'',          price:'$0.99',   badge:null},
    {emoji:'💰', amount:'12,000 GP', bonus:'+1,000 GP', price:'$1.99',   badge:'POPULAR'},
    {emoji:'💰', amount:'30,000 GP', bonus:'+5,000 GP', price:'$4.99',   badge:'VALUE'},
    {emoji:'💰', amount:'80,000 GP', bonus:'+15,000 GP',price:'$9.99',   badge:null},
  ],

  items: [
    {emoji:'🎫', name:'Match Ticket',  desc:'Play 1 extra match',  price:'200 GP'},
    {emoji:'⚡', name:'Energy Refill', desc:'Refill all stamina',  price:'500 GP'},
    {emoji:'💊', name:'Train Boost',   desc:'+50% XP for 24h',     price:'1,000 GP'},
    {emoji:'🛡️', name:'Form Shield',  desc:'Protect player form',  price:'800 GP'},
    {emoji:'🔑', name:'Epic Key',      desc:'Unlock epic missions', price:'150 EP'},
    {emoji:'✨', name:'Skill Upgrade', desc:'Boost 1 stat by 5',   price:'2,000 GP'},
  ],
};
