/* ===== Flash catalog: the one place to add, claim or reorder a design =====
   Read by app.js (flash grid, lightbox, booking) and shell.js (home page
   counts). Every "X of Y live/available" on the site is computed from this
   list, so claiming a design here updates them all; no copy edits.
   Row: [ imageId, title, cat, style, size, time, price, status ]
   status: 'live' | 'feat' (both count as available) | 'claimed'
   Display No. = array order (index+1). */
window.NTT_CATALOG = [
  ['01','Serpent & Sigil Triptych','versatile','Any Placement','5–7 in','3–4 hr',500,'live'],
  ['02','Ornamental Crest','versatile','Any Placement','4–5 in','2–3 hr',500,'claimed'],
  ['03','Lotus Filigree','versatile','Any Placement','4–6 in','2–3 hr',500,'claimed'],
  ['04','Dotwork Diadem','versatile','Any Placement','4–5 in','2–3 hr',500,'live'],
  ['05','Veiled Mandala','versatile','Any Placement','5–6 in','3 hr',500,'live'],
  ['06b','Cathedral Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'live'],
  ['06a','Crescent Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'live'],
  ['07a','Vespers Sleeve','sleeve','Outer Sleeve','Single sleeve','2 sessions',1400,'claimed'],
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
];
