/* ===== Nick Tyler Tattoo — ONE TATTOO AT A TIME · one-page site ===== */
(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
/* FROZEN — ?still screenshot mode: no motion, no interaction.
   REDUCED — OS "reduce motion": no autonomous motion (spins, pulses,
   marquee, typewriter), but user-driven interaction still works.
   ?motion overrides the OS setting. */
const FROZEN = params.has('still');
const REDUCED = !FROZEN && matchMedia('(prefers-reduced-motion: reduce)').matches && !params.has('motion');
const STILL = FROZEN || REDUCED;
if (STILL) document.body.classList.add('still');
let heroVisible = true;               // gates hero canvases when scrolled away
const MOBILE = innerWidth < 700;

/* ---------- The Collection ----------
   Each entry: [number/date text, category, imgPath|null]
   First six = real OTAAT pieces (photos supplied 2026-07-11; five from the
   3.22.26 inaugural event, one from 6.29.26). Add more: drop files in
   public/assets/collection/ and set the third field. Text plate shows
   until a photo exists. */
const COLLECTION = [
  ['11,453', 'Counted in days', 'assets/collection/otaat-01.jpg'],
  ['01.20.2023', 'First event · 3.22.26', 'assets/collection/otaat-02.jpg'],
  ['2,590', 'Counted in days', 'assets/collection/otaat-03.jpg'],
  ['03.05.2024', 'One date, carried together', 'assets/collection/otaat-04.jpg'],
  ['03.05.2024', 'One date, carried together', 'assets/collection/otaat-05.jpg'],
  ['09.20', 'Marked 6.29.26', 'assets/collection/otaat-06.jpg'],
  ['24 HOURS', 'Day one', null],
  ['10 YEARS', 'Sobriety milestone', null],
  ['11.09.18', 'In remembrance', null],
  ['365 DAYS', 'One year clean', null],
  ['18 MONTHS', 'Milestone', null],
  ['1 DAY', 'Day one', null]
];

/* ---------- Participating artists — the world map ----------
   Add a new artist = one entry here (lat/lon from Google Maps).
   The globe, list and contact cards all update automatically.
   Roster + quotes sourced from the "FREE" story highlight on
   @nicktylertattoo (artists' own reposted words, July 2026). */
const ARTIST_MAP = [
  { name: 'Nick Tyler', handle: 'nicktylertattoo', ig: 'https://instagram.com/nicktylertattoo',
    loc: 'Selden, New York · USA', role: 'Founder & host', lat: 40.87, lon: -73.04,
    quote: 'Every DM will be answered, and every single tattoo will be done. For free. As promised. One tattoo at a time — even if it takes the rest of my career.' },
  { name: 'Natasha', handle: 'tuffpuppytattoos', ig: 'https://instagram.com/tuffpuppytattoos',
    loc: 'Lyndhurst, New Jersey · USA', role: 'Participating artist · Afflicted Ink', lat: 40.81, lon: -74.12,
    quote: 'My chair is open to you. For free. Always.' },
  { name: 'Sonya Mac', handle: 'staysonyamind', ig: 'https://instagram.com/staysonyamind',
    loc: 'Portsmouth, New Hampshire · USA', role: 'Participating artist · Sage Ink Collective', lat: 43.07, lon: -70.76,
    quote: 'This story touched my soul. If you want a sobriety tattoo like this, I will do this for free.' },
  { name: 'Rae Null', handle: 'raeofsunshine.ink', ig: 'https://instagram.com/raeofsunshine.ink',
    loc: 'St. Louis, Missouri · USA', role: 'Participating artist', lat: 38.63, lon: -90.20,
    quote: 'I am going to do this. What a life saving thing — my brother O.D. at age 20. Spread the word.' },
  { name: 'Nico Winter Buccione', handle: 'badvibestattoos', ig: 'https://instagram.com/badvibestattoos',
    loc: 'Ottawa, Ontario · Canada', role: 'Participating artist', lat: 45.42, lon: -75.70,
    quote: 'I’m going to offer the same thing for my Canadian friends. Message me with your numbers — I’d be honoured to do this for you.' },
  { name: 'Chloë Kyron', handle: 'artist.chloekyron', ig: 'https://instagram.com/artist.chloekyron',
    loc: 'Oshawa, Ontario · Canada', role: 'Participating artist · Chloë’s Studio', lat: 43.95, lon: -78.86,
    quote: 'I want to do days of sobriety tattoos, for free. They will always be free.' },
  { name: 'Adrianna', handle: 'adriannatattoo', ig: 'https://instagram.com/adriannatattoo',
    loc: 'Sulechów · Poland', role: 'Participating artist', lat: 52.08, lon: 15.62,
    quote: 'Mocno mnie to ruszyło. Robimy to. Za darmo. (This moved me deeply. We’re doing it. For free.)' }
];

/* ---------- Preloader ---------- */
function preloader(){
  const out = $('#preCount');
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
  $$('.wm-line[data-split]').forEach(line => {
    const text = line.textContent; line.textContent = '';
    [...text].forEach(c => {
      if (c === ' '){ const s = document.createElement('span'); s.className = 'sp'; line.appendChild(s); return; }
      const span = document.createElement('span'); span.className = 'ch'; span.textContent = c; line.appendChild(span);
    });
  });
}
function revealHero(){
  $$('#wm .ch').forEach((ch, i) => {
    const d = 0.035 * i + 0.1;
    ch.style.transition = STILL ? 'none' : `opacity .8s var(--ease) ${d}s, transform .8s var(--ease) ${d}s`;
    requestAnimationFrame(() => { ch.style.opacity = '1'; ch.style.transform = 'none'; });
  });
}

/* ---------- Custom cursor ---------- */
function cursor(){
  if (STILL || matchMedia('(hover:none)').matches) { $('#cursor').style.display = 'none'; return; }
  const cur = $('#cursor'); let x = innerWidth/2, y = innerHeight/2, tx = x, ty = y;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, {passive:true});
  const loop = () => { x += (tx-x)*0.25; y += (ty-y)*0.25; cur.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
  loop();
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor]');
    cur.className = 'cursor' + (t ? ' is-' + t.dataset.cursor : '');
  });
}

