/* ── JOURNAL POSTS ─────────────────────────────────────────────────────────── */








/* ── DEPLOYMENTS (for last-duty calculation) ──────────────────────────────── */


/* ── TICKER MESSAGES ──────────────────────────────────────────────────────── */


window.countDeployments = function() {
  let today = new Date(); today.setHours(0,0,0,0);
  return DEPLOYMENTS.filter(function(d){ return new Date(d) <= today; }).length;
}

;

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

})()

;

/* ═══════════════════════════════════════════════════════════
   NAV CANVAS: ECG TRACE + AMBULANCE
   AUDIO: HEARTBEAT (HB) + SIREN (SIREN)
═══════════════════════════════════════════════════════════ */

/* ── NAV ECG CANVAS -- 6 RHYTHM SEQUENCE ─────────────────── */
(function(){
  let c = document.getElementById('nav-ecg-canvas');
  if(!c) return;
  let ctx = c.getContext('2d'); if(!ctx) return;


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

  /* ─ Rhythm 1: AFib -- irregular, fibrillatory baseline, no P waves ─ */
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

  /* ─ Rhythm 2: VTach -- fast 180bpm, wide tombstone QRS, no P/T ─ */
  function vtach(t){
    let T=24; t=((t%T)+T)%T;
    if(t<2)  return 0;
    if(t<7)  return (t-2)*3.2;         // slow rise → +16
    if(t<13) return 16-(t-7)*2.67;     // slow fall → 0
    if(t<18) return -(t-13)*1.6;       // below baseline → -8
    if(t<24) return -8+(t-18)*1.33;    // return
    return 0;
  }

  /* ─ Rhythm 3: PVC -- 3 normal beats then 1 wide inverted + pause ─ */
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

  /* ─ Rhythm 4: Atrial Flutter -- sawtooth F-waves, regular QRS 2:1 ─ */
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

  /* ─ Rhythm 5: VFib -- chaotic, no identifiable waves ─ */
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
let HB={
  ctx:null, running:false, timer:null,
  beatInterval:1000,  // ms -- updated by ECG rhythm
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
      // NSR 60bpm -- proper lub-dub S1+S2
      this.thump(65,0.35,now,0.13);
      this.thump(85,0.20,now+0.16,0.09);
      ms=1000;
    } else if(r===1){
      // AFib -- irregular, single light thump, variable rate
      this.thump(70,0.18,now,0.09);
      ms=350+Math.floor(Math.random()*220); // irregular 350-570ms
    } else if(r===2){
      // VTach 180bpm -- rapid single firm thump
      this.thump(80,0.28,now,0.10);
      ms=333;
    } else if(r===3){
      // PVC -- 3 normal beats then 1 LOUD PVC beat + compensatory pause
      this.pvcCounter=(this.pvcCounter||0)+1;
      if(this.pvcCounter%4===0){
        // PVC beat -- loud wide thump
        this.thump(55,0.55,now,0.22);
        ms=2000; // compensatory pause
      } else {
        // Normal beat
        this.thump(65,0.30,now,0.12);
        this.thump(82,0.18,now+0.14,0.08);
        ms=1000;
      }
    } else if(r===4){
      // Atrial Flutter 150bpm -- rapid regular thump
      this.thump(75,0.22,now,0.09);
      ms=400;
    } else if(r===5){
      // VFib -- rapid erratic noise-like thuds, no pattern
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

window.goToPost = function(idx){
  _doShowPage('journal');
  setTimeout(function(){ if(typeof openPost==='function') openPost(idx); },200);
}

window.toggleHeartbeat = function(){if(HB.running)HB.stop();else HB.start();}


/* ── SIREN AUDIO ────────────────────────────────────────── */
// 1) 999_mode_activated.mp3 plays once
// 2) wail.mp3 loops continuously after
let SIREN={
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
window.toggleSiren = function(){if(SIREN.running)SIREN.stop();else SIREN.start();}

;

/* ── GATED PAGE ACCESS SYSTEM ───────────────────────────── */
// Access codes -- Peter changes these to whatever he wants.
// Approved users receive the code privately; they enter it once and stay logged in.
// TRAINER and MEDIC have separate codes so access can be granted independently.
// Each entry is an ARRAY -- add each approved code as a new string in the list.
// Codes come from the Formspree email (each request generates a unique code).
// Format: trainer: ['A3B7-XD92', 'KM4N-QR85']  -- quotes and comma between each.

// Helper: generate a unique 8-char code (used in the request form)
window._genCode = function() {
  let c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s='';
  for(let i=0;i<8;i++){ if(i===4)s+='-'; s+=c[Math.floor(Math.random()*c.length)]; }
  return s;
}

let _gatedTarget = null;

window.showGated = function(page) {
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
  if(el('request-type')) el('request-type').value = 'Access Request -- ' + (page==='trainer'?'Trainer Page':'Medic Page');
  document.getElementById('access-overlay').classList.add('open');
  // Reset UI
  switchAccessTab('request', document.querySelector('.access-tab'));
  el('code-input') && (el('code-input').value='');
  el('code-msg')   && (el('code-msg').style.display='none');
  el('request-msg')&& (el('request-msg').style.display='none');
}

window.closeAccessModal = function() {
  document.getElementById('access-overlay').classList.remove('open');
}

window.switchAccessTab = function(tab, btn) {
  document.querySelectorAll('.access-tab').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.access-panel').forEach(function(p){ p.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  let panel = document.getElementById('panel-' + tab);
  if(panel) panel.classList.add('active');
}

window.verifyCode = function() {
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

window.revokeAccess = function(page) {
  localStorage.removeItem('access_' + page);
  _doShowPage('home');
}

// Intent card selection
let _reqIntent = 'Not specified';
window.selIntent = function(el, label) {
  document.querySelectorAll('.ic-card').forEach(function(c){ c.classList.remove('ic-sel'); });
  el.classList.add('ic-sel');
  _reqIntent = label;
  document.getElementById('req-intent').value = label;
}

// Handle access request form submission -- generates unique code per request
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
window.setScopeTab = function(mode,btn){
  document.querySelectorAll('.scope-tab-btn').forEach(function(b){b.classList.remove('active')});
  btn.classList.add('active');
  let cv=document.getElementById('scope-clinical-view');
  let pv=document.getElementById('scope-plain-view');
  if(cv&&pv){cv.style.display=mode==='clinical'?'':'none';pv.style.display=mode==='plain'?'':'none';}
}
// Checklist toggle
window.toggleChecklist = function(){
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
})()

;

/* ── TRAINER PAGE: COURSE DATA & RENDERER ────────────────── */

window.trWA = function(n){return 'https://wa.me/'+TR_WA+'?text='+encodeURIComponent('Hi Peter, I\'m interested in booking '+n+' and would like to discuss availability and dates. (Via petercrainemedic.co.uk)');}
window.trEM = function(n){return 'mailto:'+TR_EM+'?subject='+encodeURIComponent('Training Enquiry: '+n)+'&body='+encodeURIComponent('Hi Peter,\n\nI\'m interested in booking '+n+'.\n\nNumber of delegates:\nPreferred date / flexibility:\nLocation (on-site or I can travel):\n\nThanks');}







window.trRenderCards = function(arr, containerId) {
  let el=document.getElementById(containerId);
  if(!el) return;
  el.innerHTML='';
  arr.forEach(function(c,i){
    let id='trcc-'+containerId+'-'+i;
    let div=document.createElement('div');
    div.className='tr-cc'; div.id=id;
    div.innerHTML=
      '<div class="tr-cch" onclick="trTog(\''+id+'\')">'
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

window.trRenderAddons = function() {
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

window.trTog = function(id){ let c=document.getElementById(id); if(c) c.classList.toggle('tr-exp'); }

window.trTab = function(name,btn){
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
window.trHelper = function(v){
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
})()

;

/* ── EVENT MEDICAL PAGE: DATA & RENDERER ───────────────────── */

window.emWA = function(t){return 'https://wa.me/'+EM_WA+'?text='+encodeURIComponent('Hi Peter, I\'m interested in '+t+' for my event. Could we discuss availability and requirements? (Via petercrainemedic.co.uk)');}
window.emEM = function(t){return 'mailto:'+EM_MAIL+'?subject='+encodeURIComponent('Event Medical Enquiry: '+t)+'&body='+encodeURIComponent('Hi Peter,\n\nI\'m interested in '+t+'.\n\nEvent date:\nLocation:\nExpected attendance:\nEvent type:\n\nThanks');}















/* ─── RENDER FUNCTIONS ───────────────────── */
window.emRenderStaff = function(){
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

window.emRenderEq = function(){
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

window.emRenderPkgs = function(){
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

window.emRenderWelfare = function(){
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

window.emTab = function(name,btn){
  document.querySelectorAll('.em-tab').forEach(function(b){b.classList.remove('em-act');});
  if(btn) btn.classList.add('em-act');
  ['svc','eq','pkg','wlf'].forEach(function(t){
    let el=document.getElementById('em-tab-'+t);
    if(el) el.style.display=t===name?'block':'none';
  });
}

window.emHelper = function(v){
  let r=document.getElementById('em-hres');
  if(r) r.textContent=v?(EM_HMAP[v]||''):'';
}

window.emBuild = function(){
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

/* Init -- triggered when page-medic becomes visible */
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
})()
;window.hideTicker = function() {
    const ticker = document.getElementById('ticker');
    if (ticker) ticker.classList.add('hidden');
};

document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-click]');
    if (!target) return;
    const action = target.getAttribute('data-click');
    const value = target.getAttribute('data-value');
    if (typeof window[action] === 'function') {
        if (value && value.includes(',')) {
            const args = value.split(',');
            if (args[1] === 'this') { window[action](args[0], target); }
            else { window[action](...args); }
        } else { window[action](value, target); }
        e.preventDefault();
    }
});
