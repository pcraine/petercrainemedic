/* ── JOURNAL POSTS ─────────────────────────────────────────────────────────── */
/* ── PAGE NAVIGATION ─────────────────────────────────────────────────────── */
let _currentPage = 'home';
let _transitioning = false;

function showPage(id) {
  if (_transitioning || id === _currentPage) return;
  _transitioning = true;
  let slices = document.querySelectorAll('.pw-slice');
  slices.forEach(function(s,i){
    s.classList.remove('wipe-out');
    s.classList.add('wipe-in');
  });
  setTimeout(function(){
    _doShowPage(id);
    slices.forEach(function(s){ s.classList.remove('wipe-in'); s.classList.add('wipe-out'); });
    setTimeout(function(){ _transitioning = false; }, 500);
  }, 350);
}

function _doShowPage(id) {
  _currentPage = id;
  let pages = document.querySelectorAll('[id^="page-"]');
  pages.forEach(function(p){ p.style.display='none'; p.classList.remove('active'); });
  let target = document.getElementById('page-'+id);
  if (target) { target.style.display='block'; target.classList.add('active'); }
  window.scrollTo(0,0);
  document.querySelectorAll('.nav-center .nav-link').forEach(function(btn){ btn.classList.toggle('active', btn.getAttribute('data-value') === id); });
  if (id==='home') { initHomeAnimations(); }
  if (id==='about') { initAboutPage(); }
  if (id==='quals') { setTimeout(renderCertDash, 100); setTimeout(renderMedsGrid, 150); }
  if (id==='journal') { renderFeatured(); renderJournalList(); setTimeout(initJournalECG,200); }
  if (id==='elearning') {
    let ef = document.getElementById('el-frame');
    if (ef && !ef.getAttribute('data-loaded')) {
      ef.setAttribute('data-loaded','1');
      ef.src = ef.src; /* trigger load if not already loaded */
    }
  }
}

/* ── MENU ─────────────────────────────────────────────────────────────────── */
function toggleMenu() {
  let m = document.getElementById('mobile-nav');
  if (m) m.classList.toggle('open');
}

/* ── TICKER ───────────────────────────────────────────────────────────────── */
(function(){
  let track = document.getElementById('tickerTrack');
  if (!track) return;
  let combined = TICKER_MESSAGES.join(' \u00b7  ');
  for (let i=0; i<4; i++) {
    let d = document.createElement('div');
    d.className = 'ticker-item';
    d.innerHTML = '<div class="ticker-dot"></div>' + combined + ' \u00b7 ';
    track.appendChild(d);
  }
})();

/* ── HOME ANIMATIONS INIT ─────────────────────────────────────────────────── */
function initTypewriter() {
  let roles = [
    'Emergency Ambulance Crew',
    'FREC 3 Certified Clinician',
    'First Aid Trainer — CTLLS L4',
    'Network Lead — East Lancashire',
    'Pre-Hospital Care Professional'
  ];
  let el = document.querySelector('.hero-role-type');
  if (!el) return;
  let roleIdx = 0, charIdx = 0, deleting = false;
  function type() {
    let current = roles[roleIdx];
    if (deleting) {
      charIdx--;
      el.textContent = current.substring(0, charIdx);
      if (charIdx <= 0) { deleting = false; roleIdx = (roleIdx+1) % roles.length; setTimeout(type, 400); return; }
      setTimeout(type, 40);
    } else {
      charIdx++;
      el.textContent = current.substring(0, charIdx);
      if (charIdx >= current.length) { deleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 60);
    }
  }
  setTimeout(type, 800);
}

function initHomeAnimations() {
  // Animate counters
  function animateCounter(id, target, suffix, duration) {
    let el = document.getElementById(id);
    if (!el) return;
    let start = 0, step = Math.max(1, Math.floor(target/50));
    let interval = Math.floor(duration / (target/step));
    el.textContent = '0' + (suffix||'');
    let timer = setInterval(function(){
      start = Math.min(start+step, target);
      el.textContent = start + (suffix||'');
      if (start >= target) clearInterval(timer);
    }, Math.max(20, interval));
  }
  animateCounter('ctr-events', 32, '+', 1200);
  animateCounter('ctr-learners', 208, '+', 1400);
  // News grid
  renderHomeNews();
  // OTW banner
  updateOTWBanner();
  // Last duty stat
  updateLastDutyStat();
  // Typewriter
  initTypewriter();
  updateAvailBadge();
}

function updateLastDutyStat() {
  let el = document.getElementById('ctr-last-duty');
  if (!el) return;
  let today = new Date(); today.setHours(0,0,0,0);
  let past = DEPLOYMENTS.map(function(d){ return new Date(d); })
    .filter(function(d){ return d <= today; })
    .sort(function(a,b){ return b-a; });
  if (!past.length) { el.textContent = '\u2014'; return; }
  let last = past[0]; last.setHours(0,0,0,0);
  let diff = Math.floor((today - last) / 86400000);
  el.textContent = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff + 'd ago';
}

function updateAvailBadge() {
  let statusEl = document.getElementById('avail-status');
  let nextEl   = document.getElementById('avail-next');
  let dotEl    = document.getElementById('avail-dot');
  if(!statusEl||!nextEl) return;
  let today=new Date(); today.setHours(0,0,0,0);
  let months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let deps = typeof DEPLOYMENTS!=='undefined' ? DEPLOYMENTS : [];
  let onNow = deps.some(function(d){let dd=new Date(d);dd.setHours(0,0,0,0);return dd.getTime()===today.getTime();});
  if(onNow){
    statusEl.textContent='ON DEPLOYMENT TODAY';
    statusEl.style.color='rgba(255,200,0,.9)';
    if(dotEl){dotEl.style.background='#FFD700';dotEl.style.boxShadow='0 0 6px #FFD700';}
    nextEl.textContent='Active duty — contact via emergency channels';
    return;
  }
  let future=deps.map(function(d){let dd=new Date(d);dd.setHours(0,0,0,0);return dd;})
    .filter(function(d){return d>today;}).sort(function(a,b){return a-b;});
  statusEl.textContent='AVAILABLE FOR DEPLOYMENT';
  statusEl.style.color='rgba(255,255,255,.85)';
  if(dotEl){dotEl.style.background='#00A651';dotEl.style.boxShadow='0 0 6px #00A651';}
  if(future.length>0){
    let next=future[0];
    let diff=Math.floor((next-today)/86400000);
    let lbl=diff===1?'Tomorrow':diff<=7?'In '+diff+' days':next.getDate()+' '+months[next.getMonth()];
    nextEl.textContent='Next booking: '+lbl+' · North West England';
  } else {
    nextEl.textContent='No confirmed bookings · Available now · North West England';
  }
}

function updateOTWBanner() {
  let el = document.getElementById('otw-banner');
  if (!el) return;
  let today = new Date(); today.setHours(0,0,0,0);
  let future = DEPLOYMENTS.map(function(d){ return new Date(d); })
    .filter(function(d){ d.setHours(0,0,0,0); return d >= today; })
    .sort(function(a,b){ return a-b; });
  if (future.length) {
    let next = future[0];
    let diff = Math.floor((next - today) / 86400000);
    let label = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : 'in ' + diff + 'd';
    el.querySelector('.otw-val') && (el.querySelector('.otw-val').textContent = 'Next deployment: ' + label);
  }
}

/* ── HOME NEWS GRID ───────────────────────────────────────────────────────── */
function renderHomeNews() {
  const grid = document.getElementById('home-news-grid');
  if (!grid || !JOURNAL_POSTS.length) return;
  const posts = JOURNAL_POSTS.slice(0, 3);
  grid.innerHTML = posts.map(p => {
    return `<div class="news-card" data-click="showPage" data-value="journal" style="cursor:pointer">
      <div class="news-date">${fmtDate(p)}</div>
      <div class="news-cat">${p.category}</div>
      <h3 class="news-title">${p.title}</h3>
      <p class="news-excerpt">${p.deck}</p>
      <div class="news-more">Read more \u2192</div>
      </div>`;
  }).join('');
}

/* ── JOURNAL ──────────────────────────────────────────────────────────────── */
function fmtDate(p) {
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let mIdx = months.indexOf(p.month);
  return p.day + ' ' + p.month + ' ' + p.year;
}

function tagHtml(cat) {
  let colours = { Deployment:'#1A3A5C', Training:'#006B3F', Leadership:'#B8860B', Clinical:'#C0392B', Ceremonial:'#4A1A5C' };
  let bg = colours[cat] || '#1a2e27';
  return '<span style="background:' + bg + ';color:#fff;font-size:9px;letter-spacing:2px;padding:3px 10px;text-transform:uppercase">' + cat + '</span>';
}

let _currentFilter = 'all';
function filterPosts(cat, btn) {
  _currentFilter = cat;
  document.querySelectorAll('.jb-filter-btn').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderJournalList();
}

function renderFeatured() {
  if (!JOURNAL_POSTS.length) return;
  let fp = JOURNAL_POSTS[0];
  let el = function(id){ return document.getElementById(id); };
  let tags = el('jf-tags'); if(tags) tags.innerHTML = tagHtml(fp.category);
  let date = el('jf-date'); if(date) date.textContent = fmtDate(fp) + ' \u00b7 ' + fp.readTime;
  let titl = el('jf-title'); if(titl) titl.textContent = fp.title;
  let exc  = el('jf-excerpt'); if(exc) exc.textContent = fp.deck;
  let icon = el('jf-icon'); if(icon) icon.textContent = fp.icon;
  let loc  = el('jf-location'); if(loc) loc.textContent = fp.location;
  let card = el('jf-card');
  if(card) {
    card.setAttribute('data-click', 'openPost');
    card.setAttribute('data-value', '0');
  }
  // Draw canvas illustration for latest post
  initLatestPostCanvas(fp);
}

