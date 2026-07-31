/* ===== Nick Tyler Tattoo — 3D sacred-geometry hero mark =====
   Flower of Life: 19 circles on a hex lattice + containing ring,
   rotated in 3D and stroked in four passes for an engraved-gold read.
   Replaces the interlocking-"OO" emblem from the old one-page site.
   ?still  freezes on a settled frame (screenshot mode).            */
(() => {
'use strict';
const STILL = new URLSearchParams(location.search).has('still');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv = document.getElementById('emblem');
if (!cv) return;
const stage = document.getElementById('emblemStage');
const ctx = cv.getContext('2d');
const MOBILE = innerWidth < 700;
let w, h;
const dpr = Math.min(devicePixelRatio || 1, MOBILE ? 1.3 : 1.6);

function size(){
  const r = stage.getBoundingClientRect();
  w = cv.width  = Math.max(1, r.width  * dpr);
  h = cv.height = Math.max(1, r.height * dpr);
  cv.style.width = r.width + 'px';
  cv.style.height = r.height + 'px';
}
size();
addEventListener('resize', size, {passive:true});

/* ---- hex lattice: centre + 6 + 12 = the 19-circle Flower of Life ---- */
const R = 1, S = Math.sqrt(3);
const CENTRES = [[0,0]];
for (let i = 0; i < 6; i++){
  const a = i * Math.PI / 3;
  CENTRES.push([Math.cos(a)*R, Math.sin(a)*R]);                    // inner six
  CENTRES.push([Math.cos(a)*2*R, Math.sin(a)*2*R]);                // outer six, on-axis
  const b = a + Math.PI / 6;
  CENTRES.push([Math.cos(b)*S*R, Math.sin(b)*S*R]);                // outer six, off-axis
}
const SEG = MOBILE ? 44 : 72;          // points per circle outline
const RINGS = [3*R, 3.14*R];           // the traditional containing band

/* pointer parallax — the mark leans toward the cursor */
let mx = 0, my = 0, tmx = 0, tmy = 0;
addEventListener('mousemove', e => {
  tmx = e.clientX / innerWidth  - 0.5;
  tmy = e.clientY / innerHeight - 0.5;
}, {passive:true});

/* draw-in: circles bloom outward from the centre over the first ~2.2s */
const T0 = performance.now();
const BLOOM = REDUCED || STILL ? 0 : 2200;

function render(t, bloom){
  ctx.clearRect(0, 0, w, h);
  const ox = w/2 + mx * w * 0.045;
  const oy = h * 0.5;
  const scale = Math.min(w, h) * 0.126;
  const cam = 5.2;

  const spin = Math.sin(t * 0.19) * 0.30 + mx * 0.5;
  const tilt = 0.15 + Math.sin(t * 0.26) * 0.10 + my * 0.36;
  const cy = Math.cos(spin), sy = Math.sin(spin);
  const cx = Math.cos(tilt), sx = Math.sin(tilt);
  /* rotate about Y then X, then project */
  const tx = (px, py) => {
    const x = px * cy, z = -px * sy, y = py;
    return [x, y*cx - z*sx, y*sx + z*cx];
  };

  /* halo — keeps the wordmark legible through the linework */
  const halo = ctx.createRadialGradient(ox, oy, 0, ox, oy, scale*4.6);
  halo.addColorStop(0,    'rgba(184,169,138,0.20)');
  halo.addColorStop(0.5,  'rgba(184,169,138,0.055)');
  halo.addColorStop(1,    'rgba(184,169,138,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  ctx.lineJoin = 'round';
  ctx.lineCap  = 'round';
  const gw = Math.max(1.0, Math.min(w, h) * 0.0038);

  const arc = (cx0, cy0, r, frac) => {
    const n = Math.max(2, Math.round(SEG * frac));
    ctx.beginPath();
    for (let k = 0; k <= n; k++){
      const ang = (k / SEG) * Math.PI * 2;
      const p = tx(cx0 + r*Math.cos(ang), cy0 + r*Math.sin(ang));
      const s = cam / (cam + p[2]);
      const X = ox + p[0]*scale*s, Y = oy - p[1]*scale*s;
      k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    }
    if (frac >= 1) ctx.closePath();
  };

  const grad = ctx.createLinearGradient(0, oy - scale*3.2, 0, oy + scale*3.2);
  grad.addColorStop(0,    '#f6ecd8');
  grad.addColorStop(0.5,  '#c9a866');
  grad.addColorStop(0.78, '#8a754d');
  grad.addColorStop(1,    '#54432c');

  /* four passes: bloom · shadow · gold · specular */
  const passes = [
    [3.0,  'rgba(196,162,94,0.10)'],
    [1.35, 'rgba(30,25,16,0.50)'],
    [0.95, grad],
    [0.28, 'rgba(247,241,226,0.80)']
  ];

  for (const [mul, stroke] of passes){
    ctx.lineWidth = gw * mul;
    ctx.strokeStyle = stroke;
    for (let i = 0; i < CENTRES.length; i++){
      /* stagger the bloom by distance from centre */
      const d = Math.hypot(CENTRES[i][0], CENTRES[i][1]) / (2*R);
      const f = bloom >= 1 ? 1 : clamp((bloom - d*0.45) / 0.55);
      if (f <= 0) continue;
      arc(CENTRES[i][0], CENTRES[i][1], R, f);
      ctx.stroke();
    }
    const fR = bloom >= 1 ? 1 : clamp((bloom - 0.62) / 0.38);
    if (fR > 0){
      ctx.lineWidth = gw * mul * 0.62;
      for (const r of RINGS){ arc(0, 0, r, fR); ctx.stroke(); }
    }
  }
}
const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;

/* the lattice composites every frame — don't burn GPU on a backgrounded tab */
let pageVisible = !document.hidden;
document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; }, {passive:true});

function loop(now){
  if (!pageVisible){ requestAnimationFrame(loop); return; }
  const t = now / 1000;
  const bloom = BLOOM ? clamp((now - T0) / BLOOM) : 1;
  mx += (tmx - mx) * 0.045;
  my += (tmy - my) * 0.045;
  render(t, bloom);
  /* fade + lift the crest as the hero scrolls away */
  if (stage){
    const hp = Math.min(1, scrollY / (innerHeight * 0.9));
    stage.style.opacity = (1 - hp * 0.95).toFixed(3);
    stage.style.setProperty('--epar', (-scrollY * 0.07).toFixed(1) + 'px');
  }
  if (!STILL) requestAnimationFrame(loop);
}

if (STILL){
  /* Freeze on a settled frame, then flatten to an <img>: headless Chrome does not
     composite live canvases into --screenshot captures. Screenshot mode only. */
  mx = tmx; my = tmy;
  render(3.4, 1);
  const flat = new Image();
  flat.src = cv.toDataURL('image/png');
  flat.alt = '';
  flat.setAttribute('aria-hidden', 'true');
  flat.style.cssText = 'display:block;width:100%;height:100%';
  cv.replaceWith(flat);
} else requestAnimationFrame(loop);
})();
