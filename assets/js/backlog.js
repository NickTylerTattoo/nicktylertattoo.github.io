/* ===== Custom backlog, read live from the Half and Full booking calendars =====
   Fills every element marked data-nt="custom-wait" with how far out the next
   open custom session is ("5 weeks out"), using the same public free-slots
   feed the GHL booking widget calls. Calendar feeds live in config.js
   (NT_CONFIG.customSlots). The markup keeps a fallback figure, so if the feed
   fails nothing breaks and no guessed number is ever shown. Cached 10 minutes
   per tab. Elements marked data-nt="custom-next" get the date itself ("Mon, Nov 9"). */
(() => {
'use strict';
const NY = 'America/New_York';
const CK = 'nt_custom_next';
const DAY = 864e5;
const nyKey = d => new Intl.DateTimeFormat('en-CA', {timeZone: NY, year: 'numeric', month: '2-digit', day: '2-digit'}).format(d);
const keyToUTC = k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d); };

async function firstOpen(api){
  let start = Date.now();
  for (let i = 0; i < 4; i++){            /* GHL caps a request near 31 days, so walk a month at a time */
    const end = start + 30 * DAY;
    const r = await fetch(`${api}?startDate=${start}&endDate=${end}&timezone=${encodeURIComponent(NY)}`, {credentials: 'omit'});
    if (!r.ok) return null;
    const j = await r.json();
    const days = Object.keys(j).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k) && j[k] && (j[k].slots || []).length).sort();
    if (days.length) return days[0];
    start = end + 1;
  }
  return null;
}

async function nextCustom(){
  try { const c = JSON.parse(sessionStorage.getItem(CK) || 'null'); if (c && Date.now() - c.t < 6e5) return c.key; } catch (e) {}
  const feeds = (window.NT_CONFIG && window.NT_CONFIG.customSlots) || [];
  if (!feeds.length) return null;
  const keys = (await Promise.all(feeds.map(f => firstOpen(f).catch(() => null)))).filter(Boolean).sort();
  const key = keys[0] || null;
  if (key) { try { sessionStorage.setItem(CK, JSON.stringify({t: Date.now(), key})); } catch (e) {} }
  return key;
}

function waitLabel(key){
  const days = Math.round((keyToUTC(key) - keyToUTC(nyKey(new Date()))) / DAY);
  if (days <= 6) return 'this week';
  const weeks = Math.round(days / 7);
  return weeks === 1 ? '1 week out' : weeks + ' weeks out';
}
function dateLabel(key){
  return new Intl.DateTimeFormat('en-US', {timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric'}).format(new Date(keyToUTC(key) + 12 * 36e5));
}

function run(){
  if (!document.querySelector('[data-nt="custom-wait"],[data-nt="custom-next"]')) return;
  nextCustom().then(key => {
    if (!key) return;
    const wait = waitLabel(key), date = dateLabel(key);
    document.querySelectorAll('[data-nt="custom-wait"]').forEach(el => { el.textContent = wait; });
    document.querySelectorAll('[data-nt="custom-next"]').forEach(el => { el.textContent = date; });
    document.querySelectorAll('[data-nt-wrap="custom-next"]').forEach(el => { el.hidden = false; });
  }).catch(() => {});
}
/* once the page has settled, so it never competes with the hero */
const go = () => ('requestIdleCallback' in window) ? requestIdleCallback(run, {timeout: 2500}) : setTimeout(run, 1200);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