function initLatestPostCanvas(fp) {
  let c = document.getElementById('jf-post-canvas');
  if (!c) return;
  // Size to parent
  let parent = c.parentElement;
  c.style.position='absolute';c.style.inset='0';c.style.width='100%';c.style.height='100%';
  c.width = parent ? parent.offsetWidth||400 : 400;
  c.height = parent ? parent.offsetHeight||240 : 240;
  let ctx = c.getContext('2d'); if (!ctx) return;
  let cat = fp.category || 'Deployment';
  let title = fp.title || '';
  let w = c.width, h = c.height;
  let raf; // store requestAnimationFrame id

  function stopAnim(){ if(raf) cancelAnimationFrame(raf); }
  // Stop when journal page is hidden
  document.addEventListener('visibilitychange', function(){ if(document.hidden) stopAnim(); });

  if (cat === 'Deployment') {
    // HEMS aerial targeting scope — detailed tactical illustration
    let sweep = 0, blip = {x:w*0.38,y:h*0.42,pulse:0};
    function drawDeployment() {
      raf = requestAnimationFrame(drawDeployment);
      ctx.fillStyle='rgba(3,12,5,0.18)'; ctx.fillRect(0,0,w,h);
      sweep += 0.025;
      let cx=w*0.5, cy=h*0.5;
      // Outer glow
      let outerGlow = ctx.createRadialGradient(cx,cy,h*0.3,cx,cy,h*0.8);
      outerGlow.addColorStop(0,'rgba(0,80,30,0.0)');
      outerGlow.addColorStop(1,'rgba(0,40,15,0.4)');
      ctx.fillStyle=outerGlow; ctx.fillRect(0,0,w,h);
      // Scope rings
      [0.42,0.32,0.22,0.13,0.06].forEach(function(f,i){
        ctx.beginPath(); ctx.arc(cx,cy,Math.min(w,h)*f,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,200,70,'+(0.06+i*0.04)+')';
        ctx.lineWidth=1; ctx.stroke();
        // Range markers on rings
        if(i<4){
          ctx.fillStyle='rgba(0,180,60,0.4)';
          ctx.font='7px JetBrains Mono,monospace';
          ctx.textAlign='left'; ctx.textBaseline='middle';
          ctx.fillText((4-i)*25+'m',cx+Math.min(w,h)*f+3,cy);
        }
      });
      // Crosshairs
      ctx.strokeStyle='rgba(0,180,60,0.12)'; ctx.lineWidth=1;
      ctx.setLineDash([4,8]);
      ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,h);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(w,cy);ctx.stroke();
      ctx.setLineDash([]);
      // Degree markers
      for(let d=0;d<360;d+=30){
        let rad=d*Math.PI/180, r=Math.min(w,h)*0.44;
        let mx=cx+Math.cos(rad-Math.PI/2)*r, my=cy+Math.sin(rad-Math.PI/2)*r;
        ctx.fillStyle='rgba(0,180,60,0.5)';
        ctx.font='7px JetBrains Mono,monospace';
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(d+'°',mx,my);
      }
      // Radar sweep beam
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(sweep);
      let beam=ctx.createConicalGradient?null:null;
      // Draw sweep as filled arc
      ctx.beginPath(); ctx.moveTo(0,0);
      ctx.arc(0,0,Math.min(w,h)*0.45,0,0.4);
      let sweepGrad=ctx.createLinearGradient(0,-h*0.4,h*0.15,-h*0.1);
      sweepGrad.addColorStop(0,'rgba(0,255,80,0.22)');
      sweepGrad.addColorStop(1,'rgba(0,200,60,0.0)');
      ctx.fillStyle=sweepGrad; ctx.fill();
      ctx.restore();
      // Sweep trail
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(sweep-0.3);
      ctx.beginPath(); ctx.moveTo(0,0);
      ctx.arc(0,0,Math.min(w,h)*0.45,0,0.3);
      let trailGrad=ctx.createLinearGradient(0,-h*0.4,h*0.1,-h*0.1);
      trailGrad.addColorStop(0,'rgba(0,200,60,0.08)');
      trailGrad.addColorStop(1,'transparent');
      ctx.fillStyle=trailGrad; ctx.fill();
      ctx.restore();
      // Incident blips
      let blips=[{x:w*0.38,y:h*0.38,lbl:'P1'},{x:w*0.62,y:h*0.55,lbl:'P2'},{x:w*0.28,y:h*0.58,lbl:'P3'}];
      blips.forEach(function(b,i){
        let pulse=0.5+0.5*Math.sin(sweep*3+i*1.2);
        ctx.beginPath(); ctx.arc(b.x,b.y,5+pulse*3,0,Math.PI*2);
        ctx.fillStyle='rgba(0,255,100,'+(0.5+pulse*0.4)+')'; ctx.fill();
        ctx.beginPath(); ctx.arc(b.x,b.y,12+pulse*4,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,220,80,'+(0.2+pulse*0.2)+')';
        ctx.lineWidth=1; ctx.stroke();
        ctx.fillStyle='rgba(255,220,0,0.85)';
        ctx.font='bold 9px JetBrains Mono,monospace';
        ctx.textAlign='left'; ctx.textBaseline='bottom';
        ctx.fillText(b.lbl,b.x+8,b.y-2);
      });
      // Centre target
      ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,255,80,0.7)'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-12,cy);ctx.lineTo(cx+12,cy);
      ctx.moveTo(cx,cy-12);ctx.lineTo(cx,cy+12);
      ctx.strokeStyle='rgba(0,255,80,0.3)'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2);
      ctx.fillStyle='rgba(0,255,80,0.9)'; ctx.fill();
      // HUD data overlay
      ctx.fillStyle='rgba(0,200,70,0.7)';
      ctx.font='8px JetBrains Mono,monospace';
      ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillText('EAC RESPONSE',8,8);
      ctx.fillText('CASUALTIES: '+blips.length,8,20);
      ctx.fillText('STATUS: ACTIVE',8,32);
      ctx.textAlign='right';
      ctx.fillText('FREC 3',w-8,8);
      ctx.fillText('TRIAGE',w-8,20);
    }
    drawDeployment();

  } else if (cat === 'Leadership') {
    // Conference network diagram — SJA management structure
    let t2=0;
    function drawLeadership() {
      raf = requestAnimationFrame(drawLeadership);
      t2 += 0.012;
      ctx.fillStyle='rgba(3,8,5,0.15)'; ctx.fillRect(0,0,w,h);
      // Dark bg base
      let bg=ctx.createLinearGradient(0,0,w,h);
      bg.addColorStop(0,'rgba(5,14,8,0.3)');
      bg.addColorStop(1,'rgba(10,20,12,0.1)');
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      // Org chart nodes
      let nodes=[
        {x:w*0.5,y:h*0.18,label:'NETWORK LEAD',size:10,primary:true},
        {x:w*0.2,y:h*0.52,label:'OPS',size:7},
        {x:w*0.36,y:h*0.52,label:'EVENTS',size:7},
        {x:w*0.52,y:h*0.52,label:'TRAINING',size:7},
        {x:w*0.68,y:h*0.52,label:'COMMUNITY',size:7},
        {x:w*0.84,y:h*0.52,label:'YOUTH',size:7},
        {x:w*0.5,y:h*0.82,label:'208+ LEARNERS',size:6},
      ];
      // Draw connections
      ctx.strokeStyle='rgba(0,150,60,0.25)'; ctx.lineWidth=1;
      ctx.setLineDash([3,6]);
      nodes.slice(1,6).forEach(function(n){
        ctx.beginPath(); ctx.moveTo(nodes[0].x,nodes[0].y); ctx.lineTo(n.x,n.y); ctx.stroke();
      });
      ctx.beginPath(); ctx.moveTo(w*0.5,h*0.52); ctx.lineTo(nodes[6].x,nodes[6].y); ctx.stroke();
      ctx.setLineDash([]);
      // Draw nodes
      nodes.forEach(function(n,i){
        let pulse = n.primary ? 1 : 0.6+0.4*Math.sin(t2*2+i*0.9);
        // Outer ring
        ctx.beginPath(); ctx.arc(n.x,n.y,n.size*1.8*pulse,0,Math.PI*2);
        ctx.strokeStyle=n.primary?'rgba(0,200,70,0.5)':'rgba(0,160,55,0.2)';
        ctx.lineWidth=1; ctx.stroke();
        // Node fill
        ctx.beginPath(); ctx.arc(n.x,n.y,n.size,0,Math.PI*2);
        ctx.fillStyle=n.primary?'rgba(0,180,60,0.9)':'rgba(0,140,50,0.6)';
        ctx.fill();
        // Label
        ctx.fillStyle=n.primary?'rgba(200,255,210,0.95)':'rgba(150,220,160,0.75)';
        ctx.font=(n.primary?'bold ':'')+'8px JetBrains Mono,monospace';
        ctx.textAlign='center'; ctx.textBaseline='top';
        ctx.fillText(n.label,n.x,n.y+n.size+3);
      });
      // SJA cross motif top-left
      let cxs=22,cys=22,cs=12;
      ctx.fillStyle='rgba(0,180,60,0.15)';
      ctx.fillRect(cxs-cs*0.35,cys-cs,cs*0.7,cs*2);
      ctx.fillRect(cxs-cs,cys-cs*0.35,cs*2,cs*0.7);
      // Data
      ctx.fillStyle='rgba(0,200,70,0.6)';
      ctx.font='8px JetBrains Mono,monospace';
      ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillText('7 ROLES CONCURRENT',8,8);
      ctx.fillText('12 MONTHS',8,20);
      ctx.textAlign='right';
      ctx.fillText('EAST LANCS',w-8,8);
      ctx.fillText('SJA NW',w-8,20);
    }
    drawLeadership();

  } else if (cat === 'Training') {
    // First aid training scene
    let t3=0;
    function drawTraining() {
      raf = requestAnimationFrame(drawTraining);
      t3 += 0.015;
      ctx.fillStyle='rgba(3,8,5,0.15)'; ctx.fillRect(0,0,w,h);
      let bg=ctx.createLinearGradient(0,0,0,h);
      bg.addColorStop(0,'rgba(5,14,8,0.2)'); bg.addColorStop(1,'rgba(10,20,12,0.1)');
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      // CPR mannequin
      let mx=w*0.35, my=h*0.5;
      // Head
      ctx.beginPath(); ctx.arc(mx,my-40,18,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,180,60,0.4)'; ctx.lineWidth=1.5; ctx.stroke();
      // Body
      ctx.strokeStyle='rgba(0,180,60,0.3)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(mx,my-22); ctx.lineTo(mx,my+35); ctx.stroke();
      // Arms
      ctx.beginPath(); ctx.moveTo(mx-25,my); ctx.lineTo(mx+25,my); ctx.stroke();
      // Legs
      ctx.beginPath(); ctx.moveTo(mx,my+35); ctx.lineTo(mx-18,my+60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx,my+35); ctx.lineTo(mx+18,my+60); ctx.stroke();
      // Compression animation — hands pressing
      let press = Math.max(0,Math.sin(t3*6));
      ctx.fillStyle='rgba(255,220,0,'+(0.4+press*0.4)+')';
      ctx.beginPath(); ctx.arc(mx,my-5,6+press*2,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,200,80,0.6)';
      ctx.font='bold 9px JetBrains Mono,monospace';
      ctx.textAlign='center'; ctx.fillText(press>0.5?'COMPRESS':'RELEASE',mx,my+80);
      // Large SJA cross right side
      let rx=w*0.72, ry=h*0.45, rs=35;
      ctx.strokeStyle='rgba(0,200,60,0.3)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(rx,ry-rs); ctx.lineTo(rx,ry+rs); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx-rs,ry); ctx.lineTo(rx+rs,ry); ctx.stroke();
      // Stats
      let stats=['208+ TRAINED','FAW · EFAW','BLS · AED','CTLLS L4'];
      stats.forEach(function(s,i){
        let alpha=0.5+0.3*Math.sin(t3+i*0.8);
        ctx.fillStyle='rgba(0,200,70,'+alpha+')';
        ctx.font='8px JetBrains Mono,monospace';
        ctx.textAlign='left'; ctx.textBaseline='top';
        ctx.fillText(s,8,8+i*14);
      });
    }
    drawTraining();

  } else if (cat === 'Ceremonial') {
    // Formal/ceremonial — columns, SJA emblem
    let t4=0;
    function drawCeremonial() {
      raf = requestAnimationFrame(drawCeremonial);
      t4 += 0.008;
      ctx.fillStyle='rgba(3,8,5,0.12)'; ctx.fillRect(0,0,w,h);
      // Formal columns
      let cols=[w*0.15,w*0.35,w*0.65,w*0.85];
      cols.forEach(function(cx){
        ctx.fillStyle='rgba(0,150,50,0.08)';
        ctx.fillRect(cx-12,h*0.1,24,h*0.8);
        ctx.strokeStyle='rgba(0,150,50,0.2)'; ctx.lineWidth=1;
        ctx.strokeRect(cx-12,h*0.1,24,h*0.8);
      });
      // SJA emblem centre
      let ex=w*0.5,ey=h*0.45,er=45;
      let emblemAlpha=0.3+0.15*Math.sin(t4*2);
      ctx.beginPath(); ctx.arc(ex,ey,er,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,180,60,'+emblemAlpha+')'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(ex,ey,er*0.65,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,150,50,'+(emblemAlpha*0.7)+')'; ctx.lineWidth=1; ctx.stroke();
      // Cross in centre
      let cs=22;
      ctx.strokeStyle='rgba(0,200,60,'+emblemAlpha*1.5+')'; ctx.lineWidth=4;
      ctx.beginPath(); ctx.moveTo(ex,ey-cs); ctx.lineTo(ex,ey+cs); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex-cs,ey); ctx.lineTo(ex+cs,ey); ctx.stroke();
      // Ribbon
      ctx.fillStyle='rgba(0,180,60,0.5)';
      ctx.font='bold 8px JetBrains Mono,monospace';
      ctx.textAlign='center'; ctx.fillText('ST JOHN AMBULANCE',ex,h*0.82);
      ctx.fillText('FORMAL DUTY',ex,h*0.88);
      ctx.fillStyle='rgba(0,160,55,0.4)';
      ctx.fillText('ORGAN DONOR SERVICE · 2026',ex,h*0.1+5);
    }
    drawCeremonial();

  } else {
    // Clinical default — cardiac monitor with real PQRST
    let ecgOff=0;
    function drawClinical() {
      raf = requestAnimationFrame(drawClinical);
      ctx.fillStyle='rgba(3,8,5,0.12)'; ctx.fillRect(0,0,w,h);
      ecgOff += 1.8;
      // Monitor bezel
      ctx.strokeStyle='rgba(0,150,50,0.3)'; ctx.lineWidth=2;
      ctx.strokeRect(8,8,w-16,h-16);
      ctx.strokeStyle='rgba(0,120,40,0.15)'; ctx.lineWidth=1;
      ctx.strokeRect(12,12,w-24,h-24);
      // Grid lines
      ctx.strokeStyle='rgba(0,150,40,0.06)'; ctx.lineWidth=1;
      for(let gx=20;gx<w;gx+=30){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,h);ctx.stroke();}
      for(let gy=20;gy<h;gy+=20){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}
      // ECG trace — proper PQRST morphology
      function ecgY(x,off){
        let t=((x+off)%280);
        if(t<80) return 0;
        if(t<88) return -(t-80)*1.5;   // P wave up
        if(t<96) return (t-88)*1.5-12; // P wave down
        if(t<104) return 0;
        if(t<108) return (t-104)*3;    // Q dip
        if(t<114) return -(t-108)*22+12; // R spike up
        if(t<120) return (t-114)*18-120; // S down
        if(t<126) return -(t-120)*3+12; // S return
        if(t<130) return 0;
        if(t<150) return -(t-130)*0.3; // ST segment
        if(t<165) return (t-150)*2.8-6; // T wave up
        if(t<180) return -(t-165)*2.8+36; // T wave down
        if(t<185) return 36-(t-180)*7.2;
        return 0;
      }
      ctx.beginPath(); ctx.moveTo(0,h*0.5);
      for(let x=0;x<w;x++) ctx.lineTo(x, h*0.5 + ecgY(x,ecgOff)*0.45);
      ctx.strokeStyle='rgba(0,255,80,0.85)'; ctx.lineWidth=1.8; ctx.stroke();
      // Glow on trace
      ctx.beginPath(); ctx.moveTo(0,h*0.5);
      for(let x2=0;x2<w;x2++) ctx.lineTo(x2, h*0.5 + ecgY(x2,ecgOff)*0.45);
      ctx.strokeStyle='rgba(0,200,60,0.2)'; ctx.lineWidth=4; ctx.stroke();
      // HR readout
      ctx.fillStyle='rgba(0,230,70,0.9)';
      ctx.font='bold 28px JetBrains Mono,monospace';
      ctx.textAlign='right'; ctx.textBaseline='top';
      ctx.fillText('72',w-20,14);
      ctx.font='10px JetBrains Mono,monospace';
      ctx.fillStyle='rgba(0,180,55,0.7)';
      ctx.fillText('bpm',w-20,46);
      // SpO2
      ctx.fillStyle='rgba(100,180,255,0.7)';
      ctx.font='bold 18px JetBrains Mono,monospace';
      ctx.fillText('99%',w-20,62);
      ctx.font='9px JetBrains Mono,monospace';
      ctx.fillText('SpO2',w-20,82);
      // Label
      ctx.fillStyle='rgba(0,200,70,0.5)';
      ctx.font='8px JetBrains Mono,monospace';
      ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillText('12-LEAD ECG',14,14);
      ctx.fillText('LEAD II',14,26);
    }
    drawClinical();
  }
}


