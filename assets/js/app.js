/* ===== Nick Tyler Tattoo — The Drop · one-page site ===== */
(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const STILL = params.has('still');
if (STILL) document.body.classList.add('still');
let heroVisible = true;            // gates the hero canvases — paused when scrolled off-screen (mobile battery/perf)
let pageVisible = !document.hidden;
document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; }, {passive:true});
/* Both canvases composite every frame. Left running in a backgrounded tab they
   accumulate GPU work for nothing, so neither draws unless the page is actually
   on screen AND the hero is in view. */
const canAnimate = () => heroVisible && pageVisible;
const MOBILE = innerWidth < 700;

/* ---------- Catalog (real 35-design drop) ---------- */
/* [ imageId, title, cat, style, size, time, price, status ] — display No. = array order (index+1); imageId decoupled so reorders/splits never need file renames */
const CAT = [
  ['01','Serpent & Sigil Triptych','versatile','Any Placement','5–7 in','3–4 hr',500,'live'],
  ['02','Ornamental Crest','versatile','Any Placement','4–5 in','2–3 hr',500,'claimed'],
  ['03','Lotus Filigree','versatile','Any Placement','4–6 in','2–3 hr',500,'claimed'],
  ['04','Dotwork Diadem','versatile','Any Placement','4–5 in','2–3 hr',500,'live'],
  ['05','Veiled Mandala','versatile','Any Placement','5–6 in','3 hr',500,'live'],
  ['06b','Cathedral Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'live'],
  ['06a','Crescent Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'live'],
  ['07a','Vespers Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'live'],
  ['07b','Sanctuary Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'live'],
  ['08a','Lacework Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'claimed'],
  ['08b','Litany Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'claimed'],
  ['09','Cathedral Mandala','upper-back','Upper Back','Upper Back','4–6 hr',1200,'live'],
  ['10','Reliquary Mandala','upper-back','Upper Back','Upper Back','4–6 hr',1200,'live'],
  ['11','Sanctuary Spine','upper-back','Upper Back','Upper Back','4–6 hr',1200,'live'],
  ['12','Aria Spine Ornament','upper-back','Upper Back','Upper Back','4–6 hr',1200,'live'],
  ['13','Vesica Mandala','upper-back','Upper Back','Upper Back','4–6 hr',1200,'claimed'],
  ['14','Chapel Crown','upper-back','Upper Back','Upper Back','4–6 hr',1200,'live'],
  ['15','Vespers Mandala','full-back','Full Back','Full Back','2 sessions',2400,'live'],
  ['16','Compass Rose Ornament','full-back','Full Back','Full Back','2 sessions',2400,'live'],
  ['17','Lacework Halo','full-back','Full Back','Full Back','2 sessions',2400,'live'],
  ['18','Veiled Reliquary','full-back','Full Back','Full Back','2 sessions',2400,'claimed'],
  ['19','Liturgy Mandala','full-back','Full Back','Full Back','2 sessions',2400,'live'],
  ['20','Pendulum Drape','sternum','Sternum / Underboob','5–7 in','3–5 hr',625,'live'],
  ['21','Aura Drape','sternum','Sternum / Underboob','5–7 in','3–5 hr',625,'claimed'],
  ['22','Delicate Drape','sternum','Sternum / Underboob','6–8 in','3–5 hr',750,'live'],
  ['23','Lacework Drape','sternum','Sternum / Underboob','6–8 in','3–5 hr',750,'live'],
  ['24','Sanctuary Drape','sternum','Sternum / Underboob','5–7 in','4–5 hr',625,'feat'],
  ['25','Chandelier Cascade','sternum','Sternum / Underboob','7–9 in','3–5 hr',750,'live'],
  ['26','Diadem Cascade','sternum','Sternum / Underboob','5–7 in','3–5 hr',625,'live'],
  ['27','Ornamental Cascade','sternum','Sternum / Underboob','6–8 in','3–5 hr',750,'live'],
  ['28','Aria Sternum','sternum','Sternum / Underboob','5–7 in','3–5 hr',625,'live'],
  ['29','Blackwork Choker','sternum','Sternum / Underboob','7–9 in','2 sessions',750,'live'],
  ['30','Sunburst Sternum','sternum','Sternum / Underboob','5–7 in','3–5 hr',625,'claimed'],
  ['31','Lacework Ornament','sternum','Sternum / Underboob','6–8 in','3–5 hr',750,'live'],
  ['32','Reliquary Sternum','sternum','Sternum / Underboob','5–7 in','3–5 hr',625,'live'],
  ['33','Filigree Ornament','sternum','Sternum / Underboob','6–8 in','3–5 hr',750,'live'],
  ['34','Pendant Sternum','sternum','Sternum / Underboob','5–7 in','3–5 hr',625,'live'],
  ['35','Veiled Drape','sternum','Sternum / Underboob','6–8 in','3–5 hr',750,'live'],
].map((d, i) => ({
  n: i + 1, title: d[1], cat: d[2], style: d[3], size: d[4], time: d[5], price: d[6], status: d[7],
  /* root-absolute: this is the user-pages repo, so /assets/ resolves the same
     from /flash/, /custom/ and the apex domain */
  img: `/assets/flash/flash-${d[0]}.jpg`,            // full-res — lightbox only
  thumb: `/assets/flash/thumbs/flash-${d[0]}.jpg`,   // 480px — grid
  available: d[7] === 'live' || d[7] === 'feat'
}));
const money = n => '$' + n.toLocaleString();

/* ---------- Lead attribution / tracking layer ---------- */
const Track = (() => {
  const KEY = 'nt_attr';
  function attribution(){
    let a = {};
    try { a = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch(e){}
    if (!a.lead_id){
      a = {
        lead_id: 'NT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,6).toUpperCase(),
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || '',
        referrer: document.referrer || '',
        landing_page: location.href
      };
      try { sessionStorage.setItem(KEY, JSON.stringify(a)); } catch(e){}
    }
    return a;
  }
  const A = attribution();
  const FB_STD = { view_design:'ViewContent', claim_click:'AddToCart', booking_open:'InitiateCheckout', custom_form_open:'Lead' };
  function track(event, data = {}){
    const payload = { event, ...data, lead_id: A.lead_id, ts: new Date().toISOString() };
    window.dataLayer.push(payload);
    try { window.gtag('event', event, data); } catch(e){}
    try { window.fbq('trackCustom', event, data); if(FB_STD[event]) window.fbq('track', FB_STD[event], data); } catch(e){}
    console.log('%c[NT track] ' + event, 'color:#B8A98A', data);
  }
  return { attr: A, track };
})();
const track = Track.track;

/* ---------- Preloader ---------- */
function preloader(){
  const el = $('#preloader'), out = $('#preCount');
  let v = 0;
  const tick = () => {
    v += Math.max(1, Math.round((100 - v) / 8));
    if (v >= 100){ v = 100; out.textContent = v; finish(); return; }
    out.textContent = v;
    setTimeout(tick, 60);
  };
  const finish = () => setTimeout(() => {
    document.body.removeAttribute('data-loading');
    revealHero();
  }, 380);
  if (STILL){ out.textContent = 100; document.body.removeAttribute('data-loading'); revealHero(); return; }
  setTimeout(tick, 240);
}

/* ---------- Wordmark split + reveal ---------- */
function splitWordmark(){
  const wm = $('#wm'); const text = wm.textContent; wm.textContent = '';
  [...text].forEach(c => {
    if (c === ' '){ const s = document.createElement('span'); s.className = 'sp'; wm.appendChild(s); return; }
    const span = document.createElement('span'); span.className = 'ch'; span.textContent = c; wm.appendChild(span);
  });
}
function revealHero(){
  const chs = $$('#wm .ch');
  chs.forEach((ch, i) => {
    const d = 0.04 * i + 0.1;
    ch.style.transition = STILL ? 'none' : `opacity .8s var(--ease) ${d}s, transform .8s var(--ease) ${d}s`;
    requestAnimationFrame(() => { ch.style.opacity = '1'; ch.style.transform = 'none'; });
  });
}

/* ---------- Custom cursor ---------- */
function cursor(){
  if (STILL || matchMedia('(hover:none)').matches) { $('#cursor').style.display='none'; return; }
  const cur = $('#cursor'); let x = innerWidth/2, y = innerHeight/2, tx = x, ty = y;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, {passive:true});
  const loop = () => { x += (tx-x)*0.25; y += (ty-y)*0.25; cur.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
  loop();
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor]');
    cur.className = 'cursor' + (t ? ' is-' + t.dataset.cursor : '');
  });
}

/* ---------- Background ink particles ---------- */
function inkField(){
  const cv = $('#ink'), ctx = cv.getContext('2d');
  let w, h, dpr = Math.min(devicePixelRatio || 1, MOBILE ? 1.25 : 1.5), pts = [];
  const N = innerWidth < 700 ? 34 : 64;
  function size(){ w = cv.width = innerWidth*dpr; h = cv.height = innerHeight*dpr; cv.style.width = innerWidth+'px'; cv.style.height = innerHeight+'px'; }
  size(); addEventListener('resize', size, {passive:true});
  for (let i=0;i<N;i++) pts.push({x:Math.random()*1,y:Math.random()*1,r:(Math.random()*1.6+0.4)*dpr,vx:(Math.random()-.5)*0.00018,vy:(Math.random()-.5)*0.00018,a:Math.random()*0.4+0.1});
  function frame(){
    if(canAnimate()){
      ctx.clearRect(0,0,w,h);
      for (const p of pts){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
        ctx.beginPath(); ctx.arc(p.x*w,p.y*h,p.r,0,7); ctx.fillStyle=`rgba(184,169,138,${p.a})`; ctx.fill();
      }
    }
    if(!STILL) requestAnimationFrame(frame);
  }
  frame();
}

/* ---------- 3D sacred geometry hero: Flower of Life ---------- */
function emblem(){
  const cv = $('#emblem'), ctx = cv.getContext('2d');
  const stage = $('#emblemStage');
  let w, h, dpr = Math.min(devicePixelRatio || 1, MOBILE ? 1.3 : 1.6);
  function size(){ const r = stage.getBoundingClientRect(); w = cv.width = r.width*dpr; h = cv.height = r.height*dpr; cv.style.width=r.width+'px'; cv.style.height=r.height+'px'; }
  size(); addEventListener('resize', size, {passive:true});

  let mx=0, my=0, tmx=0, tmy=0;
  addEventListener('mousemove', e=>{ tmx=(e.clientX/innerWidth-0.5); tmy=(e.clientY/innerHeight-0.5); }, {passive:true});

  const M = 64;                              // points per ring outline

  const MR=1.36, MOFF=1.43, RINGS=[-MOFF/2, MOFF/2];   // interlocking-"OO" brand mark (nav proportions) — now the sole hero element
  function render(t){
    ctx.clearRect(0,0,w,h);
    const ox=w/2 + mx*w*0.05, oy=h*0.21;               // prominent crest above the name (centred would hide behind the wordmark)
    const scale=Math.min(w,h)*0.155, cam=4.6;
    ctx.lineJoin='round'; ctx.lineCap='round';

    // gentle 3D float
    const mspin=Math.sin(t*0.3)*0.34 + mx*0.55, mtilt=0.12+Math.sin(t*0.4)*0.11 + my*0.4;
    const mcy=Math.cos(mspin),msy=Math.sin(mspin),mcx=Math.cos(mtilt),msx=Math.sin(mtilt);
    const mtx=(px,py)=>{ const x=px*mcy,z=-px*msy,y=py; return [x, y*mcx-z*msx, y*msx+z*mcx]; };

    // soft glow behind the mark
    const halo=ctx.createRadialGradient(ox,oy,0, ox,oy,scale*2.4);
    halo.addColorStop(0,'rgba(184,169,138,0.26)'); halo.addColorStop(0.55,'rgba(184,169,138,0.07)'); halo.addColorStop(1,'rgba(184,169,138,0)');
    ctx.fillStyle=halo; ctx.fillRect(0,0,w,h);

    const gw=Math.max(2.6, Math.min(w,h)*0.015);
    const ringPath=(cx0)=>{ ctx.beginPath(); for(let k=0;k<=M;k++){ const ang=k/M*Math.PI*2; const p=mtx(cx0+MR*Math.cos(ang), MR*Math.sin(ang)); const s=cam/(cam+p[2]); const X=ox+p[0]*scale*s, Y=oy-p[1]*scale*s; k?ctx.lineTo(X,Y):ctx.moveTo(X,Y);} ctx.closePath(); };
    const grad=ctx.createLinearGradient(0, oy-scale*MR, 0, oy+scale*MR);
    grad.addColorStop(0,'#f6ecd8'); grad.addColorStop(0.5,'#c9a866'); grad.addColorStop(0.78,'#8a754d'); grad.addColorStop(1,'#54432c');
    const passes=[[2.4,'rgba(196,162,94,0.12)'], [1.05,'rgba(38,31,20,0.55)'], [0.78,grad], [0.24,'rgba(247,241,226,0.92)']];
    for(const pass of passes){
      ctx.lineWidth=gw*pass[0]; ctx.strokeStyle=pass[1];
      for(const r of RINGS){ ringPath(r); ctx.stroke(); }
    }
  }

  function loop(now){
    if(canAnimate()){
      const t=now/1000;
      mx+=(tmx-mx)*0.05; my+=(tmy-my)*0.05;
      render(t);
      const hp=Math.min(1, scrollY/(innerHeight*0.85));
      stage.style.opacity=(1-hp*0.95).toFixed(3);
      stage.style.setProperty('--epar', (-scrollY*0.08).toFixed(1)+'px');
      stage.style.transform=`translate(-50%,calc(-50% + var(--epar))) scale(${(1-hp*0.12).toFixed(3)})`;
    }
    if(!STILL) requestAnimationFrame(loop);
  }
  if(STILL){ mx=tmx; my=tmy; render(2.2); } else { requestAnimationFrame(loop); }
}

/* ---------- Marquee ---------- */
function marquee(){
  const track=$('#marquee');
  /* each page supplies its own beats on #marquee[data-beats], pipe-separated —
     the scarcity line only makes sense where designs are actually claimable */
  const DEFAULT_BEATS = "One-of-one|Once it's booked it's gone|Fine line · Ornamental · Floral · Blackwork · Geometric|Long Island, NY";
  const beats=(track.dataset.beats||DEFAULT_BEATS).split('|').filter(Boolean);
  const unit='<span>'+beats.join('<i>◆</i>')+'<i>◆</i></span>';
  track.innerHTML=unit;
  while(track.scrollWidth < innerWidth*2) track.innerHTML+=unit;
  let x=0, paused=false;
  track.parentElement.addEventListener('mouseenter',()=>paused=true);
  track.parentElement.addEventListener('mouseleave',()=>paused=false);
  const half=()=>track.scrollWidth/2;
  function loop(){ if(!paused){ x-=0.55; if(-x>=half()) x+=half(); track.style.transform=`translateX(${x}px)`; } if(!STILL) requestAnimationFrame(loop); }
  if(!STILL) requestAnimationFrame(loop);
}

/* ---------- Nav stuck ---------- */
function nav(){
  const n=$('#nav');
  const on=()=>n.classList.toggle('is-stuck', scrollY>40);
  on(); addEventListener('scroll',on,{passive:true});
  const cue=$('#scrollcue'), drop=$('#drop');
  if(cue&&drop) cue.addEventListener('click',()=>drop.scrollIntoView({behavior:'smooth'}));
}

/* ---------- Catalog render + filter ---------- */
const state={filter:'all',sort:'num',availOnly:false};
let current=[];   // currently displayed list (for lightbox nav)
function statusStamp(s){
  if(s==='feat') return '<span class="plate__stamp st-feat">★ Featured</span>';
  if(s==='claimed') return '<span class="plate__stamp st-claimed">Claimed</span>';
  return '<span class="plate__stamp st-live">● Live</span>';
}
function plateHTML(d){
  const gone=!d.available;
  return `<article class="plate${gone?' is-gone':''}${d.status==='feat'?' plate--feat':''}" data-n="${d.n}">
    <button class="plate__art" data-view="${d.n}" data-cursor="view" aria-label="View ${d.title}">
      <span class="plate__no">No. ${String(d.n).padStart(2,'0')}</span>${statusStamp(d.status)}
      <img src="${d.thumb}" alt="${d.title}, ${d.style} flash" loading="lazy" width="480" height="600">
    </button>
    <div class="plate__body">
      <div class="plate__name">${d.title}</div>
      <div class="plate__meta">${d.style}</div>
      <div class="plate__foot">
        <span class="plate__price${gone?' gone':''}">From ${money(d.price)}</span>
        ${gone ? `<span class="plate__claim" aria-disabled="true" style="opacity:.5">Claimed</span>`
               : `<button class="plate__claim" data-claim="${d.n}" data-cursor="link">Claim</button>`}
      </div>
    </div>
  </article>`;
}
function applyList(){
  let list=CAT.filter(d=>{
    if(state.filter!=='all' && d.cat!==state.filter) return false;
    if(state.availOnly && !d.available) return false;
    return true;
  });
  if(state.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  else if(state.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  else if(state.sort==='avail') list.sort((a,b)=>(b.available-a.available)||(a.n-b.n));
  else list.sort((a,b)=>a.n-b.n);
  current=list;
  const grid=$('#flashGrid');
  grid.innerHTML=list.map(plateHTML).join('');
  $('#noResults').hidden=list.length>0;
  observePlates();
}
function observePlates(){
  if(STILL){ $$('.plate').forEach(p=>p.classList.add('in')); return; }
  const io=new IntersectionObserver((es)=>{
    es.forEach((e,i)=>{ if(e.isIntersecting){ const el=e.target; const idx=$$('.plate').indexOf(el); el.style.transitionDelay=(Math.min(idx,8)*0.05)+'s'; el.classList.add('in'); io.unobserve(el); } });
  },{rootMargin:'0px 0px -8% 0px'});
  $$('.plate').forEach(p=>io.observe(p));
}
function countUp(el, to){
  if(STILL){ el.textContent=to; return; }
  let v=0; const step=()=>{ v+=Math.max(1,Math.round((to-v)/6)); if(v>=to){el.textContent=to;return;} el.textContent=v; setTimeout(step,40); }; step();
}
function catalog(){
  applyList();
  const avail=CAT.filter(d=>d.available).length;
  $('#navAvail').textContent=avail;
  if(STILL){ $('#availCount').textContent=avail; }
  else { const io=new IntersectionObserver((es)=>{ if(es[0].isIntersecting){ countUp($('#availCount'),avail); io.disconnect(); } }); io.observe($('#drop')); }
  $$('.filt').forEach(b=>b.addEventListener('click',()=>{
    $$('.filt').forEach(x=>{x.classList.remove('is-active');x.setAttribute('aria-selected','false');});
    b.classList.add('is-active'); b.setAttribute('aria-selected','true');
    state.filter=b.dataset.filter; applyList(); track('filter_change',{filter:state.filter});
  }));
  $('#sort').addEventListener('change',e=>{state.sort=e.target.value;applyList();});
  $('#availOnly').addEventListener('change',e=>{state.availOnly=e.target.checked;applyList();});
  // delegated clicks
  $('#flashGrid').addEventListener('click',e=>{
    const v=e.target.closest('[data-view]'); const c=e.target.closest('[data-claim]');
    if(c){ openBooking(+c.dataset.claim,'plate'); return; }
    if(v){ openLightbox(+v.dataset.view); }
  });
}

/* ---------- Lightbox ---------- */
let lbCurrent=null; let lastFocus=null;
function findDesign(n){ return CAT.find(d=>d.n===n); }
function openLightbox(n){
  const d=findDesign(n); if(!d) return; lbCurrent=n; lastFocus=document.activeElement;
  $('#lbImg').src=d.img; $('#lbImg').alt=d.title;
  $('#lbNo').textContent='No. '+String(d.n).padStart(2,'0')+(d.status==='feat'?' · Featured':'');
  $('#lbTitle').textContent=d.title;
  $('#lbPlace').textContent=d.style; $('#lbSize').textContent=d.size; $('#lbTime').textContent=d.time;
  /* Large-scale work is sized by the body part, not by inches — sleeves read
     "Single sleeve", backs repeat the placement verbatim. That row says nothing
     the one above it hasn't, so it only shows for a real measurement. */
  $('#lbSize').parentNode.hidden = !/\d/.test(d.size);
  $('#lbPrice').textContent='From '+money(d.price);
  const st=$('#lbStamp'); st.className='lb__stamp mono '+(d.available?(d.status==='feat'?'st-feat':'st-live'):'st-claimed');
  st.textContent=d.available?(d.status==='feat'?'★ Featured':'● Live'):'Claimed';
  const claim=$('#lbClaim');
  if(d.available){ claim.disabled=false; claim.textContent='Claim this design'; claim.style.display=''; }
  else { claim.style.display='none'; }
  $('#lbNote').textContent = d.available ? "One-of-one. $50 deposit reserves it, credited to your session." : 'This one has been claimed. Start a custom request for something similar.';
  const lb=$('#lightbox'); lb.hidden=false; requestAnimationFrame(()=>lb.classList.add('show'));
  $('#lbClose').focus();
  track('view_design',{design:d.title,no:d.n,status:d.status,price:d.price});
}
function closeLightbox(){ const lb=$('#lightbox'); lb.classList.remove('show'); setTimeout(()=>{lb.hidden=true; if(lastFocus)lastFocus.focus();},380); }
function stepLightbox(dir){
  const idx=current.findIndex(d=>d.n===lbCurrent); if(idx<0) return;
  const next=current[(idx+dir+current.length)%current.length]; openLightbox(next.n);
}
function lightbox(){
  $('#lbClose').addEventListener('click',closeLightbox);
  $('#lightbox').addEventListener('click',e=>{ if(e.target.id==='lightbox') closeLightbox(); });
  $('#lbPrev').addEventListener('click',()=>stepLightbox(-1));
  $('#lbNext').addEventListener('click',()=>stepLightbox(1));
  $('#lbClaim').addEventListener('click',()=>{ closeLightbox(); setTimeout(()=>openBooking(lbCurrent,'lightbox'),300); });
  $('#lbCustom').addEventListener('click',()=>{ const d=findDesign(lbCurrent); lastFocus=null; closeLightbox(); setTimeout(()=>goCustom(d),420); });
  addEventListener('keydown',e=>{
    if($('#lightbox').hidden) return;
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowLeft') stepLightbox(-1);
    if(e.key==='ArrowRight') stepLightbox(1);
  });
}

/* ---------- Booking (claim flow) — calendar opens immediately, no second click ---------- */
let bkDesign=null;
function bookingUrl(d){
  const base=window.NT_CONFIG.flashBooking;
  return base + (d?`?${window.NT_CONFIG.designParam}=${encodeURIComponent(d.title+' No. '+String(d.n).padStart(2,'0'))}`:'');
}
function openBooking(n,src){
  const d=findDesign(n); bkDesign=d;
  $('#bkChip').textContent = d ? `◆ ${d.title} · From ${money(d.price)}` : 'New booking';
  $('#bkTitle').textContent = d ? 'Claim ' + d.title : 'Reserve your slot';
  // load the calendar immediately, prefilled with the design — straight to date + deposit
  $('#bkFrame').innerHTML=`<iframe src="${bookingUrl(d)}" title="Booking calendar: pick a date and pay your deposit" loading="eager"></iframe>`;
  const bk=$('#booking'); bk.hidden=false; requestAnimationFrame(()=>bk.classList.add('show'));
  $('#bkClose').focus();
  track('claim_click',{design:d?d.title:'',no:d?d.n:'',price:d?d.price:'',source:src});
  track('booking_open',{design:d?d.title:'',no:d?d.n:''});
}
function closeBooking(){ const bk=$('#booking'); bk.classList.remove('show'); setTimeout(()=>{bk.hidden=true; $('#bkFrame').innerHTML='';},380); }
function booking(){
  $('#bkClose').addEventListener('click',closeBooking);
  $('#booking').addEventListener('click',e=>{ if(e.target.id==='booking') closeBooking(); });
  addEventListener('keydown',e=>{ if(!$('#booking').hidden && e.key==='Escape') closeBooking(); });
}

/* ---------- Custom form (GHL embed + attribution passthrough) ---------- */
const CFORM_ID = 'inline-3AkoAcnNx29uAvO2x7n3';
function customSrc(designLabel){
  const base = window.NT_CONFIG.customForm;
  const a = Track.attr;
  const q = new URLSearchParams();
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{ if(a[k]) q.set(k,a[k]); });
  if(a.lead_id) q.set('lead_id', a.lead_id);
  if(designLabel) q.set(window.NT_CONFIG.ideaParam, designLabel);   // prefill the "Describe your tattoo idea/vision" field
  const qs = q.toString();
  return base + (qs ? '?'+qs : '');
}
function setCustomIframe(designLabel){
  const f = document.getElementById(CFORM_ID);
  if(!f) return;
  const next = customSrc(designLabel);
  if(f.getAttribute('src') !== next) f.setAttribute('src', next);   // only reloads when params actually change
}
function goCustom(d){
  const label = d ? ('Inspired by ' + d.title + ' No. ' + String(d.n).padStart(2,'0')) : null;
  track('custom_form_open', { design: d?d.title:'', no: d?d.n:'' });
  // /flash/ has no form on the page — hand the design to /custom/ through the URL
  if(!$('#custom')){
    location.href = '/custom/' + (label ? '?idea=' + encodeURIComponent(label) : '');
    return;
  }
  setCustomIframe(label);   // passes the design into the form's Design ID field as "Inspired by …"
  // scroll after the iframe (re)mounts so its height change doesn't offset us
  requestAnimationFrame(() => $('#custom').scrollIntoView({behavior:'smooth', block:'start'}));
}
function customForm(){
  // Carry captured ad attribution (utm_*, lead_id) into the GHL form URL so the lead keeps its source,
  // plus any design handed over from /flash/ via ?idea=.
  setCustomIframe(params.get('idea') || undefined);
  const f = document.getElementById(CFORM_ID);
  if(f && !STILL){
    const io = new IntersectionObserver(es=>{ if(es[0].isIntersecting){ track('custom_form_view', {}); io.disconnect(); } }, {rootMargin:'0px 0px -20% 0px'});
    io.observe(f);
  }
}

/* ---------- FAQ (three tiles + accordion) ---------- */
const FAQ = {
  flash: [
    ['How do I book a flash design?', "Pick any design from The Collection and hit Claim. The booking calendar opens right there. Choose your date and leave a $50 deposit to lock it in. The deposit credits toward your session."],
    ['Are the flash designs really one-of-one?', "Yes. Each design is tattooed once, then retired for good. Once it's claimed, it's gone, so if one speaks to you, grab it."],
    ['Can I change the size or placement?', "Small adjustments to suit your body, absolutely. If you want to change the design itself, start a custom request instead and we'll build something around it."],
    ['What does each flash piece cost?', "Each design shows its starting price. Final cost typically lands close to this range, but may vary depending on each client."],
    ['What if the design I want is already claimed?', "It won't come back, but tell me in a custom request and I'll draw something new in the same spirit, just for you."]
  ],
  /* Answers mirror custom.nicktylertattoo.com, the page carrying the paid
     traffic. Keep them aligned: the flow is request → approval → private
     booking link, and approval is never automatic. */
  custom: [
    ['How long does it take to hear back after I submit?', "Most requests get a response within 1 to 3 business days. During especially busy stretches it can take a little longer, but every form is read personally and thoroughly."],
    ['Does submitting the form guarantee I can book?', "No. The form is a request, not an automatic booking. I prioritize projects that suit my style, fit the schedule, and leave enough time to get you the result you're after."],
    ['What kinds of tattoos do you take on?', "Fine line, ornamental, geometric and detailed illustrative custom work. Larger projects like half or full sleeves and full backs get priority. If your idea isn't the right fit for me I'll tell you, and I may suggest changes or point you to another artist I trust."],
    ['When do I see my design?', "At your appointment, with time set aside for small adjustments together. The form is what lets us agree on direction beforehand, so the session goes on tattooing rather than designing from scratch. I show up prepared with a ready-to-tattoo design based on what you sent."],
    ['How do I get an estimate?', "The request form gives me everything I need to price it accurately, so start there. If an estimate is all you're after right now, say so in the notes."]
  ],
  general: [
    ['Where are you located?', "A private studio in Suffolk County, Long Island, NY. By appointment only. The exact address is shared 24 hours before your appointment."],
    /* NOTE: custom.nicktylertattoo.com frames this as "custom pieces start at $250"
       and routes pricing through the request form. It makes no "free design" claim,
       so that line was dropped here rather than left contradicting the live page. */
    ['What are your rates?', "Custom pieces start at $250, with most work landing between $250 and $1,200 depending on size, placement and detail. Send your references through the request form and ask for an estimate and I'll give you an accurate number."],
    ["It's my first tattoo. Anything I should know?", "You're in good hands. Ask anything, take breaks whenever you need, and never apologize, just communicate. Your comfort comes first, always."],
    ['Do you travel or do guest spots?', "My home studio is where I do my best work. For those traveling from out of state or over 100 miles away, I offer extended sessions, with a discount of up to $500 to cover your travel expenses to get to my studio. Ask me about my extended sessions in your request form for more information!"],
    ["What's your cancellation policy?", "Life happens. Give me as much notice as you can. Deposits are non-refundable but they hold your spot, and I'll work with you to reschedule."],
    ['How do I care for it afterward?', "You'll get full aftercare instructions at your appointment, and I'm a text away if anything comes up while it heals."]
  ]
};
function renderFAQ(cat){
  $('#faqList').innerHTML = (FAQ[cat]||[]).map(([q,a]) =>
    `<div class="faq-item"><button class="faq-q" data-cursor="link"><span>${q}</span><span class="faq-ic" aria-hidden="true">+</span></button><div class="faq-a"><p>${a}</p></div></div>`
  ).join('');
}
function faq(){
  /* each page names its own opening topic on #faqList[data-faq-default] */
  const first = $('#faqList').dataset.faqDefault || 'flash';
  renderFAQ(first);
  $$('.faq-tab').forEach(t => {
    const on = t.dataset.faq === first;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', String(on));
  });
  $$('.faq-tab').forEach(t => t.addEventListener('click', () => {
    $$('.faq-tab').forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected','false'); });
    t.classList.add('is-active'); t.setAttribute('aria-selected','true');
    renderFAQ(t.dataset.faq); track('faq_tab', { topic: t.dataset.faq });
  }));
  $('#faqList').addEventListener('click', e => {
    const q = e.target.closest('.faq-q'); if(!q) return;
    const item = q.parentElement, a = item.querySelector('.faq-a');
    const open = item.classList.toggle('open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
  });
}

/* ---------- Generic reveals ---------- */
function reveals(){
  const els=$$('.shead, .custom-left, .artist-intro, .faq-head, .foot-cta, .reassure');
  els.forEach(e=>e.classList.add('reveal'));
  if(STILL){ els.forEach(e=>e.classList.add('in')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -10% 0px'});
  els.forEach(e=>io.observe(e));
}

/* ---------- Init ----------
   One bundle serves both /flash/ and /custom/, so every module is gated on the
   element it needs. `need()` runs fn only when all its selectors are present. */
function need(sel, fn){
  const list = Array.isArray(sel) ? sel : [sel];
  if (list.every(s => $(s))) { try { fn(); } catch(e){ console.error('[NT]', fn.name, e); } }
}
function init(){
  const yr = $('#yr'); if(yr) yr.textContent = new Date().getFullYear();

  need('#wm', splitWordmark);
  need('#cursor', cursor);
  need('#ink', inkField);
  need(['#emblem','#emblemStage'], emblem);
  need('#marquee', marquee);
  need('#nav', nav);
  need(['#flashGrid','#sort','#availOnly','#navAvail','#availCount','#drop'], catalog);
  need('#lightbox', lightbox);
  need('#booking', booking);
  need('#faqList', faq);
  customForm();          // already no-ops when the embed is absent
  reveals();

  document.addEventListener('click', e => { const t = e.target.closest('[data-track]'); if(t) track(t.dataset.track, {}); });

  // pause hero canvases when the hero scrolls out of view (saves battery/CPU on mobile)
  const heroEl = $('#hero');
  if(heroEl && 'IntersectionObserver' in window && !STILL){
    new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }, {threshold:0}).observe(heroEl);
  } else if(!heroEl){
    heroVisible = true;  // no hero on this page — never park the canvases
  }

  if($('#preloader')) preloader(); else document.body.removeAttribute('data-loading');
  track('page_view', { page: document.querySelector('meta[name="ntt-page"]')?.content || 'unknown' });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