/* ---------- Constellation field — points of light that find each other ---------- */
function constellation(){
  const cv = $('#ink'), ctx = cv.getContext('2d');
  let w, h, dpr = 1, pts = [];
  const N = MOBILE ? 34 : 72;
  const LINK = MOBILE ? 110 : 150;      // px distance for a connection line
  function size(){ dpr = Math.min(devicePixelRatio || 1, MOBILE ? 1.25 : 1.5); w = cv.width = innerWidth*dpr; h = cv.height = innerHeight*dpr; cv.style.width = innerWidth+'px'; cv.style.height = innerHeight+'px'; }
  size(); addEventListener('resize', size, {passive:true});
  for (let i=0;i<N;i++) pts.push({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    vx: (Math.random()-.5)*0.22, vy: (Math.random()-.5)*0.22,
    r: Math.random()*1.5+0.5, a: Math.random()*0.35+0.15
  });
  let mx = -9999, my = -9999;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, {passive:true});
  addEventListener('mouseleave', () => { mx = -9999; my = -9999; }, {passive:true});
  function frame(){
    ctx.clearRect(0,0,w,h);
    const iw = innerWidth, ih = innerHeight;
    for (const p of pts){
      // gentle pull toward the cursor — everything leans toward connection
      const dxm = mx - p.x, dym = my - p.y, dm = Math.hypot(dxm, dym);
      if (dm < 220 && dm > 1){ p.vx += dxm/dm*0.008; p.vy += dym/dm*0.008; }
      p.vx *= 0.995; p.vy *= 0.995;
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = iw+20; if (p.x > iw+20) p.x = -20;
      if (p.y < -20) p.y = ih+20; if (p.y > ih+20) p.y = -20;
    }
    // connection lines
    ctx.lineWidth = dpr*0.6;
    for (let i=0;i<pts.length;i++){
      for (let j=i+1;j<pts.length;j++){
        const a = pts[i], b = pts[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
        const d = Math.hypot(dx,dy);
        if (d < LINK){
          ctx.strokeStyle = `rgba(184,169,138,${(1-d/LINK)*0.14})`;
          ctx.beginPath(); ctx.moveTo(a.x*dpr,a.y*dpr); ctx.lineTo(b.x*dpr,b.y*dpr); ctx.stroke();
        }
      }
    }
    for (const p of pts){
      ctx.beginPath(); ctx.arc(p.x*dpr, p.y*dpr, p.r*dpr, 0, 7);
      ctx.fillStyle = `rgba(184,169,138,${p.a})`; ctx.fill();
    }
    if (!STILL) requestAnimationFrame(frame);
  }
  frame();
}