function renderJournalList() {
  let list = document.getElementById('jb-list');
  if (!list) return;
  let posts = JOURNAL_POSTS.filter(function(p){
    return _currentFilter === 'all' || p.category === _currentFilter;
  });
  list.innerHTML = posts.map(function(p,i){
    let realIdx = JOURNAL_POSTS.indexOf(p);
    return '<div class="jpost-row" data-click="openPost" data-value="' + realIdx + '">' +
      '<div class="jpr-date"><span class="jpr-day">' + p.day + '</span><span class="jpr-month">' + p.month + '</span></div>' +
      '<div class="jpr-body">' +
        '<div class="jpr-tags">' + tagHtml(p.category) + '</div>' +
        '<div class="jpr-title">' + p.title + '</div>' +
        '<div class="jpr-excerpt">' + p.deck + '</div>' +
        '<div class="jpr-meta">' + p.location + ' &middot; ' + p.readTime + '</div>' +
        '<div class="jpr-hint">Read entry &nbsp;&rarr;</div>' +
      '</div>' +
      '</div>';
  }).join('');
  renderJournalSidebar();
  updateFilterCounts();
  updateJournalStats();
}

function updateFilterCounts() {
  const counts = {};
  JOURNAL_POSTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  document.querySelectorAll('.jb-filter-btn').forEach(btn => {
    const cat = btn.getAttribute('data-value');
    if (!cat) return;
    const n = cat === 'all' ? JOURNAL_POSTS.length : (counts[cat] || 0);
    const label = cat === 'all' ? 'All Posts' : cat === 'Deployment' ? 'Deployments' : cat;
    btn.textContent = `${label} (${n})`;
  });
}

function updateJournalStats() {
  let cats = {};
  JOURNAL_POSTS.forEach(function(p){ cats[p.category]=1; });
  let deps = JOURNAL_POSTS.filter(function(p){ return p.category==='Deployment'; }).length;
  let ps = document.getElementById('jhs-posts'); if(ps) ps.textContent = JOURNAL_POSTS.length;
  let pd = document.getElementById('jhs-deps'); if(pd) pd.textContent = deps;
  let pc = document.getElementById('jhs-cats'); if(pc) pc.textContent = Object.keys(cats).length;
}

function renderJournalSidebar() {
  const cats = {};
  JOURNAL_POSTS.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  const catEl = document.getElementById('jsb-cats');
  if (catEl) {
    catEl.innerHTML = Object.keys(cats).map(k => {
      return `<div class="jsw-cat" data-click="filterPosts" data-value="${k}" style="cursor:pointer">
        <span class="jsw-cat-name">${k}</span>
        <span class="jsw-cat-n">${cats[k]}</span>
      </div>`;
    }).join('');
  }
  const tags = {};
  JOURNAL_POSTS.forEach(p => { (p.tags || []).forEach(t => { tags[t] = (tags[t] || 0) + 1; }); });
  const tagEl = document.getElementById('jsb-tags');
  if (tagEl) {
    tagEl.innerHTML = Object.keys(tags).slice(0, 20).map(t => {
      return `<span class="jsw-tag" data-click="filterByTag" data-value="${t.replace(/'/g, "\\'")}" title="Filter by: ${t}">${t}</span>`;
    }).join('');
  }
}

function filterByTag(tag) {
  _currentFilter = 'tag:' + tag;
  document.querySelectorAll('.jb-filter-btn').forEach(function(b){ b.classList.remove('active'); });
  let list = document.getElementById('jb-list');
  if (!list) return;
  let posts = JOURNAL_POSTS.filter(function(p){ return (p.tags||[]).indexOf(tag) > -1; });
  list.innerHTML = posts.length ? posts.map(function(p){
    let realIdx = JOURNAL_POSTS.indexOf(p);
    return '<div class="jpost-row" data-click="openPost" data-value="' + realIdx + '">' +
      '<div class="jpr-date"><span class="jpr-day">' + p.day + '</span><span class="jpr-month">' + p.month + '</span></div>' +
      '<div class="jpr-body">' +
        '<div class="jpr-tags">' + tagHtml(p.category) + '</div>' +
        '<div class="jpr-title">' + p.title + '</div>' +
        '<div class="jpr-excerpt">' + p.deck + '</div>' +
        '<div class="jpr-meta">' + p.location + ' &middot; ' + p.readTime + '</div>' +
        '<div class="jpr-hint">Read entry &nbsp;&rarr;</div>' +
      '</div></div>';
  }).join('') : '<div class="jpr-empty">No posts tagged &ldquo;' + tag + '&rdquo;</div>';
  updateFilterCounts();
}

