/* ===== Nick Tyler Tattoo — booking endpoints, analytics IDs, Meta Pixel =====
   Loaded before app.js on every page that books or captures a lead.
   One place to change the Pixel ID or a GHL endpoint. */
(() => {
'use strict';

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };  /* GA4 queue; the library loads below when ga4Id is set */

window.NT_CONFIG = {
  flashBooking: 'https://link.inkedin.tools/widget/booking/y6R2c7YWViyMwwviIN2h',
  flashSlots:   'https://backend.leadconnectorhq.com/calendars/y6R2c7YWViyMwwviIN2h/free-slots',  /* same calendar's public open-dates feed, powers the "Next open" label */
  customSlots:  [   /* Full Session calendar's public open-dates feed, powers every "N weeks out" label.
                       Full only (Oct 21 2026): the Half calendar opens sooner and was dragging the label down.
                       Half Session feed, if ever wanted back: .../calendars/isfu5I4Xbv2sHq1691cC/free-slots */
    'https://backend.leadconnectorhq.com/calendars/LEHvDPS31uczTfZtHrAB/free-slots'
  ],
  customForm:   'https://link.inkedin.tools/widget/form/3AkoAcnNx29uAvO2x7n3',
  designParam:  'single_line_38z92',   /* GHL "Design ID" field key — booking calendar prefill */
  ideaParam:    'tattoo_design',        /* GHL "Describe your tattoo idea/vision" field key — custom-form prefill */
  metaPixelId:  '598145411993915',
  ga4Id:        'G-Y9Z1VR6P6E'          /* GA4 Measurement ID. Set to '' to switch GA4 off. */
};

/* Meta Pixel */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', window.NT_CONFIG.metaPixelId);
fbq('track','PageView');

/* Google Analytics (GA4): loads only when ga4Id is set above. */
if (window.NT_CONFIG.ga4Id) {
  var ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(window.NT_CONFIG.ga4Id);
  document.head.appendChild(ga);
  window.gtag('js', new Date());
  window.gtag('config', window.NT_CONFIG.ga4Id);
}
})();