/* ---------- Interlocking-OO brand emblem (canvas) ---------- */
function emblem(){
  const cv = $('#emblem'), ctx = cv.getContext('2d');
  const stage = $('#emblemStage');
  let w, h, dpr = 1;
  function size(){ dpr = Math.min(devicePixelRatio || 1, MOBILE ? 1.3 : 1.6); const r = stage.getBoundingClientRect(); w = cv.width = r.width*dpr; h = cv.height = r.height*dpr; cv.style.width = r.width+'px'; cv.style.height = r.height+'px'; }
  size(); addEventListener('resize', size, {passive:true});

  let mx=0, my=0, tmx=0, tmy=0;
  addEventListener('mousemove', e=>{ tmx=(e.clientX/innerWidth-0.5); tmy=(e.clientY/innerHeight-0.5); }, {passive:true});

  const M = 64, MR = 1.36, MOFF = 1.43, RINGS = [-MOFF/2, MOFF/2];
  function render(t){
    ctx.clearRect(0,0,w,h);
    const ox = w/2 + mx*w*0.05, oy = h*0.21;
    const scale = Math.min(w,h)*0.155, cam = 4.6;
    ctx.lineJoin='round'; ctx.lineCap='round';
    const mspin = Math.sin(t*0.22)*0.3 + mx*0.5, mtilt = 0.12+Math.sin(t*0.3)*0.1 + my*0.36;
    const mcy=Math.cos(mspin),msy=Math.sin(mspin),mcx=Math.cos(mtilt),msx=Math.sin(mtilt);
    const mtx=(px,py)=>{ const x=px*mcy,z=-px*msy,y=py; return [x, y*mcx-z*msx, y*msx+z*mcx]; };
    const halo=ctx.createRadialGradient(ox,oy,0, ox,oy,scale*2.4);
    halo.addColorStop(0,'rgba(184,169,138,0.24)'); halo.addColorStop(0.55,'rgba(184,169,138,0.06)'); halo.addColorStop(1,'rgba(184,169,138,0)');
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
    if(heroVisible){
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

/* ---------- Typewriter specimen ---------- */
const PHRASES = ['24 HOURS','03.22.2026','1 DAY','10 YEARS','5,475 DAYS','365 DAYS'];
function typewriter(){
  const out = $('#typeOut');
  if (STILL){ out.textContent = PHRASES[0]; return; }
  let pi = 0, ci = 0, deleting = false;
  function step(){
    const phrase = PHRASES[pi];
    if (!deleting){
      ci++;
      out.textContent = phrase.slice(0, ci);
      if (ci === phrase.length){ deleting = true; setTimeout(step, 1700); return; }
      setTimeout(step, 95 + Math.random()*70);
    } else {
      ci--;
      out.textContent = phrase.slice(0, ci);
      if (ci === 0){ deleting = false; pi = (pi+1) % PHRASES.length; setTimeout(step, 450); return; }
      setTimeout(step, 42);
    }
  }
  setTimeout(step, 1200);
}

/* ---------- Marquee ---------- */
function marquee(){
  const track = $('#marquee');
  const unit = '<span>One story<i>◆</i>One number<i>◆</i>One tattoo at a time<i>◆</i>Free, forever<i>◆</i>Recovery · Remembrance · Resilience<i>◆</i></span>';
  track.innerHTML = unit;
  while (track.scrollWidth < innerWidth*2) track.innerHTML += unit;
  let x = 0, paused = false;
  track.parentElement.addEventListener('mouseenter', ()=>paused=true);
  track.parentElement.addEventListener('mouseleave', ()=>paused=false);
  const half = () => track.scrollWidth/2;
  function loop(){ if(!paused){ x -= 0.55; if(-x >= half()) x += half(); track.style.transform = `translateX(${x}px)`; } if(!STILL) requestAnimationFrame(loop); }
  if(!STILL) requestAnimationFrame(loop);
}

/* ---------- Nav ---------- */
function nav(){
  const n = $('#nav');
  const on = () => n.classList.toggle('is-stuck', scrollY > 40);
  on(); addEventListener('scroll', on, {passive:true});
  $('#scrollcue').addEventListener('click', () => $('#story').scrollIntoView({behavior:'smooth'}));
}

/* ---------- Stencil preview ---------- */
function stencil(){
  const input = $('#stencilIn'), out = $('#stencilOut'), count = $('#stencilCount');
  input.addEventListener('input', () => {
    const v = input.value.toUpperCase().slice(0, 10);
    if (input.value !== v) input.value = v;
    out.textContent = v || '24 HOURS';
    count.textContent = v.length || 8;
  });
}

/* ---------- Count-up stats ---------- */
function countUp(el, to){
  if (STILL || to === 0){ el.textContent = to; return; }
  let v = 0;
  const step = () => { v += Math.max(1, Math.round((to-v)/6)); if (v >= to){ el.textContent = to; return; } el.textContent = v; setTimeout(step, 40); };
  step();
}
function stats(){
  const els = $$('[data-count]');
  if (STILL){ els.forEach(e => e.textContent = e.dataset.count); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ countUp(e.target, +e.target.dataset.count); io.unobserve(e.target); }
  }), {rootMargin:'0px 0px -10% 0px'});
  els.forEach(e => io.observe(e));
}

/* ---------- Generic reveals ---------- */
function reveals(){
  const els = $$('.reveal, .crisis');
  if (STILL){ els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), {rootMargin:'0px 0px -10% 0px'});
  els.forEach(e => io.observe(e));
}

/* ================================================================
   THE WALL — live anonymous message board
   ================================================================ */
const seen = new Set();                 // message ids already on the wall
let wallTotal = 0;
const litStore = (() => {               // one light per visitor per message
  try { return new Set(JSON.parse(localStorage.getItem('otaat_lit') || '[]')); }
  catch { return new Set(); }
})();
function saveLit(){ try { localStorage.setItem('otaat_lit', JSON.stringify([...litStore])); } catch {} }

function timeAgo(ts){
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  if (s < 86400*14) return Math.floor(s/86400) + 'd ago';
  return new Date(ts).toLocaleDateString(undefined, {month:'short', day:'numeric'});
}