let _articleProgressFn = null;
function openPost(idx) {
  let p = JOURNAL_POSTS[idx];
  if (!p) return;
  let indexView = document.getElementById('journal-index-view');
  let articleView = document.getElementById('journal-article-view');
  if (indexView) indexView.style.display='none';
  if (articleView) { articleView.style.display='block'; articleView.innerHTML = buildArticleHTML(idx, p); }
  window.scrollTo(0,0);
  let bar = document.getElementById('article-progress');
  if (bar) {
    bar.style.display='block'; bar.style.width='0%';
    if (_articleProgressFn) window.removeEventListener('scroll', _articleProgressFn);
    _articleProgressFn = function() {
      let art = document.getElementById('jpa-content');
      if (!art) return;
      let scrolled = window.scrollY;
      let artTop = art.offsetTop;
      let artH = art.offsetHeight;
      let pct = Math.min(100, Math.max(0, ((scrolled - artTop) / (artH - window.innerHeight)) * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', _articleProgressFn, {passive:true});
  }
}

function buildArticleHTML(idx, p) {
  let catColours = { Deployment:'#1A3A5C', Training:'#006B3F', Leadership:'#B8860B', Clinical:'#C0392B', Ceremonial:'#4A1A5C' };
  let bg = catColours[p.category] || '#1a2e27';

  // Contextual CTA per category
  let ctaMap = {
    'Deployment': { label:'Need event medical cover?', sub:'FREC 3 EAC &middot; 19 medications &middot; North West England', btn:'Enquire About Cover', page:'contact' },
    'Training':   { label:'Need a first aid course?', sub:'FAW &middot; EFAW &middot; BLS &middot; Community programmes &middot; CTLLS L4 trainer', btn:'Book Training', page:'contact' },
    'Leadership': { label:'Working with SJA?', sub:'Network Lead &middot; East Lancashire &middot; Volunteering &amp; strategy', btn:'Get in Touch', page:'contact' },
    'Clinical':   { label:'Looking for an EAC?', sub:'FREC 3 &middot; Full clinical scope &middot; NHS Band 4&ndash;5 target roles', btn:'View Full Profile', page:'home' },
    'Ceremonial': { label:'A different kind of service', sub:'Formal representation &middot; Family liaison &middot; Community presence', btn:'About Peter', page:'about' }
  };
  let cta = ctaMap[p.category] || ctaMap['Deployment'];

  // More posts (exclude current, show 4)
  let moreHTML = JOURNAL_POSTS.filter(function(_, i) { return i !== idx; }).slice(0, 4).map(function(q) {
    let qi = JOURNAL_POSTS.indexOf(q);
    return `<div class="jsw-cat" data-click="openPost" data-value="${qi}" style="cursor:pointer"><span class="jsw-cat-name" style="font-size:11px;line-height:1.4">${q.title}</span><span class="jsw-cat-n" style="font-size:7px;min-width:32px;text-align:center">${q.month}</span></div>`;
  }).join('');

  // Next / Prev
  let prevHTML = idx > 0 ? `<div class="jpa-nav-item" data-click="openPost" data-value="${idx - 1}">` +
    '<div class="jpa-nav-dir">&#9664; Previous</div>' +
    `<div class="jpa-nav-title">${JOURNAL_POSTS[idx - 1].title}</div>` +
    '</div>' : '<div></div>';
  let nextHTML = idx < JOURNAL_POSTS.length - 1 ? `<div class="jpa-nav-item jpa-nav-next" data-click="openPost" data-value="${idx + 1}">` +
    '<div class="jpa-nav-dir">Next &#9654;</div>' +
    `<div class="jpa-nav-title">${JOURNAL_POSTS[idx + 1].title}</div>` +
    '</div>' : '<div></div>';

  // Image block
  let imgHTML = '';
  if (p.img && p.img.src) {
    imgHTML = '<div class="jpa-img-wrap"><img class="jpa-img" src="'+p.img.src+'" alt="'+p.img.alt+'" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=\\"jpa-img-err\\">Image not yet available<small>'+p.img.caption+'</small></div>\'">' +
      '<div class="jpa-img-caption">'+p.img.caption+'</div></div>';
  }

  return '<div class="jpost-hero">' +
    '<div class="jph-inner">' +
      '<a class="jph-back" data-click="closePost" href="#">&#9664; Back to Journal</a>' +
      '<div class="jph-tags"><span style="background:'+bg+';color:#fff;font-size:8px;letter-spacing:2px;padding:3px 10px;text-transform:uppercase">'+p.category+'</span></div>' +
      '<h1 class="jph-title">'+p.title+'</h1>' +
      '<div class="jph-deck">'+p.deck+'</div>' +
      '<div class="jph-byline">' +
        '<div class="jph-avatar">PC</div>' +
        '<div><div class="jph-name">Peter Craine</div>' +
        '<div class="jph-readtime">'+p.day+' '+p.month+' '+p.year+' &middot; '+p.location+' &middot; '+p.readTime+'</div></div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div style="display:grid;grid-template-columns:1fr 260px;gap:0;max-width:1060px;margin:0 auto;padding:0 48px">' +
    '<article class="jpost-article" id="jpa-content">' +
      imgHTML +
      (p.body||[]).join('') +
      '<div class="jpa-nav">'+prevHTML+nextHTML+'</div>' +
    '</article>' +
    '<aside style="padding:52px 0 52px 32px;border-left:1px solid rgba(0,107,63,.12)">' +
      '<div class="jsw" style="margin-bottom:18px;border-top-color:'+bg+'">' +
        '<div class="jsw-title">' + cta.label + '</div>' +
        '<p style="font-size:11px;color:rgba(255,255,255,.70);line-height:1.75;margin-bottom:12px">' + cta.sub + '</p>' +
        `<button data-click="showPage" data-value="${cta.page}" class="btn btn-solid" style="width:100%;font-size:10px">${cta.btn}</button>` +
      '</div>' +
      '<div class="jsw">' +
        '<div class="jsw-title">More Posts</div>' +
        moreHTML +
      '</div>' +
      '<div class="jsw">' +
        '<div class="jsw-title">About Peter</div>' +
        '<p style="font-size:12px;color:rgba(255,255,255,.68);line-height:1.7;margin-bottom:12px">EAC &middot; FREC 3 &middot; Network Lead &middot; East Lancashire. Available for event medical cover and first aid training across North West England.</p>' +
        '<button data-click="showPage" data-value="about" class="btn btn-outline" style="width:100%;font-size:10px;margin-bottom:6px">Full Profile</button>' +
        '<button data-click="showPage" data-value="contact" class="btn btn-outline" style="width:100%;font-size:10px">Get in Touch</button>' +
      '</div>' +
    '</aside>' +
  '</div>';
}

function closePost() {
  let indexView = document.getElementById('journal-index-view');
  let articleView = document.getElementById('journal-article-view');
  if (indexView) indexView.style.display='block';
  if (articleView) articleView.style.display='none';
  window.scrollTo(0,0);
  let bar = document.getElementById('article-progress');
  if (bar) { bar.style.display='none'; bar.style.width='0%'; }
  if (_articleProgressFn) { window.removeEventListener('scroll', _articleProgressFn); _articleProgressFn=null; }
}

function initJournalECG() {
  let c = document.getElementById('jf-ecg-canvas');
  if (!c) return;
  c.width = c.offsetWidth || 300; c.height = c.offsetHeight || 120;
  let ctx = c.getContext('2d');
  let off = 0;
  function ecgY(x) {
    let t = (x + off) % 300;
    if(t<60) return 0; if(t<70) return -(t-60)*5; if(t<80) return (t-70)*15-50;
    if(t<90) return 100-(t-80)*11; if(t<100) return -(t-90)*2+10; if(t<110) return 10+(t-100)*1.5;
    if(t<120) return 25-(t-110)*2.5; return 0;
  }
  let running = true;
  function draw() {
    if (!running) return;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle='rgba(5,16,10,0.08)'; ctx.fillRect(0,0,c.width,c.height);
    off += 1.5;
    let mid = c.height/2;
    ctx.beginPath(); ctx.moveTo(0,mid);
    for(let x=0;x<c.width;x++) ctx.lineTo(x, mid+ecgY(x));
    ctx.strokeStyle='rgba(0,220,80,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
    requestAnimationFrame(draw);
  }
  draw();
  // Stop if page changes
  document.addEventListener('page-change', function(){ running=false; });
}

/* ── ABOUT PAGE ───────────────────────────────────────────────────────────── */
function initAboutPage() {
  setTimeout(function(){
    initCoverageMap();
    initHEMSSkillsScope();
  }, 100);
}

function initHEMSSkillsScope() {
  let c = document.getElementById('about-hems-skills');
  if (!c) return;
  let ctx = c.getContext('2d');
  let W = c.width || 600, H = c.height || 420;
  c.width = W; c.height = H;
  let skills2 = [
    { name:'AIRWAY MGMT', level:0.95, x:0.5,  y:0.15, detail:'OPA / NPA / iGel / BVM / Suction' },
    { name:'TRAUMA',      level:0.90, x:0.82, y:0.35, detail:'KED / Tourniquet / Haemorrhage' },
    { name:'MEDICATIONS',  level:0.93, x:0.78, y:0.72, detail:'19 drugs incl. Adrenaline IM' },
    { name:'ASSESSMENT',  level:0.88, x:0.5,  y:0.88, detail:'cABCDE / ECG / NEWS2 / GCS' },
    { name:'DRIVING',     level:0.85, x:0.22, y:0.72, detail:'CERAD L3 / PCV D1 / Cat C' },
    { name:'TRAINING',    level:0.92, x:0.18, y:0.35, detail:'CTLLS L4 / 208+ Learners' }
  ];
  let t3 = 0;
  function drawHEMS() {
    ctx.clearRect(0,0,W,H); t3 += 0.008;
    // Dark background
    ctx.fillStyle='#030c06'; ctx.fillRect(0,0,W,H);
    // HEMS scope rings
    let cx=W/2, cy=H/2;
    [0.45,0.38,0.3,0.2,0.1].forEach(function(f){
      ctx.beginPath(); ctx.arc(cx,cy,Math.min(W,H)*f,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,200,80,'+(0.04+f*0.08)+')'; ctx.lineWidth=1; ctx.stroke();
    });
    // Crosshairs
    ctx.strokeStyle='rgba(0,200,80,0.1)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    // Sweep
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(t3);
    let beam=ctx.createLinearGradient(0,0,Math.min(W,H)*0.48,0);
    beam.addColorStop(0,'rgba(0,255,100,0.18)');
    beam.addColorStop(0.5,'rgba(0,200,80,0.06)');
    beam.addColorStop(1,'transparent');
    ctx.fillStyle=beam;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,Math.min(W,H)*0.48,-0.25,0.25); ctx.fill();
    ctx.restore();
    // Skill nodes
    skills2.forEach(function(s){
      let nx=s.x*W, ny=s.y*H;
      let pulse=(Math.sin(t3*3+s.x*6)*0.3+0.7)*s.level;
      ctx.beginPath(); ctx.arc(nx,ny,8*pulse,0,Math.PI*2);
      ctx.fillStyle='rgba(0,220,80,'+pulse*0.8+')'; ctx.fill();
      ctx.beginPath(); ctx.arc(nx,ny,14*pulse,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,200,80,'+(pulse*0.4)+')'; ctx.lineWidth=1; ctx.stroke();
      // Bar
      let bw=80, bh=4, bx=nx-bw/2, by=ny+18;
      ctx.fillStyle='rgba(0,80,30,0.5)'; ctx.fillRect(bx,by,bw,bh);
      ctx.fillStyle='rgba(0,200,80,0.8)'; ctx.fillRect(bx,by,bw*s.level,bh);
      // Label
      ctx.fillStyle='rgba(0,255,100,0.9)';
      ctx.font='bold 9px JetBrains Mono,monospace';
      ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText(s.name, nx, by+8);
      ctx.fillStyle='rgba(0,200,80,0.45)';
      ctx.font='8px DM Sans,sans-serif';
      ctx.fillText(s.detail, nx, by+20);
    });
    // Centre target
    ctx.beginPath(); ctx.arc(cx,cy,12,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,255,100,0.6)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2);
    ctx.fillStyle='rgba(0,255,100,0.8)'; ctx.fill();
    requestAnimationFrame(drawHEMS);
  }
  drawHEMS();
}

/* ── COVERAGE MAP ─────────────────────────────────────────────────────────── */
function initCoverageMap() {
  let c = document.getElementById('coverage-canvas');
  if (!c) return;
  c.width = c.offsetWidth || 600; c.height = 320;
  let ctx = c.getContext('2d');
  let W=c.width, H=c.height;
  // HEMS-style aerial scope for coverage map
  let locations = [
    { name:'Blackburn (Base)', x:0.45, y:0.42, primary:true },
    { name:'Heysham NPP', x:0.28, y:0.22, primary:true },
    { name:'Aintree Racecourse', x:0.32, y:0.72, primary:true },
    { name:'DW Stadium, Wigan', x:0.52, y:0.68, primary:true },
    { name:'Mill Farm, Fylde', x:0.22, y:0.45, primary:true },
    { name:'Darwen', x:0.48, y:0.38, primary:true },
    { name:'Blackpool', x:0.18, y:0.32, primary:false },
    { name:'Manchester', x:0.65, y:0.60, primary:false },
    { name:'Preston', x:0.36, y:0.35, primary:false },
    { name:'Leeds', x:0.82, y:0.38, primary:false }
  ];
  let t4=0;
  function drawMap(){
    ctx.clearRect(0,0,W,H); t4+=0.006;
    // HEMS scope background
    ctx.fillStyle='#030c06'; ctx.fillRect(0,0,W,H);
    // Grid
    ctx.strokeStyle='rgba(0,107,63,0.06)'; ctx.lineWidth=1;
    for(let x=0;x<W;x+=30){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for(let y=0;y<H;y+=30){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    // Scope rings from base
    let bx=0.45*W, by=0.42*H;
    [0.55,0.45,0.33,0.2].forEach(function(r){
      ctx.beginPath(); ctx.arc(bx,by,r*Math.min(W,H),0,Math.PI*2);
      ctx.strokeStyle='rgba(0,150,80,0.08)'; ctx.lineWidth=1; ctx.stroke();
    });
    // Sweep
    ctx.save(); ctx.translate(bx,by); ctx.rotate(t4);
    let beam2=ctx.createLinearGradient(0,0,W*0.6,0);
    beam2.addColorStop(0,'rgba(0,200,80,0.12)');
    beam2.addColorStop(0.5,'rgba(0,150,60,0.04)');
    beam2.addColorStop(1,'transparent');
    ctx.fillStyle=beam2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,W*0.6,-0.2,0.2); ctx.fill();
    ctx.restore();
    // Location pins
    locations.forEach(function(loc){
      let lx=loc.x*W, ly=loc.y*H;
      let pulse=(Math.sin(t4*2+loc.x*5)*0.2+0.8);
      // Connection line to base
      if(!loc.primary||loc.name!=='Blackburn (Base)'){
        ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(lx,ly);
        ctx.strokeStyle='rgba(0,150,60,'+(loc.primary?0.15:0.06)+')'; ctx.lineWidth=1; ctx.stroke();
      }
      // Pin dot
      let dotSize = loc.primary ? 7 : 4;
      ctx.beginPath(); ctx.arc(lx,ly,dotSize*pulse,0,Math.PI*2);
      ctx.fillStyle=loc.primary?'rgba(0,220,80,0.85)':'rgba(0,150,60,0.4)'; ctx.fill();
      if(loc.primary){
        ctx.beginPath(); ctx.arc(lx,ly,14*pulse,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,200,80,0.3)'; ctx.lineWidth=1; ctx.stroke();
      }
      // Label
      ctx.fillStyle=loc.primary?'rgba(0,255,100,0.9)':'rgba(0,180,70,0.5)';
      ctx.font=(loc.primary?'bold ':'')+'9px JetBrains Mono,monospace';
      ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillText(loc.name, lx+12, ly);
    });
    requestAnimationFrame(drawMap);
  }
  drawMap();
}

/* ── QUALS PAGE ───────────────────────────────────────────────────────────── */
function renderCertDash() {
  let grid = document.getElementById('cert-dash-grid');
  if (!grid) return;
  let certs = [
    { label:'FREC 3', sub:'Emergency Care', status:'CURRENT', colour:'#00A651', icon:'\u2665' },
    { label:'FREC 4', sub:'In Progress', status:'PROGRESS', colour:'#FFD700', icon:'\u2b50' },
    { label:'CTLLS L4', sub:'Teaching', status:'ACHIEVED', colour:'#1A3A5C', icon:'\ud83c\udf93' },
    { label:'CERAD L3', sub:'Blue Light', status:'CURRENT', colour:'#B8860B', icon:'\ud83d\ude93' },
    { label:'PCV / D1', sub:'Large Vehicle', status:'CURRENT', colour:'#B8860B', icon:'\ud83d\ude8c' },
    { label:'Enhanced DBS', sub:'Disclosure', status:'CURRENT', colour:'#006B3F', icon:'\u2713' },
    { label:'AAVRA', sub:'Assessor', status:'CURRENT', colour:'#1A3A5C', icon:'\ud83d\udcdd' },
    { label:'Comm. Commend.', sub:'2025 + 2026', status:'AWARDED', colour:'#FFD700', icon:'\u2605' }
  ];
  let colours = { CURRENT:'rgba(0,107,63,0.15)', PROGRESS:'rgba(184,134,11,0.15)', ACHIEVED:'rgba(26,58,92,0.15)', AWARDED:'rgba(184,134,11,0.2)' };
  let textC = { CURRENT:'#00A651', PROGRESS:'#FFD700', ACHIEVED:'#a0c0e0', AWARDED:'#FFD700' };
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:2px;margin-bottom:24px';
  grid.innerHTML = certs.map(function(cert){
    return '<div style="background:'+colours[cert.status]+';border:1px solid '+cert.colour+'44;padding:16px 12px;text-align:center;position:relative">' +
      '<div style="font-size:24px;margin-bottom:6px">'+cert.icon+'</div>' +
      '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:16px;letter-spacing:1px;color:#fff;margin-bottom:2px">'+cert.label+'</div>' +
      '<div style="font-size:10px;color:rgba(255,255,255,.70);margin-bottom:6px">'+cert.sub+'</div>' +
      '<div style="font-size:8px;letter-spacing:2px;color:'+textC[cert.status]+';font-family:JetBrains Mono,monospace">'+cert.status+'</div>' +
      '<div style="position:absolute;top:0;left:0;right:0;height:3px;background:'+cert.colour+'"></div>' +
      '</div>';
  }).join('');
}


function renderMedsGrid() {
  let grid = document.getElementById('meds-grid');
  if (!grid) return;
  let classColour = { P:'rgba(192,57,43,0.15)', G:'rgba(0,107,63,0.1)', O:'rgba(26,58,92,0.12)' };
  let classBorder = { P:'rgba(192,57,43,0.4)', G:'rgba(0,107,63,0.3)', O:'rgba(26,58,92,0.3)' };
  let classLabel = { P:'PGD / P-only', G:'GSL', O:'Patient Own' };
  grid.innerHTML = MEDS.map(function(m,i){
    return '<div style="background:'+classColour[m.class]+';border:1px solid '+classBorder[m.class]+';padding:12px;position:relative">' +
      '<div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px">'+m.name+'</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:6px">'+m.note+'</div>' +
      '<div style="font-size:8px;letter-spacing:1px;color:'+classBorder[m.class].replace('0.','0.8')+';font-family:monospace">'+classLabel[m.class]+'</div>' +
      '<div style="position:absolute;top:0;left:0;width:3px;height:100%;background:'+classBorder[m.class].replace('0.4','0.7')+'"></div>' +
      '</div>';
  }).join('');
}

/* ── SR OBSERVER ──────────────────────────────────────────────────────────── */
let _srObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('visible');
      _srObserver.unobserve(e.target);
    }
  });
}, { threshold:0.1 });
document.querySelectorAll('.sr-item,.sr-item-left,.sr-item-right').forEach(function(el){
  _srObserver.observe(el);
});

/* ── CONTACT FORM ─────────────────────────────────────────────────────────── */
(function(){
  let form = document.getElementById('cForm');
  if (!form) return;
  // Formspree connection: https://formspree.io/f/xnjgpdjr — works when hosted

  let intents = {
    cover: {
      heading: 'Event Medical Cover',
      wa: 'https://wa.me/447756831072?text=Hi%20Peter%2C%20I%27m%20looking%20for%20EAC-level%20medical%20cover%20for%20an%20event%20in%20%5Blocation%5D%20on%20%5Bdate%5D%20for%20approximately%20%5BX%5D%20attendees.',
      msg: "Hi Peter, I'm looking for EAC-level medical cover for an event in [location] on [date] for approximately [X] attendees.",
      btn: 'Request Event Cover \u2192',
      type: 'Event medical cover'
    },
    training: {
      heading: 'First Aid Training',
      wa: 'https://wa.me/447756831072?text=Hi%20Peter%2C%20I%27m%20looking%20for%20first%20aid%20training%20for%20%5Bgroup%20or%20company%5D%20%E2%80%94%20can%20we%20talk%20through%20options%3F',
      msg: "Hi Peter, I'm looking for first aid training for [group or company] \u2014 can we talk through options?",
      btn: 'Book Training \u2192',
      type: 'First aid training'
    },
    employment: {
      heading: 'Employment Enquiry',
      wa: 'https://wa.me/447756831072?text=Hi%20Peter%2C%20I%20came%20across%20your%20profile%20and%20wanted%20to%20discuss%20a%20potential%20opportunity.',
      msg: "Hi Peter, I came across your profile and I\u2019d like to discuss a potential opportunity \u2014 [your name, organisation, role].",
      btn: 'Start Conversation \u2192',
      type: 'Recruitment / employment'
    }
  };

  window.cIntent = function(key, el) {
    document.querySelectorAll('.intent-card').forEach(function(c){ c.classList.remove('ic-active'); });
    el.classList.add('ic-active');
    let d = intents[key];
    let heading = document.getElementById('c-heading');
    let wa = document.getElementById('c-wa');
    let fm = document.getElementById('fm');
    let btn = document.getElementById('c-btn');
    let type = document.getElementById('c-type');
    if (heading) heading.textContent = d.heading;
    if (wa) wa.href = d.wa;
    if (fm && !fm.dataset.edited) fm.value = d.msg;
    if (btn) btn.textContent = d.btn;
    if (type) type.value = d.type;
  };

  // Mark textarea as manually edited so intent switch won't overwrite user's text
  let fm = document.getElementById('fm');
  if (fm) fm.addEventListener('input', function(){ fm.dataset.edited = '1'; });

  function showFieldError(fieldId, msgId){
    let f=document.getElementById(fieldId); if(f) f.style.borderColor='var(--red)';
    let m=document.getElementById(msgId); if(m) m.style.display='block';
  }
  function clearErrors(){
    form.querySelectorAll('input,textarea').forEach(function(f){ f.style.borderColor=''; });
    form.querySelectorAll('.err-msg').forEach(function(m){ m.style.display='none'; });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    clearErrors();
    let fn=document.getElementById('fn'), fe=document.getElementById('fe');
    let valid=true;
    if(!fn||!fn.value.trim()){ showFieldError('fn','e-name'); valid=false; }
    if(!fe||!fe.value.trim()||fe.value.indexOf('@')<1){ showFieldError('fe','e-email'); valid=false; }
    if(!valid) return;
    let btn=document.getElementById('c-btn');
    let orig=btn?btn.textContent:'';
    if(btn){ btn.textContent='Sending\u2026'; btn.disabled=true; }
    fetch(form.getAttribute('action'),{
      method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}
    }).then(function(res){
      if(res.ok){
        let ps=document.getElementById('post-send');
        if(ps) ps.classList.add('ps-show');
        if(btn) btn.style.display='none';
        form.querySelectorAll('input,textarea').forEach(function(f){ f.disabled=true; });
      } else {
        if(btn){ btn.textContent=orig; btn.disabled=false; }
        alert('There was a problem sending your message. Please WhatsApp or email peter.craine@me.com directly.');
      }
    }).catch(function(){
      if(btn){ btn.textContent=orig; btn.disabled=false; }
      alert('Connection error. Please WhatsApp or email peter.craine@me.com directly.');
    });
  });
})();

