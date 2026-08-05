/* ===== shared shell: mark sprite, marquee, reveals, year ===== */
(() => {
'use strict';
const STILL = new URLSearchParams(location.search).has('still');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* inject the door-mark sprite once (kept in one file so the four marks stay a family).
   Resolved from this script's own URL so it works from any path depth. */
const MARKS = new URL('../marks.html', document.currentScript.src).href;
fetch(MARKS)
  .then(r => r.ok ? r.text() : '')
  .then(html => { if (html) document.body.insertAdjacentHTML('afterbegin', html); })
  .catch(() => {});

/* marquee */
const track = document.getElementById('marquee');
if (track){
  /* Apex marquee: what's true of every path. Scarcity copy ("once it's booked
     it's gone") lives on /flash/, where it actually applies. */
  const BEATS = [
    'Fine line &middot; Ornamental &middot; Floral &middot; Blackwork &middot; Geometric',
    'By appointment &middot; Long Island, NY',
    '5.0 &#9733; &middot; 116 Google reviews',
    'No charge for design or prep',
    'Private suite &middot; Est. 2022',
    'Travel sessions available'
  ];
  const unit = '<span>' + BEATS.join('<i>&#9670;</i>') + '<i>&#9670;</i></span>';
  track.innerHTML = unit;
  let guard = 0;
  while (track.scrollWidth < innerWidth * 2 && guard++ < 12) track.innerHTML += unit;
  if (!STILL && !REDUCED){
    let x = 0, paused = false, last = performance.now();
    track.parentElement.addEventListener('mouseenter', () => paused = true);
    track.parentElement.addEventListener('mouseleave', () => paused = false);
    const step = now => {
      const dt = Math.min(48, now - last); last = now;
      if (!paused) x -= dt * 0.028;
      if (-x > track.scrollWidth / 2) x = 0;
      track.style.transform = `translateX(${x.toFixed(2)}px)`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

/* scroll reveals */
if (!STILL && !REDUCED && 'IntersectionObserver' in window){
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold: .14});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
})();