const FLAME_SVG = '<svg viewBox="0 0 14 18" width="13" height="16" aria-hidden="true"><path class="flame" d="M7 1.5C7 5 3 6.5 3 10.5a4 4 0 0 0 8 0C11 6.5 7 5 7 1.5Z"/><path class="flame" d="M7 16.8v0"/></svg>';

function noteEl(m, fresh){
  const art = document.createElement('article');
  art.className = 'note';
  art.dataset.id = m.id;

  const txt = document.createElement('p');
  txt.className = 'note__text';
  txt.textContent = m.text;                       // textContent = XSS-safe

  const foot = document.createElement('div');
  foot.className = 'note__foot';

  const meta = document.createElement('div');
  meta.className = 'note__meta';
  const from = document.createElement('b');
  from.textContent = '— ' + (m.from || 'Anonymous');
  const when = document.createElement('span');
  when.className = 'note__when';
  when.dataset.ts = m.ts;
  when.textContent = ' · ' + timeAgo(m.ts);
  meta.append(from, when);

  const light = document.createElement('button');
  const isLit = litStore.has(m.id);
  light.className = 'light' + (isLit ? ' lit' : '');
  light.type = 'button';
  light.dataset.light = m.id;
  light.setAttribute('data-cursor', 'link');
  light.setAttribute('aria-pressed', isLit ? 'true' : 'false');
  light.setAttribute('aria-label', `Hold a light for this message — ${m.lights || 0} held`);
  light.innerHTML = FLAME_SVG + '<span class="light__n">' + (m.lights || 0) + '</span>';

  foot.append(meta, light);
  art.append(txt, foot);

  if (fresh && !STILL) art.classList.add('fresh');
  return art;
}

function mountNote(art, prepend){
  const grid = $('#wallGrid');
  prepend ? grid.prepend(art) : grid.append(art);
  $('#wallEmpty').hidden = grid.children.length > 0;
  if (STILL){ art.classList.add('in'); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => art.classList.add('in')));
  if (art.classList.contains('fresh')) setTimeout(() => art.classList.remove('fresh'), 4200);
}

function setWallCounts(total){
  wallTotal = total;
  $('#navMsgs').textContent = total;
  $('#wallCount').textContent = total;
}

function addMessage(m, {prepend = false, fresh = false} = {}){
  if (seen.has(m.id)) return false;
  seen.add(m.id);
  mountNote(noteEl(m, fresh), prepend);
  return true;
}

async function loadWall(){
  try {
    const r = await fetch('data/messages.json');
    const data = await r.json();
    (data.messages || []).forEach(m => addMessage(m));   // newest first, append in order
    setWallCounts(data.total || seen.size);
    $('#wallEmpty').hidden = $('#wallGrid').children.length > 0;
    if (!STILL){
      // stagger the first screenful in
      $$('.note').forEach((n, i) => n.style.transitionDelay = Math.min(i, 8)*0.06 + 's');
      setTimeout(() => $$('.note').forEach(n => n.style.transitionDelay = ''), 1500);
    }
  } catch {
    $('#wallEmpty').hidden = false;
    $('#wallEmpty').textContent = 'The wall is offline right now — start the OTAAT server to see it live.';
  }
}

/* live updates — SSE with polling fallback */
function liveWall(){
  if (STILL) return;
  let es;
  try {
    es = new EventSource('/api/stream');
    es.onmessage = ev => {
      let p; try { p = JSON.parse(ev.data); } catch { return; }
      if (p.type === 'message' && p.message){
        if (addMessage(p.message, {prepend:true, fresh:true})){
          setWallCounts(wallTotal + 1);
          $('#srlive').textContent = 'New message on the wall';
        }
      } else if (p.type === 'light'){
        const btn = $(`[data-light="${p.id}"]`);
        if (btn) btn.querySelector('.light__n').textContent = p.lights;
      } else if (p.type === 'remove'){
        // NB: id stays in `seen` — ids are never reused, and forgetting it
        // would let an in-flight poll resurrect a moderated message.
        const el = $(`.note[data-id="${p.id}"]`);
        if (el){ el.remove(); setWallCounts(Math.max(0, wallTotal - 1)); }
        $('#wallEmpty').hidden = $('#wallGrid').children.length > 0;
      }
    };
  } catch {}
  // safety-net poll — catches anything missed while tab slept
  setInterval(async () => {
    try {
      const r = await fetch('data/messages.json');
      const data = await r.json();
      const list = data.messages || [];
      list.slice().reverse().forEach(m => addMessage(m, {prepend:true}));
      // reconcile deletions missed while asleep (list is complete when total <= 200)
      if (data.total != null && data.total <= 200){
        const live = new Set(list.map(m => m.id));
        $$('.note').forEach(n => { if (!live.has(n.dataset.id)) n.remove(); });
        $('#wallEmpty').hidden = $('#wallGrid').children.length > 0;
      }
      if (data.total != null) setWallCounts(data.total);
    } catch {}
  }, 45000);
  // keep timestamps honest
  setInterval(() => $$('.note__when').forEach(w => w.textContent = ' · ' + timeAgo(+w.dataset.ts)), 60000);
}