/* ── PRINT CREDENTIALS ────────────────────────────────────────────────────── */
function printCredentials(){
  window.print();
}

/* ── VCARD / SIGNATURE ────────────────────────────────────────────────────── */
function doVcard(){
  let v=['BEGIN:VCARD','VERSION:3.0','N:Craine;Peter;;;','FN:Peter Craine',
    'TITLE:Emergency Ambulance Crew / Network Lead','ORG:St John Ambulance North West',
    'TEL;TYPE=CELL:07756831072','EMAIL:peter.craine@me.com','URL:https://petercrainemedic.co.uk',
    'END:VCARD'].join('\r\n');
  let b=new Blob([v],{type:'text/vcard'});
  let a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='Peter_Craine.vcf'; a.click();
}
function doSig(){
  let s='Peter Craine | EAC \u00b7 FREC 3 \u00b7 Network Lead | 07756 831072 | peter.craine@me.com | petercrainemedic.co.uk';
  navigator.clipboard?navigator.clipboard.writeText(s).then(function(){ alert('Signature copied to clipboard'); }):alert(s);
}

function gotoContact(){ showPage('contact'); }

/* ── INIT ─────────────────────────────────────────────────────────────────── */
window.addEventListener('load', function(){
  _doShowPage('home');
  initHomeAnimations();
});
/* ═══════════════════════════════════════════════════════════
   SPECTACULAR 2026 ANIMATIONS
═══════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  function getCanvas(id) {
    let c = document.getElementById(id);
    if (!c) return null;
    let ctx = c.getContext('2d');
    function resize() { c.width = c.offsetWidth || (c.parentElement ? c.parentElement.offsetWidth : 800); c.height = c.offsetHeight || 300; }
    resize(); window.addEventListener('resize', resize);
    return { c:c, ctx:ctx, W:function(){ return c.width; }, H:function(){ return c.height; } };
  }

  function waitFor(id, fn, attempts) {
    attempts = attempts || 0; if (attempts > 40) return;
    let el = document.getElementById(id);
    if (el && el.offsetWidth > 0) { fn(el); }
    else { setTimeout(function(){ waitFor(id, fn, attempts+1); }, 100); }
  }

  /* HOME: BLUE LIGHTS */
  waitFor('hero-blue-lights', function() {
    let cv = getCanvas('hero-blue-lights');
    let cv2 = getCanvas('hero-siren-rings');
    if (!cv || !cv2) return;
    let blueAngle = 0, redAngle = 0, rings = [], lastRing = 0;

    function drawLights() {
      let ctx=cv.ctx, w=cv.W(), h=cv.H();
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle='rgba(0,0,10,0.04)'; ctx.fillRect(0,0,w,h);
      blueAngle += 0.014;   // blue rotates clockwise
      redAngle  -= 0.009;   // red rotates counter-clockwise, slower
      let lights = [
        { cx:w*0.28, cy:h*0.45, phase:0,          r:0,   g:100, b:255, angle:blueAngle },
        { cx:w*0.28, cy:h*0.45, phase:Math.PI,    r:0,   g:100, b:255, angle:blueAngle },
        { cx:w*0.32, cy:h*0.5,  phase:0.4,         r:255, g:0,   b:30,  angle:redAngle  },
        { cx:w*0.32, cy:h*0.5,  phase:Math.PI+0.4, r:255, g:0,   b:30,  angle:redAngle  }
      ];
      lights.forEach(function(l) {
        let beamLen = Math.max(w,h)*1.4, spread = Math.PI/10;
        ctx.save(); ctx.translate(l.cx,l.cy); ctx.rotate(l.angle+l.phase);
        let grd = ctx.createLinearGradient(0,0,beamLen,0);
        grd.addColorStop(0,'rgba('+l.r+','+l.g+','+l.b+',0.65)');
        grd.addColorStop(0.4,'rgba('+l.r+','+l.g+','+l.b+',0.22)');
        grd.addColorStop(1,'transparent');
        ctx.fillStyle=grd;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,beamLen,-spread,spread); ctx.fill();
        ctx.restore();
      });
      let ref=ctx.createLinearGradient(0,h*0.7,0,h);
      ref.addColorStop(0,'transparent'); ref.addColorStop(0.5,'rgba(0,50,200,0.06)'); ref.addColorStop(1,'transparent');
      ctx.fillStyle=ref; ctx.fillRect(0,h*0.7,w,h*0.3);
      requestAnimationFrame(drawLights);
    }

    function drawRings() {
      let ctx2=cv2.ctx, w=cv2.W(), h=cv2.H();
      ctx2.clearRect(0,0,w,h);
      let now=Date.now();
      if(now-lastRing>700){ rings.push({ r:0, a:0.5, color:rings.length%2===0?'0,100,255':'255,0,30' }); lastRing=now; }
      rings=rings.filter(function(r){ return r.a>0.01; });
      rings.forEach(function(ring){
        ring.r+=3.5; ring.a*=0.975;
        ctx2.beginPath(); ctx2.arc(w*0.3,h*0.5,ring.r,0,Math.PI*2);
        ctx2.strokeStyle='rgba('+ring.color+','+ring.a+')'; ctx2.lineWidth=1.5; ctx2.stroke();
      });
      requestAnimationFrame(drawRings);
    }
    drawLights(); drawRings();
  });

  /* ABOUT: MAGNETIC FIELD */
  waitFor('about-mag-canvas', function() {
    let cv = getCanvas('about-mag-canvas');
    if (!cv) return;
    let mx=cv.W()*0.5, my=cv.H()*0.5;
    let lines=[];
    for(let i=0;i<250;i++) lines.push({ x:Math.random()*1600, y:Math.random()*400, vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3 });
    cv.c.addEventListener('mousemove',function(e){ let r=cv.c.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; });
    cv.c.parentElement && cv.c.parentElement.addEventListener('mousemove',function(e){ let r=cv.c.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; });
    function draw() {
      let ctx=cv.ctx, w=cv.W(), h=cv.H();
      ctx.fillStyle='rgba(10,15,12,0.06)'; ctx.fillRect(0,0,w,h);
      lines.forEach(function(l) {
        l.x+=l.vx; l.y+=l.vy;
        if(l.x<0)l.x=w; if(l.x>w)l.x=0; if(l.y<0)l.y=h; if(l.y>h)l.y=0;
        let dx=mx-l.x, dy=my-l.y, d=Math.sqrt(dx*dx+dy*dy);
        let angle=Math.atan2(dy,dx), len=Math.min(28,1800/Math.max(d,1)), alpha=Math.min(0.5,160/Math.max(d,1));
        ctx.beginPath(); ctx.moveTo(l.x,l.y); ctx.lineTo(l.x+Math.cos(angle)*len,l.y+Math.sin(angle)*len);
        ctx.strokeStyle='rgba(0,'+(130+Math.floor(d*0.05))+',60,'+alpha+')'; ctx.lineWidth=0.7; ctx.stroke();
      });
      requestAnimationFrame(draw);
    }
    draw();
  });

  /* SERVICES: MEDICAL DATA RAIN */
  waitFor('services-data-canvas', function() {
    let cv = getCanvas('services-data-canvas');
    if (!cv) return;
    let terms=['ADRENALINE','NALOXONE','SALBUTAMOL','FREC3','ATMIST','JESIP','ECG','PRF','NWAS','KED','TOURNIQUET','SPINAL','TRIAGE','START','CABCDE','NIBP','SPO2','GTN','ENTONOX','OPA','NPA','IGEL','BVM','CERAD','EAC','HEYSHAM','JESIP','EOD','HART','HAEMORRHAGE','32+','208+','19MEDS','FREC4','CTLLS','AAVRA','FAW','EFAW'];
    let cols=Math.max(1,Math.floor(cv.W()/14));
    let drops=[],termDrops=[];
    for(let i=0;i<cols;i++){ drops.push(Math.random()*-200); termDrops.push(terms[Math.floor(Math.random()*terms.length)]); }
    function draw() {
      let ctx=cv.ctx, w=cv.W(), h=cv.H();
      ctx.fillStyle='rgba(0,0,0,0.09)'; ctx.fillRect(0,0,w,h);
      ctx.font='10px JetBrains Mono,monospace';
      for(let i=0;i<drops.length;i++) {
        let term=termDrops[i], x=i*14, y=drops[i];
        ctx.fillStyle='rgba(0,200,80,'+(y>0?0.55:0.08)+')'; ctx.fillText(term.charAt(0)||'\u00b7',x,y);
        for(let j=1;j<Math.min(term.length,5);j++){
          ctx.fillStyle='rgba(0,160,60,'+(0.3*(1-j/5))+')'; ctx.fillText(term.charAt(j)||'\u00b7',x,y-j*12);
        }
        drops[i]+=11;
        if(drops[i]>h+80){ drops[i]=Math.random()*-150; termDrops[i]=terms[Math.floor(Math.random()*terms.length)]; }
      }
      requestAnimationFrame(draw);
    }
    draw();
  });

  /* QUALS: CT SCANNER */
  waitFor('quals-scan-canvas', function() {
    let cv=getCanvas('quals-scan-canvas'), beam=document.getElementById('quals-scan-beam');
    if(!cv) return;
    let scanY=0;
    function draw() {
      let ctx=cv.ctx, w=cv.W(), h=cv.H();
      ctx.fillStyle='rgba(0,0,0,0.07)'; ctx.fillRect(0,0,w,h);
      scanY=(scanY+1.8)%(h+60);
      if(beam) beam.style.top=scanY+'px';
      let gOpacity=Math.sin(scanY/Math.max(h,1)*Math.PI)*0.05;
      if(gOpacity>0){
        ctx.strokeStyle='rgba(0,200,100,'+gOpacity+')'; ctx.lineWidth=0.5;
        for(let x=0;x<w;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
        for(let y2=0;y2<h;y2+=30){ ctx.beginPath(); ctx.moveTo(0,y2); ctx.lineTo(w,y2); ctx.stroke(); }
        ctx.strokeStyle='rgba(0,220,100,'+(gOpacity*3)+')'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.ellipse(w/2,h/2,w*0.28,h*0.42,0,0,Math.PI*2); ctx.stroke();
      }
      let grd=ctx.createLinearGradient(0,scanY-40,0,scanY+40);
      grd.addColorStop(0,'transparent'); grd.addColorStop(0.35,'rgba(0,200,100,0.03)');
      grd.addColorStop(0.5,'rgba(0,255,120,0.12)'); grd.addColorStop(0.65,'rgba(0,200,100,0.03)'); grd.addColorStop(1,'transparent');
      ctx.fillStyle=grd; ctx.fillRect(0,scanY-40,w,80);
      requestAnimationFrame(draw);
    }
    draw();
  });

  /* CONTACT: SHOCKWAVE */
  waitFor('contact-shock-canvas', function() {
    let cv=getCanvas('contact-shock-canvas');
    if(!cv) return;
    let waves=[];
    function addWave(x,y){ waves.push({ x:x||cv.W()/2, y:y||cv.H()/2, r:0, a:0.7, w:3 }); }
    setInterval(function(){ addWave(cv.W()/2,cv.H()/2); }, 2200); addWave();
    cv.c.addEventListener('click',function(e){ let r=cv.c.getBoundingClientRect(); addWave(e.clientX-r.left,e.clientY-r.top); });
    function draw() {
      let ctx=cv.ctx, w=cv.W(), h=cv.H();
      ctx.fillStyle='rgba(10,15,12,0.09)'; ctx.fillRect(0,0,w,h);
      waves=waves.filter(function(wv){ return wv.a>0.01; });
      waves.forEach(function(wv){
        wv.r+=5; wv.a*=0.968; wv.w*=0.992;
        ctx.beginPath(); ctx.arc(wv.x,wv.y,wv.r,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,200,100,'+wv.a+')'; ctx.lineWidth=wv.w; ctx.stroke();
        if(wv.r>30){ ctx.beginPath(); ctx.arc(wv.x,wv.y,wv.r*0.6,0,Math.PI*2); ctx.strokeStyle='rgba(0,166,81,'+(wv.a*0.4)+')'; ctx.lineWidth=wv.w*0.5; ctx.stroke(); }
        if(wv.r<60){ let grd=ctx.createRadialGradient(wv.x,wv.y,0,wv.x,wv.y,60); grd.addColorStop(0,'rgba(0,200,100,'+(wv.a*0.12)+')'); grd.addColorStop(1,'transparent'); ctx.fillStyle=grd; ctx.fillRect(0,0,w,h); }
      });
      requestAnimationFrame(draw);
    }
    draw();
  });

  /* ABOUT H1 MAGNETIC GLOW */
  document.addEventListener('mousemove', function(e) {
    let h1=document.querySelector('#page-about .page-h1'); if(!h1) return;
    let r=h1.getBoundingClientRect(), dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
    let d=Math.sqrt(dx*dx+dy*dy), intensity=Math.max(0,1-d/300);
    h1.style.textShadow='0 0 '+(intensity*40)+'px rgba(0,200,100,'+(intensity*0.6)+')';
  });

})();
/* ═══════════════════════════════════════════════════════════
   NAV CANVAS: ECG TRACE + AMBULANCE
   AUDIO: HEARTBEAT (HB) + SIREN (SIREN)
═══════════════════════════════════════════════════════════ */

/* ── NAV ECG CANVAS — 6 RHYTHM SEQUENCE ─────────────────── */
(function(){
  let c = document.getElementById('nav-ecg-canvas');
  if(!c) return;
  let ctx = c.getContext('2d'); if(!ctx) return;

  let RHYTHM_NAMES = ['NSR 60bpm','AFib','V-Tach','PVC','A-Flutter','VFib'];
  let current = 0;
  let rhythmStart = Date.now();
  let DURATION = 30000;
  let off = 0;

  // Pseudo-random deterministic
  function rnd(s){ let x=Math.sin(s*127.1+311.7)*43758.5; return x-Math.floor(x); }

  function resize(){ c.width=c.offsetWidth||window.innerWidth; c.height=40; }
  resize(); window.addEventListener('resize',resize);

  /* ─ Rhythm 0: Normal Sinus Rhythm 60bpm ─ */
  function nsr(t){
    let T=72; t=((t%T)+T)%T;
    if(t>=13&&t<21) return Math.sin((t-13)/8*Math.PI)*3;  // P wave
    if(t>=24&&t<26) return -(t-24)*2;                      // Q
    if(t>=26&&t<28) return -4+(t-26)*10.5;                 // R up
    if(t>=28&&t<30) return 17-(t-28)*12;                   // R down
    if(t>=30&&t<32) return -7+(t-30)*3.5;                  // S return
    if(t>=34&&t<46) return Math.sin((t-34)/12*Math.PI)*5;  // T wave
    return 0;
  }

  /* ─ Rhythm 1: AFib — irregular, fibrillatory baseline, no P waves ─ */
  function afib(t){
    let fbase = Math.sin(t*0.9)*1.2 + Math.sin(t*2.1)*0.8 +
                (rnd(Math.floor(t*0.4)+7)-0.5)*2;  // fibrillatory baseline
    let period=44; let jitter=(rnd(Math.floor(t/period)+3)-0.5)*14;
    let qt=((t+jitter)%period+period)%period;
    let qrs=0;
    if(qt>=period-9&&qt<period-7) qrs=(qt-(period-9))*7;
    if(qt>=period-7&&qt<period-5) qrs=14-(qt-(period-7))*9;
    if(qt>=period-5&&qt<period-3) qrs=-4+(qt-(period-5))*2;
    return fbase+qrs;
  }

  /* ─ Rhythm 2: VTach — fast 180bpm, wide tombstone QRS, no P/T ─ */
  function vtach(t){
    let T=24; t=((t%T)+T)%T;
    if(t<2)  return 0;
    if(t<7)  return (t-2)*3.2;         // slow rise → +16
    if(t<13) return 16-(t-7)*2.67;     // slow fall → 0
    if(t<18) return -(t-13)*1.6;       // below baseline → -8
    if(t<24) return -8+(t-18)*1.33;    // return
    return 0;
  }

  /* ─ Rhythm 3: PVC — 3 normal beats then 1 wide inverted + pause ─ */
  function pvc(t){
    let total=360; t=((t%total)+total)%total;
    if(t<216) return nsr(t);           // 3 normal NSR beats
    let pt=t-216;                       // PVC beat
    if(pt<8)  return 0;
    if(pt<12) return -(pt-8)*4;        // sudden inverted drop
    if(pt<16) return -16+(pt-12)*5;    // spike back up
    if(pt<20) return 4+(pt-16)*3;      // overshoot +16
    if(pt<24) return 16-(pt-20)*4;     // return
    if(pt<30) return 0;
    // T wave inversion after PVC
    if(pt>=30&&pt<42) return -Math.sin((pt-30)/12*Math.PI)*4;
    return 0;                           // compensatory pause
  }

  /* ─ Rhythm 4: Atrial Flutter — sawtooth F-waves, regular QRS 2:1 ─ */
  function flutter(t){
    // Sawtooth F-waves at 300/min (period ~14px) between QRS
    let sawT=14; let sawt=((t%sawT)+sawT)%sawT;
    let fwave=((sawt/sawT)*(-4))+2;    // sawtooth -2 to +2
    // QRS every 56px (150 BPM at 2:1 block)
    let qT=56; let qt=((t%qT)+qT)%qT;
    let qrs=0;
    if(qt>=2&&qt<4)  qrs=-(qt-2)*2;
    if(qt>=4&&qt<6)  qrs=-4+(qt-4)*10;
    if(qt>=6&&qt<8)  qrs=16-(qt-6)*10;
    if(qt>=8&&qt<10) qrs=-4+(qt-8)*2;
    return fwave+qrs;
  }

  /* ─ Rhythm 5: VFib — chaotic, no identifiable waves ─ */
  function vfib(t){
    return (rnd(Math.floor(t*0.8)+19)-0.5)*18 +
           (rnd(Math.floor(t*1.5)+41)-0.5)*8 +
           Math.sin(t*0.31+rnd(Math.floor(t*0.2))*5)*5;
  }

  let rhythmFns = [nsr, afib, vtach, pvc, flutter, vfib];
  // HB intervals per rhythm (ms)
  let rhythmHBms = [1000, -1, 333, 1000, 400, 200];

  function getColour(r){
    if(r===5) return {main:'rgba(255,50,50,0.85)',glow:'rgba(255,50,50,0.2)'};   // VFib red
    if(r===2) return {main:'rgba(255,160,0,0.85)',glow:'rgba(255,160,0,0.2)'};   // VTach amber
    if(r===3) return {main:'rgba(255,210,0,0.8)',glow:'rgba(255,200,0,0.18)'};   // PVC yellow
    return     {main:'rgba(0,220,80,0.75)', glow:'rgba(0,200,70,0.15)'};         // green
  }

  function draw(){
    requestAnimationFrame(draw);

    // Rhythm change check
    let now=Date.now();
    if(now - rhythmStart >= DURATION){
      current=(current+1)%6;
      rhythmStart=now;
      // Update HB audio
      if(typeof HB!=='undefined'){
        clearTimeout(HB.timer);
        HB.currentRhythm = current;
        HB.beatInterval = rhythmHBms[current];
        HB.pvcCounter = 0;
        if(HB.running) HB.beat();
      }
    }

    resize();
    ctx.clearRect(0,0,c.width,c.height);
    off+=1.2;

    let W=c.width, H=c.height, mid=H/2;
    let fn=rhythmFns[current];
    let col=getColour(current);

    // Glow pass
    ctx.beginPath(); ctx.moveTo(0,mid);
    for(let x=0;x<W;x++) ctx.lineTo(x, mid-fn(x+off));
    ctx.strokeStyle=col.glow; ctx.lineWidth=5; ctx.stroke();

    // Main trace
    ctx.beginPath(); ctx.moveTo(0,mid);
    for(let x2=0;x2<W;x2++) ctx.lineTo(x2, mid-fn(x2+off));
    ctx.strokeStyle=col.main; ctx.lineWidth=1.5; ctx.stroke();

    // Centreline tick
    ctx.strokeStyle='rgba(0,180,60,0.08)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(0,mid); ctx.lineTo(W,mid); ctx.stroke();

    // Rhythm label
    ctx.fillStyle=col.main;
    ctx.font='8px JetBrains Mono,monospace';
    ctx.textAlign='right'; ctx.textBaseline='top';
    ctx.fillText(RHYTHM_NAMES[current], W-6, 2);
  }
  draw();
})();