/* composer */
function composer(){
  const form = $('#composer'), text = $('#msgText'), from = $('#msgFrom'),
        count = $('#msgCount'), err = $('#msgErr'), send = $('#msgSend');
  text.addEventListener('input', () => count.textContent = text.value.length);
  const fail = msg => {
    err.textContent = msg; err.hidden = false;
    text.setAttribute('aria-invalid', 'true');
    text.setAttribute('aria-describedby', 'msgErr');
    text.focus();
  };
  const clearErr = () => {
    err.hidden = true;
    text.removeAttribute('aria-invalid');
    text.removeAttribute('aria-describedby');
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErr();
    const body = { text: text.value.trim(), from: from.value.trim() };
    if (body.text.length < 4){ fail('Say a little more — even one kind sentence matters.'); return; }
    send.disabled = true; send.textContent = 'Posting…';
    try {
      const r = await fetch('/api/messages', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not post right now.');
      if (addMessage(data.message, {prepend:true, fresh:true})) setWallCounts(wallTotal + 1);
      text.value = ''; from.value = ''; count.textContent = 0;
      $('#srlive').textContent = 'Your message is on the wall';
      $('#wallGrid').firstElementChild?.scrollIntoView({behavior: STILL ? 'auto' : 'smooth', block:'center'});
    } catch (ex){
      fail(ex.message);
    } finally {
      send.disabled = false; send.textContent = 'Post to the wall';
    }
  });
}

/* hold a light */
function sparkBurst(btn){
  if (STILL) return;
  const rect = btn.getBoundingClientRect();
  for (let i = 0; i < 9; i++){
    const s = document.createElement('span');
    s.className = 'spark';
    btn.appendChild(s);
    const ang = Math.random()*Math.PI*2, dist = 26 + Math.random()*30;
    s.animate([
      { opacity: 1, transform: 'translate(0,0) scale(1)' },
      { opacity: 0, transform: `translate(${Math.cos(ang)*dist}px,${Math.sin(ang)*dist - 14}px) scale(.3)` }
    ], { duration: 620 + Math.random()*300, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => s.remove();
    s.style.left = rect.width/2 + 'px'; s.style.top = rect.height/2 + 'px'; s.style.opacity = '1';
  }
}
function lights(){
  $('#wallGrid').addEventListener('click', async e => {
    const btn = e.target.closest('[data-light]');
    if (!btn || btn.classList.contains('lit')) return;
    const id = btn.dataset.light;
    btn.classList.add('lit');
    btn.setAttribute('aria-pressed', 'true');
    sparkBurst(btn);
    const n = btn.querySelector('.light__n');
    const before = +n.textContent || 0;
    n.textContent = before + 1;
    try {
      const r = await fetch(`/api/messages/${id}/light`, {method:'POST'});
      const data = await r.json();
      if (!r.ok) throw new Error();
      if (data.lights != null) n.textContent = data.lights;
      litStore.add(id); saveLit();                 // commit only once the server counted it
      btn.setAttribute('aria-label', `Light held — ${n.textContent} held`);
      $('#srlive').textContent = 'Light held';
    } catch {
      btn.classList.remove('lit');                 // roll back so they can try again
      btn.setAttribute('aria-pressed', 'false');
      n.textContent = before;
    }
  });
}

/* ---------- The Collection ---------- */
function collection(){
  const grid = $('#collGrid');
  grid.innerHTML = COLLECTION.map((p, i) => {
    const [num, cat, img] = p;
    const no = String(i+1).padStart(2,'0');
    if (img){
      return `<figure class="piece" data-cursor="link">
        <img src="${img}" alt="OTAAT tattoo — ${num}, ${cat}" loading="lazy">
        <span class="piece__no mono">No. ${no}</span>
        <figcaption class="piece__veil">${num} · ${cat}</figcaption>
      </figure>`;
    }
    return `<figure class="piece" data-cursor="link">
      <div class="piece__ph">
        <span class="piece__num">${num}</span>
        <span class="piece__cat">${cat}</span>
      </div>
      <span class="piece__no mono">No. ${no}</span>
      <span class="piece__soon">Photo soon</span>
    </figure>`;
  }).join('');
  countUpOnView($('#collCount'), COLLECTION.length, $('#collection'));
  if (STILL){ $$('.piece').forEach(p => p.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){
      const el = e.target, idx = $$('.piece').indexOf(el);
      el.style.transitionDelay = Math.min(idx, 8)*0.05 + 's';
      el.classList.add('in'); io.unobserve(el);
    }
  }), {rootMargin:'0px 0px -8% 0px'});
  $$('.piece').forEach(p => io.observe(p));
}
function countUpOnView(el, to, watch){
  if (STILL){ el.textContent = to; return; }
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting){ countUp(el, to); io.disconnect(); } });
  io.observe(watch);
}