/* ── NAV AMBULANCE IMAGE ANIMATION ──────────────────────── */
(function(){
  let svg = document.getElementById('nav-amb-svg');
  if(!svg) return;
  let navW = window.innerWidth || 1200;
  let x = -250, lastT = 0;
  window.addEventListener('resize', function(){ navW = window.innerWidth || navW; });
  function animate(t){
    let dt = t - lastT; lastT = t;
    x += dt * 0.07;
    if(x > navW + 250) x = -250;
    svg.style.left = Math.round(x) + 'px';
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

/* ── HEARTBEAT AUDIO
 ─────────────────────────────────────── */
// Proper cardiac lub-dub:
// LUB (S1): low frequency thump ~60-80Hz, mitral/tricuspid valve closure
// DUB (S2): slightly higher ~80-100Hz, aortic/pulmonary valve closure
// LUB is louder and longer; DUB is shorter and slightly higher
const HB={
  ctx:null, running:false, timer:null,
  beatInterval:1000,  // ms — updated by ECG rhythm
  pvcCounter:0,       // counts beats for PVC rhythm
  currentRhythm:0,    // mirrors ECG canvas rhythm index

  init:function(){
    if(this.ctx)return true;
    try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();return true;}
    catch(e){return false;}
  },

  thump:function(freq,vol,startTime,duration){
    let ac=this.ctx;
    let osc=ac.createOscillator(),g=ac.createGain(),dist=ac.createWaveShaper();
    let curve=new Float32Array(256);
    for(let i=0;i<256;i++){let x=i*2/256-1;curve[i]=x*(1+0.4*Math.abs(x));}
    dist.curve=curve;
    osc.connect(dist);dist.connect(g);g.connect(ac.destination);
    osc.type='sine';osc.frequency.setValueAtTime(freq,startTime);
    osc.frequency.exponentialRampToValueAtTime(freq*0.6,startTime+duration);
    g.gain.setValueAtTime(0,startTime);
    g.gain.linearRampToValueAtTime(vol,startTime+0.012);
    g.gain.exponentialRampToValueAtTime(0.001,startTime+duration);
    osc.start(startTime);osc.stop(startTime+duration);
  },

  beat:function(){
    if(!this.ctx||!this.running)return;
    let ac=this.ctx, now=ac.currentTime;
    let r=this.currentRhythm;
    let ms=this.beatInterval>0?this.beatInterval:1000;
    let self=this;

    if(r===0){
      // NSR 60bpm — proper lub-dub S1+S2
      this.thump(65,0.35,now,0.13);
      this.thump(85,0.20,now+0.16,0.09);
      ms=1000;
    } else if(r===1){
      // AFib — irregular, single light thump, variable rate
      this.thump(70,0.18,now,0.09);
      ms=350+Math.floor(Math.random()*220); // irregular 350-570ms
    } else if(r===2){
      // VTach 180bpm — rapid single firm thump
      this.thump(80,0.28,now,0.10);
      ms=333;
    } else if(r===3){
      // PVC — 3 normal beats then 1 LOUD PVC beat + compensatory pause
      this.pvcCounter=(this.pvcCounter||0)+1;
      if(this.pvcCounter%4===0){
        // PVC beat — loud wide thump
        this.thump(55,0.55,now,0.22);
        ms=2000; // compensatory pause
      } else {
        // Normal beat
        this.thump(65,0.30,now,0.12);
        this.thump(82,0.18,now+0.14,0.08);
        ms=1000;
      }
    } else if(r===4){
      // Atrial Flutter 150bpm — rapid regular thump
      this.thump(75,0.22,now,0.09);
      ms=400;
    } else if(r===5){
      // VFib — rapid erratic noise-like thuds, no pattern
      let vfFreq=90+Math.random()*60;
      let vfVol=0.08+Math.random()*0.18;
      this.thump(vfFreq,vfVol,now,0.06);
      ms=130+Math.floor(Math.random()*140); // 130-270ms erratic
    }

    this.timer=setTimeout(function(){self.beat();},ms);
  },

  start:function(){
    if(!this.init())return;
    if(this.ctx.state==='suspended')this.ctx.resume();
    this.running=true;this.beat();
    let el=document.getElementById('hb-sound-icon');
    if(el)el.textContent='\u2764';
  },
  stop:function(){
    this.running=false;clearTimeout(this.timer);
    let el=document.getElementById('hb-sound-icon');
    if(el)el.textContent='\ud83d\udd0a';
  }
};

function goToPost(idx){
  _doShowPage('journal');
  setTimeout(function(){ if(typeof openPost==='function') openPost(idx); },200);
}

function toggleHeartbeat(){if(HB.running)HB.stop();else HB.start();}


/* ── SIREN AUDIO ────────────────────────────────────────── */
// 1) 999_mode_activated.mp3 plays once
// 2) wail.mp3 loops continuously after
const SIREN={
  running:false, activateAudio:null, wailAudio:null,
  start:function(){
    this.running=true;
    if(!this.activateAudio){
      this.activateAudio=new Audio('999_mode_activated.mp3');
      this.activateAudio.volume=0.85;
    }
    if(!this.wailAudio){
      this.wailAudio=new Audio('wail.mp3');
      this.wailAudio.loop=true;
      this.wailAudio.volume=0.55;
    }
    let self=this;
    this.wailAudio.pause(); this.wailAudio.currentTime=0;
    this.activateAudio.pause(); this.activateAudio.currentTime=0;
    this.activateAudio.play().catch(function(){});
    this.activateAudio.onended=function(){
      if(self.running) self.wailAudio.play().catch(function(){});
    };
    let el=document.getElementById('siren-icon');
    if(el) el.textContent='\ud83d\udd34';
    document.body.classList.add('siren-active');
  },
  stop:function(){
    this.running=false;
    if(this.activateAudio){this.activateAudio.pause();this.activateAudio.currentTime=0;}
    if(this.wailAudio){this.wailAudio.pause();this.wailAudio.currentTime=0;}
    let el=document.getElementById('siren-icon');
    if(el) el.textContent='\ud83d\udea8';
    document.body.classList.remove('siren-active');
  }
};
function toggleSiren(){if(SIREN.running)SIREN.stop();else SIREN.start();}
/* ── GATED PAGE ACCESS SYSTEM ───────────────────────────── */
// Access codes — Peter changes these to whatever he wants.
// Approved users receive the code privately; they enter it once and stay logged in.
// TRAINER and MEDIC have separate codes so access can be granted independently.
// Each entry is an ARRAY — add each approved code as a new string in the list.
// Codes come from the Formspree email (each request generates a unique code).
// Format: trainer: ['A3B7-XD92', 'KM4N-QR85']  — quotes and comma between each.
const GATED_CODES = {
  trainer: ['TRAINER2026'],
  medic:   ['MEDIC2026']
};
// Helper: generate a unique 8-char code (used in the request form)
function _genCode() {
  let c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s='';
  for(let i=0;i<8;i++){ if(i===4)s+='-'; s+=c[Math.floor(Math.random()*c.length)]; }
  return s;
}

let _gatedTarget = null;

function showGated(page) {
  // Check if already have access
  if(localStorage.getItem('access_' + page) === 'granted') {
    _doShowPage(page);
    return;
  }
  _gatedTarget = page;
  let titles = { trainer:'Hire Me as a Trainer', medic:'Hire Me as an Event Medic' };
  let icons  = { trainer:'&#127979;', medic:'&#128657;' };
  let el = function(id){ return document.getElementById(id); };
  if(el('modal-title'))  el('modal-title').innerHTML  = titles[page] || 'Restricted Access';
  if(el('modal-icon'))   el('modal-icon').innerHTML   = icons[page]  || '&#128274;';
  if(el('modal-sub'))    el('modal-sub').textContent  = 'Apply for access or enter your access code';
  if(el('request-type')) el('request-type').value = 'Access Request — ' + (page==='trainer'?'Trainer Page':'Medic Page');
  document.getElementById('access-overlay').classList.add('open');
  // Reset UI
  switchAccessTab('request', document.querySelector('.access-tab'));
  el('code-input') && (el('code-input').value='');
  el('code-msg')   && (el('code-msg').style.display='none');
  el('request-msg')&& (el('request-msg').style.display='none');
}

function closeAccessModal() {
  document.getElementById('access-overlay').classList.remove('open');
}

function switchAccessTab(tab, btn) {
  document.querySelectorAll('.access-tab').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.access-panel').forEach(function(p){ p.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  let panel = document.getElementById('panel-' + tab);
  if(panel) panel.classList.add('active');
}

function verifyCode() {
  let raw   = (document.getElementById('code-input').value || '').trim().toUpperCase().replace(/[\s\-]/g,'');
  let list  = (GATED_CODES[_gatedTarget] || []).map(function(c){ return c.trim().toUpperCase().replace(/[\s\-]/g,''); });
  let msgEl = document.getElementById('code-msg');
  if(!raw) {
    msgEl.textContent = 'Please enter your access code.';
    msgEl.className = 'access-msg err'; msgEl.style.display='block'; return;
  }
  if(list.indexOf(raw) !== -1) {
    localStorage.setItem('access_' + _gatedTarget, 'granted');
    msgEl.textContent = 'Access granted. Opening page\u2026';
    msgEl.className = 'access-msg ok'; msgEl.style.display='block';
    setTimeout(function(){
      closeAccessModal();
      _doShowPage(_gatedTarget);
    }, 800);
  } else {
    msgEl.textContent = 'Code not recognised \u2014 check for typos, or request access via the other tab.';
    msgEl.className = 'access-msg err'; msgEl.style.display='block';
  }
}

function revokeAccess(page) {
  localStorage.removeItem('access_' + page);
  _doShowPage('home');
}

// Intent card selection
let _reqIntent = 'Not specified';
function selIntent(el, label) {
  document.querySelectorAll('.ic-card').forEach(function(c){ c.classList.remove('ic-sel'); });
  el.classList.add('ic-sel');
  _reqIntent = label;
  document.getElementById('req-intent').value = label;
}

// Handle access request form submission — generates unique code per request
(function(){
  let form = document.getElementById('access-request-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    let name  = (document.getElementById('req-name')  || {}).value || '';
    let email = (document.getElementById('req-email') || {}).value || '';
    let msgEl = document.getElementById('request-msg');
    if(!name.trim() || !email.trim()) {
      msgEl.textContent = 'Please fill in your name and email.';
      msgEl.className='access-msg err'; msgEl.style.display='block'; return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      msgEl.textContent = 'Please enter a valid email address.';
      msgEl.className='access-msg err'; msgEl.style.display='block'; return;
    }
    // Generate unique code and inject into form before sending
    let code = _genCode();
    let codeField = document.getElementById('req-code');
    if(codeField) codeField.value = code;
    let btn = form.querySelector('button[type=submit]');
    let orig = btn ? btn.textContent : '';
    if(btn){ btn.textContent='Sending\u2026'; btn.disabled=true; }
    fetch(form.getAttribute('action'), {
      method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}
    }).then(function(res){
      if(btn){ btn.textContent=orig; btn.disabled=false; }
      if(res.ok){
        msgEl.innerHTML = '\u2713 Request sent. Peter will review it and, if approved, email you your unique access code.<br><span style="font-size:11px;opacity:.65">Typically reviewed within 24\u202fhrs.</span>';
        msgEl.className='access-msg ok'; msgEl.style.display='block';
        form.reset();
        document.querySelectorAll('.ic-card').forEach(function(c){ c.classList.remove('ic-sel'); });
        _reqIntent = 'Not specified';
      } else {
        msgEl.textContent='There was a problem sending your request. Please email peter.craine@me.com directly.';
        msgEl.className='access-msg err'; msgEl.style.display='block';
      }
    }).catch(function(){
      if(btn){ btn.textContent=orig; btn.disabled=false; }
      msgEl.textContent='Connection error. Please email peter.craine@me.com directly.';
      msgEl.className='access-msg err'; msgEl.style.display='block';
    });
  });
})();

// Close modal on overlay background click
document.getElementById('access-overlay').addEventListener('click', function(e){
  if(e.target === this) closeAccessModal();
});
// Close on Escape
document.addEventListener('keydown', function(e){
  if(e.key==='Escape') closeAccessModal();
});

// Scope tab toggle
function setScopeTab(mode,btn){
  document.querySelectorAll('.scope-tab-btn').forEach(function(b){b.classList.remove('active')});
  btn.classList.add('active');
  let cv=document.getElementById('scope-clinical-view');
  let pv=document.getElementById('scope-plain-view');
  if(cv&&pv){cv.style.display=mode==='clinical'?'':'none';pv.style.display=mode==='plain'?'':'none';}
}
// Checklist toggle
function toggleChecklist(){
  let b=document.getElementById('cl-body');
  let i=document.getElementById('cl-icon');
  if(!b)return;
  b.classList.toggle('open');
  if(i)i.innerHTML=b.classList.contains('open')?'&#9650;':'&#9660;';
}
// Sticky strip
(function(){
  let strip=document.getElementById('sticky-event-strip');
  let dismissed=sessionStorage.getItem('stickyDismissed')==='1';
  if(!strip)return;
  function update(){
    if(dismissed)return;
    let onSvc=typeof currentPage!=='undefined'&&currentPage==='services';
    if(onSvc&&window.scrollY>280){strip.classList.add('visible');}
    else{strip.classList.remove('visible');}
  }
  window.addEventListener('scroll',update,{passive:true});
  document.addEventListener('pageChanged',function(e){
    setTimeout(update,120);
  });
  window.dismissSticky=function(){
    dismissed=true;strip.classList.remove('visible');
    sessionStorage.setItem('stickyDismissed','1');
  };
})();

/* ── TRAINER PAGE: COURSE DATA & RENDERER ────────────────── */
let TR_WA='447756831072', TR_EM='peter.craine@me.com';
function trWA(n){return 'https://wa.me/'+TR_WA+'?text='+encodeURIComponent('Hi Peter, I\'m interested in booking '+n+' and would like to discuss availability and dates. (Via petercrainemedic.co.uk)');}
function trEM(n){return 'mailto:'+TR_EM+'?subject='+encodeURIComponent('Training Enquiry: '+n)+'&body='+encodeURIComponent('Hi Peter,\n\nI\'m interested in booking '+n+'.\n\nNumber of delegates:\nPreferred date / flexibility:\nLocation (on-site or I can travel):\n\nThanks');}


function trRenderCards(arr, containerId) {
  let el=document.getElementById(containerId);
  if(!el) return;
  el.innerHTML='';
  arr.forEach(function(c,i){
    let id='trcc-'+containerId+'-'+i;
    let div=document.createElement('div');
    div.className='tr-cc'; div.id=id;
    div.innerHTML=
      `<div class="tr-cch" data-click="trTog" data-value="${id}">`
        +'<div>'
          +'<div class="tr-cn">'+c.n+'</div>'
          +'<div class="tr-cb">'+c.b+'</div>'
          +'<div class="tr-cm">'
            +'<span class="tr-mc tr-p">'+c.p+'</span>'
            +'<span class="tr-mc">\u23f1 '+c.d+'</span>'
            +'<span class="tr-mc">\ud83d\udc65 Max '+c.m+'</span>'
            +'<span class="tr-mc">'+c.t+'</span>'
          +'</div>'
        +'</div>'
        +'<div class="tr-ctog">+</div>'
      +'</div>'
      +'<div class="tr-cbody">'
        +'<p class="tr-cdt">'+c.dt+'</p>'
        +'<div class="tr-slbl">What you\'ll cover</div>'
        +'<ul class="tr-obj">'+c.o.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'
        +'<div class="tr-eqr">'
          +'<a class="tr-ewa" href="'+trWA(c.n)+'" target="_blank">\ud83d\udcac WhatsApp Enquiry</a>'
          +'<a class="tr-eem" href="'+trEM(c.n)+'">\u2709 Email Enquiry</a>'
        +'</div>'
      +'</div>';
    el.appendChild(div);
  });
}

function trRenderAddons() {
  let el=document.getElementById('tr-add');
  if(!el) return;
  let h='<div class="tr-slbl" style="margin-bottom:13px">One-tap enquiry \u2014 message pre-written for you</div>'
    +'<table class="tr-at"><thead><tr><th>Session</th><th>Duration</th><th>Max</th><th>Price</th><th></th></tr></thead><tbody>';
  TR_ADD.forEach(function(a){
    h+='<tr>'
      +'<td><div class="tr-an">'+a.n+'</div><div class="tr-ad">'+a.desc+'</div></td>'
      +'<td><span class="tr-adu">'+a.d+'</span></td>'
      +'<td><span class="tr-adu">'+a.m+'</span></td>'
      +'<td><span class="tr-ap">'+a.p+'</span></td>'
      +'<td><a class="tr-aeq" href="'+trWA(a.n)+'" target="_blank">Enquire \u2192</a></td>'
      +'</tr>';
  });
  h+='</tbody></table>';
  el.innerHTML=h;
}

function trTog(id){ let c=document.getElementById(id); if(c) c.classList.toggle('tr-exp'); }

function trTab(name,btn){
  document.querySelectorAll('.tr-ctab').forEach(function(b){b.classList.remove('tr-act');});
  if(btn) btn.classList.add('tr-act');
  let core=document.getElementById('tr-core');
  let spec=document.getElementById('tr-spec');
  let add =document.getElementById('tr-add');
  if(core) core.style.display=name==='core'?'flex':'none';
  if(spec) spec.style.display=name==='spec'?'flex':'none';
  if(add)  add.style.display =name==='add' ?'block':'none';
}

let _trHmap={
  wp:'\u2192 EFAW (1 day) or FAW (3-day) \u2014 start here',
  cx:'\u2192 First Aid at Work (FAW) \u2014 HSE-mandatory for high-risk sites',
  sc:'\u2192 Paediatric First Aid (full 2-day) + Anaphylaxis & Auto-Injector',
  sp:'\u2192 CPR & AED + Sports Injury Immediate Care',
  ch:'\u2192 Basic Life Support (Healthcare) + Safeguarding for Responders',
  od:'\u2192 Outdoor First Aid or Remote Area First Aid',
  se:'\u2192 Catastrophic Bleeding & Trauma + EFAW',
  vo:'\u2192 Volunteer Responder Induction + Event Medical Team Induction'
};
function trHelper(v){
  let r=document.getElementById('tr-hres');
  if(r) r.textContent=v?(_trHmap[v]||''):'';
}