/* ================================================================
   THE ATLAS — interactive dot-matrix globe of participating artists
   ================================================================ */
function atlas(){
  const cv = $('#globe'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const stage = $('#atlasStage');
  const RAD = Math.PI/180;
  let dpr = 1;
  let W = 0, H = 0, CX = 0, CY = 0, R = 0;
  function size(){
    dpr = Math.min(devicePixelRatio || 1, MOBILE ? 1.5 : 2);
    const r = stage.getBoundingClientRect();
    W = cv.width = r.width*dpr; H = cv.height = r.height*dpr;
    cv.style.width = r.width+'px'; cv.style.height = r.height+'px';
    CX = W/2; CY = H/2; R = Math.min(W,H)*0.44;
    if (STILL) render(2);
  }

  /* lat/lon → unit vector (shared by land dots and artist markers) */
  const vec = (lat, lon) => {
    const p = lat*RAD, l = lon*RAD;
    return [Math.cos(p)*Math.sin(l), Math.sin(p), Math.cos(p)*Math.cos(l)];
  };

  /* rotation state — home view frames North America (6 of 7 artists; spin east for Poland) */
  const HOME_SPIN = 74.5*RAD, HOME_TILT = 30*RAD;
  let spin = HOME_SPIN, tilt = HOME_TILT;
  let spinTarget = null, tiltTarget = null;
  let dragging = false, velSpin = 0, lastInteract = 0;
  let selected = 0;
  const angDiff = (a, b) => ((a - b + Math.PI*3) % (Math.PI*2)) - Math.PI;

  /* ---- land dots: world-atlas TopoJSON → offscreen raster → fibonacci sample ---- */
  let dots = [];            // [x,y,z] unit vectors on land
  let dotsBorn = 0;         // fade-in timestamp
  function fibSphere(n){
    const pts = [], ga = Math.PI*(3 - Math.sqrt(5));
    for (let i = 0; i < n; i++){
      const y = 1 - (i/(n-1))*2, r = Math.sqrt(1 - y*y), th = ga*i;
      pts.push([Math.cos(th)*r, y, Math.sin(th)*r]);
    }
    return pts;
  }
  function fallbackDots(){
    // offline fallback: a quiet sphere of light (no landmask)
    dots = fibSphere(MOBILE ? 900 : 1500);
    dotsBorn = performance.now();
    if (STILL) render(2);
  }
  function decodeLand(topo){
    const tr = topo.transform;
    const arcs = topo.arcs.map(arc => {
      let x = 0, y = 0;
      return arc.map(d => { x += d[0]; y += d[1]; return [x*tr.scale[0]+tr.translate[0], y*tr.scale[1]+tr.translate[1]]; });
    });
    const ring = idx => {
      let out = [];
      idx.forEach(i => {
        let a = i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
        if (out.length) a = a.slice(1);
        out = out.concat(a);
      });
      return out;
    };
    const polys = [];
    topo.objects.land.geometries.forEach(g => {
      (g.type === 'Polygon' ? [g.arcs] : g.arcs).forEach(p => polys.push(p.map(ring)));
    });
    return polys;
  }
  function buildDots(polys){
    const mw = 1024, mh = 512;
    const oc = document.createElement('canvas'); oc.width = mw; oc.height = mh;
    const octx = oc.getContext('2d', { willReadFrequently: true });
    octx.fillStyle = '#fff';
    polys.forEach(rings => {
      octx.beginPath();
      rings.forEach(r => r.forEach(([lon, lat], i) => {
        const x = (lon+180)/360*mw, y = (90-lat)/180*mh;
        i ? octx.lineTo(x, y) : octx.moveTo(x, y);
      }));
      octx.fill('evenodd');
    });
    const img = octx.getImageData(0, 0, mw, mh).data;
    dots = fibSphere(MOBILE ? 9000 : 16000).filter(v => {
      const lat = Math.asin(v[1])/RAD, lon = Math.atan2(v[0], v[2])/RAD;
      const px = Math.min(mw-1, Math.max(0, Math.round((lon+180)/360*mw)));
      const py = Math.min(mh-1, Math.max(0, Math.round((90-lat)/180*mh)));
      return img[(py*mw+px)*4+3] > 0;
    });
    dotsBorn = performance.now();
    if (STILL) render(2);
  }
  (async () => {
    const srcs = [
      'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json',
      'https://unpkg.com/world-atlas@2.0.2/land-110m.json'
    ];
    for (const src of srcs){
      try {
        const r = await fetch(src, { mode: 'cors' });
        if (!r.ok) continue;
        buildDots(decodeLand(await r.json()));
        return;
      } catch {}
    }
    fallbackDots();
  })();

  const artistVecs = ARTIST_MAP.map(a => vec(a.lat, a.lon));
  let artistPx = [];        // per-frame projected marker positions (for hit-testing)

  function project(v){
    const cs = Math.cos(spin), ss = Math.sin(spin);
    const x1 = v[0]*cs + v[2]*ss, z1 = -v[0]*ss + v[2]*cs, y1 = v[1];
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    const y2 = y1*ct - z1*st, z2 = y1*st + z1*ct;
    return [CX + x1*R, CY - y2*R, z2];
  }

  function render(t){
    ctx.clearRect(0, 0, W, H);
    // sphere body + rim glow
    const body = ctx.createRadialGradient(CX - R*0.25, CY - R*0.3, R*0.1, CX, CY, R);
    body.addColorStop(0, 'rgba(24,20,17,0.92)'); body.addColorStop(1, 'rgba(11,9,8,0.96)');
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, 7); ctx.fillStyle = body; ctx.fill();
    const rim = ctx.createRadialGradient(CX, CY, R*0.9, CX, CY, R*1.18);
    rim.addColorStop(0, 'rgba(184,169,138,0)'); rim.addColorStop(0.55, 'rgba(184,169,138,0.10)'); rim.addColorStop(1, 'rgba(184,169,138,0)');
    ctx.beginPath(); ctx.arc(CX, CY, R*1.18, 0, 7); ctx.fillStyle = rim; ctx.fill();
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, 7); ctx.strokeStyle = 'rgba(184,169,138,0.16)'; ctx.lineWidth = dpr; ctx.stroke();

    // land
    const born = dotsBorn ? (STILL ? 1 : Math.min(1, (performance.now() - dotsBorn)/900)) : 0;
    for (const v of dots){
      const [x, y, z] = project(v);
      if (z <= 0) continue;
      ctx.beginPath();
      ctx.arc(x, y, (0.55 + z*0.85)*dpr, 0, 7);
      ctx.fillStyle = `rgba(184,169,138,${(0.10 + z*0.34)*born})`;
      ctx.fill();
    }

    // artists — glowing, pulsing markers
    artistPx = [];
    artistVecs.forEach((v, i) => {
      const [x, y, z] = project(v);
      if (z <= 0.02){ artistPx.push(null); return; }
      artistPx.push([x, y]);
      const pulse = STILL ? 1 : (1 + Math.sin(t*2.2 + i*1.9)*0.28);
      const pr = 7*dpr*pulse;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, pr*3.2);
      glow.addColorStop(0, 'rgba(194,162,94,0.8)');
      glow.addColorStop(0.35, 'rgba(184,169,138,0.28)');
      glow.addColorStop(1, 'rgba(184,169,138,0)');
      ctx.beginPath(); ctx.arc(x, y, pr*3.2, 0, 7); ctx.fillStyle = glow; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 2.6*dpr, 0, 7); ctx.fillStyle = '#f5ebe0'; ctx.fill();
      if (i === selected){
        ctx.beginPath(); ctx.arc(x, y, pr*1.9, 0, 7);
        ctx.strokeStyle = 'rgba(194,162,94,0.75)'; ctx.lineWidth = 1.2*dpr; ctx.stroke();
      }
    });
  }

  /* ---- interaction ---- */
  let downX = 0, downY = 0, downT = 0, lastX = 0, lastY = 0, moved = 0;
  function hitArtist(mx, my){
    let best = -1, bd = 24*dpr;
    artistPx.forEach((p, i) => {
      if (!p) return;
      const d = Math.hypot(p[0] - mx*dpr, p[1] - my*dpr);
      if (d < bd){ bd = d; best = i; }
    });
    return best;
  }
  function localXY(e){
    const r = cv.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }
  if (!FROZEN){
    cv.addEventListener('pointerdown', e => {
      dragging = true; moved = 0; velSpin = 0;
      [downX, downY] = localXY(e); lastX = downX; lastY = downY; downT = performance.now();
      spinTarget = tiltTarget = null; lastInteract = performance.now();
      try { cv.setPointerCapture(e.pointerId); } catch {}
    });
    cv.addEventListener('pointermove', e => {
      const [mx, my] = localXY(e);
      if (dragging){
        moved = Math.max(moved, Math.hypot(mx - downX, my - downY));
        const rr = R/dpr;                        // globe radius in CSS px
        spin += (mx - lastX)/rr;
        tilt = Math.max(-1.25, Math.min(1.25, tilt + (my - lastY)/rr));
        velSpin = (mx - lastX)/rr;
        lastX = mx; lastY = my;
        lastInteract = performance.now();
        if (STILL) render(2);              // reduced-motion: redraw per drag step
      } else {
        cv.style.cursor = hitArtist(mx, my) >= 0 ? 'pointer' : 'grab';
      }
    });
    cv.addEventListener('pointerup', e => {
      dragging = false;
      const [mx, my] = localXY(e);
      if (moved < 7 && performance.now() - downT < 500){
        const hit = hitArtist(mx, my);
        if (hit >= 0) select(hit, true);
      }
      lastInteract = performance.now();
    });
    cv.addEventListener('pointercancel', () => { dragging = false; });
  }

  /* ---- selection + contact card ---- */
  function cardHTML(a){
    return `<div class="acard__chip mono">${a.role}</div>
      <h3 class="acard__name">${a.name}</h3>
      <a class="acard__handle mono" href="${a.ig}" target="_blank" rel="noopener" data-cursor="link">@${a.handle}</a>
      <div class="acard__loc mono">◆ ${a.loc}</div>
      ${a.quote ? `<blockquote class="acard__quote">“${a.quote}”<span class="acard__quote-src mono">— in their own words</span></blockquote>` : ''}
      <a class="btn btn--solid btn--full" href="${a.ig}" target="_blank" rel="noopener" data-cursor="view">View on Instagram</a>`;
  }
  function select(i, rotate){
    selected = i;
    const a = ARTIST_MAP[i];
    $('#acard').innerHTML = cardHTML(a);
    $$('.alist__btn').forEach((b, bi) => b.classList.toggle('is-active', bi === i));
    if (rotate){
      const ts = -a.lon*RAD, tt = Math.max(-1.1, Math.min(1.1, a.lat*RAD));
      if (STILL){ spin = ts; tilt = tt; }           // reduced/frozen: jump, don't animate
      else { spinTarget = ts; tiltTarget = tt; lastInteract = performance.now(); }
    }
    if (STILL) render(2);
  }
  const list = $('#alist');
  list.innerHTML = ARTIST_MAP.map((a, i) =>
    `<button class="alist__btn mono${i === 0 ? ' is-active' : ''}" data-artist="${i}" data-cursor="link">${a.name} — ${a.loc.split('·')[0].trim()}</button>`
  ).join('');
  list.addEventListener('click', e => {
    const b = e.target.closest('[data-artist]');
    if (b) select(+b.dataset.artist, true);
  });
  select(0, false);
  countUpOnView($('#atlasCount'), ARTIST_MAP.length, $('#atlas'));

  /* ---- loop ---- */
  let atlasVisible = true;
  if ('IntersectionObserver' in window && !STILL){
    new IntersectionObserver(es => { atlasVisible = es[0].isIntersecting; }, {threshold: 0}).observe(stage);
  }
  let lastT = 0;
  function loop(now){
    const t = now/1000, dt = Math.min(0.05, (now - lastT)/1000 || 0.016); lastT = now;
    if (atlasVisible){
      if (!dragging){
        if (spinTarget != null){
          spin += angDiff(spinTarget, spin)*0.08;
          tilt += (tiltTarget - tilt)*0.08;
          if (Math.abs(angDiff(spinTarget, spin)) < 0.004 && Math.abs(tiltTarget - tilt) < 0.004){
            spinTarget = tiltTarget = null; lastInteract = performance.now();
          }
        } else if (performance.now() - lastInteract > 3500){
          spin += 0.055*dt;                       // slow world-turn
          tilt += (HOME_TILT - tilt)*0.01;
        } else if (Math.abs(velSpin) > 0.0004){
          spin += velSpin; velSpin *= 0.94;       // drag inertia
        }
      }
      render(t);
    }
    if (!STILL) requestAnimationFrame(loop);
  }
  size(); addEventListener('resize', size, {passive: true});
  if (STILL){ render(2); } else { requestAnimationFrame(loop); }
}

/* ---------- Artist sign-up ---------- */
function artists(){
  const form = $('#aform'), err = $('#aErr');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    err.hidden = true;
    const send = form.querySelector('button[type="submit"]');
    const body = {
      name: $('#aName').value.trim(), email: $('#aEmail').value.trim(),
      instagram: $('#aIg').value.trim(), studio: $('#aStudio').value.trim(),
      location: $('#aLoc').value.trim()
    };
    send.disabled = true;
    try {
      const r = await fetch('/api/artists', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not send right now.');
      // success: retire the form controls under the overlay and move focus to it
      $$('input, button', form).forEach(el => { if (el.closest('#aOk') === null) el.disabled = true; });
      const ok = $('#aOk');
      ok.hidden = false;
      ok.focus();
      $('#srlive').textContent = "You're on the list — Nick will reach out before the next event.";
    } catch (ex){
      err.textContent = ex.message; err.hidden = false;
      send.disabled = false;
    }
  });
}

/* ---------- Init ---------- */
function init(){
  $('#yr').textContent = new Date().getFullYear();
  splitWordmark();
  cursor(); constellation(); emblem(); typewriter(); marquee(); nav();
  stencil(); stats(); reveals();
  collection(); composer(); lights(); artists(); atlas();
  loadWall().then(liveWall).then(() => {
    // ?peek=<y> — shift the page up by <y> px after content is built.
    // Uses a transform (not scroll) so headless screenshot tools rasterize it.
    if (params.has('peek')){
      document.documentElement.style.background = '#0A0A0B';
      document.body.style.transform = `translateY(-${+params.get('peek') || 0}px)`;
    }
  });
  const heroEl = $('#hero');
  if (heroEl && 'IntersectionObserver' in window && !STILL){
    new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }, {threshold:0}).observe(heroEl);
  }
  preloader();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