// Initialise when page-trainer becomes visible
(function(){
  let _trInit=false;
  function trInit(){
    if(_trInit) return; _trInit=true;
    trRenderCards(TR_CORE,'tr-core');
    trRenderCards(TR_SPEC,'tr-spec');
    trRenderAddons();
  }
  // Hook into the existing _doShowPage function
  let _origDoShowPage = window._doShowPage;
  window._doShowPage = function(page){
    if(typeof _origDoShowPage==='function') _origDoShowPage(page);
    if(page==='trainer') trInit();
  };
  // Also init if localStorage already has access (page loads directly into trainer)
  if(localStorage.getItem('access_trainer')==='granted'){
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(trInit, 100); });
  }
})();
/* ── EVENT MEDICAL PAGE: DATA & RENDERER ───────────────────── */
let EM_WA='447756831072', EM_MAIL='peter.craine@me.com';
function emWA(t){return 'https://wa.me/'+EM_WA+'?text='+encodeURIComponent('Hi Peter, I\'m interested in '+t+' for my event. Could we discuss availability and requirements? (Via petercrainemedic.co.uk)');}
function emEM(t){return 'mailto:'+EM_MAIL+'?subject='+encodeURIComponent('Event Medical Enquiry: '+t)+'&body='+encodeURIComponent('Hi Peter,\n\nI\'m interested in '+t+'.\n\nEvent date:\nLocation:\nExpected attendance:\nEvent type:\n\nThanks');}


let EM_HMAP={
  fete:'\u2192 Package A \u2014 2 Basic First Aiders + AED + Gazebo',
  sports:'\u2192 Package B \u2014 Advanced cover with trauma kit and oxygen',
  festival:'\u2192 Package C \u2014 Full team + welfare + Medical Commander',
  corporate:'\u2192 Package A or B depending on risk level and attendance',
  school:'\u2192 Basic First Aider + Paediatric Kit \u2014 discuss with Peter',
  extreme:'\u2192 Package B/C + Outdoor Trauma Kit + Advanced Response Bag',
  overnight:'\u2192 Overnight Standby (\xa3300/night) + suitable equipment kit'
};

let EM_BMAP={
  'fete-u100':{rec:'Package A \u2014 Village Fete',sub:'2 Basic First Aiders, AED, basic kit, gazebo. Guide from \xa3760 for 6\u202fhrs.',wa:'Village+Fete+Package',em:'Village Fete Package'},
  'fete-100-500':{rec:'Package A (Enhanced)',sub:'2\u20133 Basic First Aiders, AED, radio kit. Consider adding a Medical Plan (\xa3275).',wa:'Community+Event+Medical+Cover',em:'Community Event Medical Cover'},
  'sports-u100':{rec:'Basic First Aider + Kit',sub:'Single Basic FA with sports pitch kit. From \xa335/hr. Enquire for your event duration.',wa:'Sports+First+Aid+Cover',em:'Sports First Aid Cover'},
  'sports-100-500':{rec:'Package B \u2014 Sports Event',sub:'2 Advanced FAs + 1 EMT role, trauma kit, oxygen, AED \xd72. Guide from \xa32,610 for 8\u202fhrs.',wa:'Sports+Event+Package',em:'Sports Event Package'},
  'sports-500-1500':{rec:'Package B+ with Medical Commander',sub:'Upgrade to Event Medical Commander (\xa3120/hr) as clinical lead. Custom quote required.',wa:'Sports+Event+Medical+Commander',em:'Sports Event Medical Commander'},
  'festival-500-1500':{rec:'Package C (adapted) + Medical Plan',sub:'Full team deployment. Medical Plan (\xa3275) and Medical Needs Assessment (\xa3425) recommended. Custom quote.',wa:'Festival+Medical+Cover',em:'Festival Medical Cover'},
  'festival-1500p':{rec:'Full Purple Guide Compliance Package',sub:'Multi-team deployment, ambulance, welfare, governance. Custom quote required. Contact Peter directly.',wa:'Large+Festival+Medical+Plan',em:'Large Festival Medical Plan'},
  'corporate-u100':{rec:'Single Basic or Advanced FA',sub:'Tailored to risk level of your event. From \xa335\u2013\xa360/hr. Enquire with event details.',wa:'Corporate+Event+Medical',em:'Corporate Event Medical Cover'},
  'overnight-u100':{rec:'Overnight Standby Medic',sub:'\xa3300/night. Full clinical kit, immediate response capability. Discuss duration and requirements.',wa:'Overnight+Standby+Medic',em:'Overnight Standby Medic'},
  'overnight-100-500':{rec:'Overnight Standby + Day Team',sub:'Overnight Medic plus daytime Advanced First Aiders. Custom quote based on event profile.',wa:'Multi-Day+Event+Medical',em:'Multi-Day Event Medical Cover'}
};

/* ─── RENDER FUNCTIONS ───────────────────── */
function emRenderStaff(){
  let el=document.getElementById('em-rate-grid');
  if(!el) return;
  EM_STAFF.forEach(function(s){
    let d=document.createElement('div');
    d.className='em-rc';
    d.innerHTML=
      '<div>'
        +'<div class="em-rc-role">'+s.role+'</div>'
        +'<div class="em-rc-qual">'+s.qual+'</div>'
        +'<div class="em-rc-desc">'+s.desc+'</div>'
        +'<div class="em-rc-tags">'+s.tags.map(function(t){return '<span class="em-rc-tag">'+t+'</span>';}).join('')+'</div>'
      +'</div>'
      +'<div style="text-align:right;flex-shrink:0">'
        +'<div class="em-rate">'+s.rate+'</div>'
        +'<div class="em-unit">'+s.unit+'</div>'
        +'<div class="em-eq-row">'
          +'<a class="em-ewa" href="'+emWA(s.role)+'" target="_blank">\ud83d\udcac WhatsApp</a>'
          +'<a class="em-eem" href="'+emEM(s.role)+'">\u2709 Email</a>'
        +'</div>'
      +'</div>';
    el.appendChild(d);
  });
}

function emRenderEq(){
  let el=document.getElementById('em-eq-body');
  if(!el) return;
  EM_EQ.forEach(function(cat){
    let sec=document.createElement('div');
    sec.className='em-eq-sec';
    sec.innerHTML='<div class="em-eq-title">'+cat.cat+'</div>';
    let grid=document.createElement('div');
    grid.className='em-eq-grid';
    cat.items.forEach(function(item){
      let it=document.createElement('div');
      it.className='em-eq-item';
      it.innerHTML=
        '<div>'
          +'<div class="em-eq-name">'+item.n+'</div>'
          +'<a class="em-eq-enq" href="'+emWA(item.n)+'" target="_blank">Enquire \u2192</a>'
        +'</div>'
        +'<div class="em-eq-price">'+item.p+'</div>';
      grid.appendChild(it);
    });
    sec.appendChild(grid);
    el.appendChild(sec);
  });
}

function emRenderPkgs(){
  let el=document.getElementById('em-pkg-grid');
  if(!el) return;
  EM_PKGS.forEach(function(p){
    let c=document.createElement('div');
    c.className='em-pkg'+(p.feat?' em-feat':'');
    let rows=p.rows.map(function(r){
      return '<div class="em-pkg-row"><span class="em-pkg-item">'+r.i+'</span><span class="em-pkg-val">'+r.v+'</span></div>';
    }).join('');
    c.innerHTML=
      '<div class="em-pkg-head">'
        +'<div class="em-pkg-tier">'+p.tier+'</div>'
        +'<div class="em-pkg-name">'+p.name+'</div>'
        +'<div class="em-pkg-sub">'+p.sub+'</div>'
      +'</div>'
      +'<div class="em-pkg-body">'+rows+'</div>'
      +'<div class="em-pkg-note">'+p.note+'</div>'
      +'<div class="em-pkg-total">'
        +'<span class="em-pkg-total-lbl">GUIDE TOTAL</span>'
        +'<span class="em-pkg-total-val">'+p.total+'</span>'
      +'</div>'
      +'<div class="em-pkg-cta">'
        +'<a class="em-ewa" href="'+emWA(p.name+' Package')+'" target="_blank">\ud83d\udcac Book This Package</a>'
        +'<a class="em-eem" href="'+emEM(p.name+' Package')+'">\u2709 Email</a>'
      +'</div>';
    el.appendChild(c);
  });
}

function emRenderWelfare(){
  let wg=document.getElementById('em-wlf-grid');
  let ob=document.getElementById('em-ops-body');
  if(wg){
    EM_WELFARE.forEach(function(w){
      let d=document.createElement('div');
      d.className='em-wlf-card';
      d.innerHTML=
        '<div class="em-wlf-name">'+w.n+'</div>'
        +'<div class="em-wlf-desc">'+w.desc+'</div>'
        +'<div style="display:flex;justify-content:space-between;align-items:center">'
          +'<span class="em-wlf-price">'+w.p+'</span>'
          +'<a class="em-eem" href="'+emWA(w.n)+'" target="_blank" style="font-size:9px;padding:4px 9px">Enquire</a>'
        +'</div>';
      wg.appendChild(d);
    });
  }
  if(ob){
    EM_OPS.forEach(function(o){
      let tr=document.createElement('tr');
      tr.innerHTML='<td>'+o.i+'</td><td><span class="em-ops-price">'+o.p+'</span></td><td>'+o.note+'</td>';
      ob.appendChild(tr);
    });
  }
}

function emTab(name,btn){
  document.querySelectorAll('.em-tab').forEach(function(b){b.classList.remove('em-act');});
  if(btn) btn.classList.add('em-act');
  ['svc','eq','pkg','wlf'].forEach(function(t){
    let el=document.getElementById('em-tab-'+t);
    if(el) el.style.display=t===name?'block':'none';
  });
}

function emHelper(v){
  let r=document.getElementById('em-hres');
  if(r) r.textContent=v?(EM_HMAP[v]||''):'';
}

function emBuild(){
  let t=(document.getElementById('em-b-type')||{}).value;
  let a=(document.getElementById('em-b-att')||{}).value;
  if(!t||!a) return;
  let key=t+'-'+a;
  let m=EM_BMAP[key];
  let el=document.getElementById('em-builder-result');
  if(!el) return;
  if(!m){
    document.getElementById('em-br-rec').textContent='Custom quote required';
    document.getElementById('em-br-sub').textContent='Your event combination is outside the standard packages. Peter will put together a tailored quote \u2014 typically within 24 hours.';
    document.getElementById('em-br-wa').href='https://wa.me/'+EM_WA+'?text='+encodeURIComponent('Hi Peter, I need a custom event medical quote. Event type: '+t+', Attendance: '+a+'. Can we discuss?');
    document.getElementById('em-br-em').href=emEM('Custom Event Medical Package');
  } else {
    document.getElementById('em-br-rec').textContent=m.rec;
    document.getElementById('em-br-sub').textContent=m.sub;
    document.getElementById('em-br-wa').href='https://wa.me/'+EM_WA+'?text=Hi+Peter,+I%27m+interested+in+'+m.wa+'.+Can+we+discuss+my+event%3F+(Via+petercrainemedic.co.uk)';
    document.getElementById('em-br-em').href=emEM(m.em);
  }
  el.style.display='block';
}

/* Init — triggered when page-medic becomes visible */
(function(){
  let _emInit=false;
  function emInit(){
    if(_emInit) return; _emInit=true;
    emRenderStaff(); emRenderEq(); emRenderPkgs(); emRenderWelfare();
  }
  let _origDoShow=window._doShowPage;
  window._doShowPage=function(page){
    if(typeof _origDoShow==='function') _origDoShow(page);
    if(page==='medic') emInit();
  };
  if(localStorage.getItem('access_medic')==='granted'){
    document.addEventListener('DOMContentLoaded',function(){ setTimeout(emInit,100); });
  }
})();

/* ── EVENT LISTENERS (REPLACING INLINE ONCLICK) ─────────────────────────── */
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-click]');
  if (!target) return;

  const action = target.getAttribute('data-click');
  const value = target.getAttribute('data-value');
  const value2 = target.getAttribute('data-value2');

  if (action === 'showPage') {
    e.preventDefault();
    showPage(value);
  } else if (action === 'showGated') {
    e.preventDefault();
    showGated(value);
  } else if (action === 'gotoContact') {
    e.preventDefault();
    gotoContact();
  } else if (action === 'toggleSiren') {
    toggleSiren();
  } else if (action === 'toggleHeartbeat') {
    toggleHeartbeat();
  } else if (action === 'toggleMenu') {
    toggleMenu();
  } else if (action === 'closeAccessModal') {
    closeAccessModal();
  } else if (action === 'switchAccessTab') {
    switchAccessTab(value, target);
  } else if (action === 'selIntent') {
    selIntent(target, value);
  } else if (action === 'verifyCode') {
    verifyCode();
  } else if (action === 'revokeAccess') {
    revokeAccess(value);
  } else if (action === 'trTab') {
    trTab(value, target);
  } else if (action === 'trHelper') {
    trHelper(value);
  } else if (action === 'emTab') {
    emTab(value, target);
  } else if (action === 'setScopeTab') {
    setScopeTab(value, target);
  } else if (action === 'toggleChecklist') {
    toggleChecklist();
  } else if (action === 'dismissSticky') {
    dismissSticky();
  } else if (action === 'filterPosts') {
    filterPosts(value, target);
  } else if (action === 'filterByTag') {
    filterByTag(value);
  } else if (action === 'openPost') {
    openPost(parseInt(value));
  } else if (action === 'goToPost') {
    goToPost(parseInt(value));
  } else if (action === 'closePost') {
    closePost();
  } else if (action === 'trTog') {
    trTog(value);
  } else if (action === 'printCredentials') {
    printCredentials();
  } else if (action === 'hideTicker') {
    document.getElementById('ticker').classList.add('hidden');
  } else if (action === 'cIntent') {
    cIntent(value, target);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const target = e.target.closest('[data-click]');
    if (!target) return;

    const action = target.getAttribute('data-click');
    const value = target.getAttribute('data-value');

    if (action === 'showPage') {
      showPage(value);
    } else if (action === 'showGated') {
      showGated(value);
    } else if (action === 'gotoContact') {
      gotoContact();
    }
  }
});
