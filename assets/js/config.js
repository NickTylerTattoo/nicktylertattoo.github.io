/* ===== Nick Tyler Tattoo — booking endpoints, analytics IDs, Meta Pixel =====
   Loaded before app.js on every page that books or captures a lead.
   One place to change the Pixel ID or a GHL endpoint. */
(() => {
'use strict';

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };  /* GA4 stub until ga4Id is set */

window.NT_CONFIG = {
  flashBooking: 'https://link.inkedin.tools/widget/booking/y6R2c7YWViyMwwviIN2h',
  customForm:   'https://link.inkedin.tools/widget/form/3AkoAcnNx29uAvO2x7n3',
  designParam:  'single_line_38z92',   /* GHL "Design ID" field key — booking calendar prefill */
  ideaParam:    'tattoo_design',        /* GHL "Describe your tattoo idea/vision" field key — custom-form prefill */
  metaPixelId:  '598145411993915',
  ga4Id:        ''                      /* <-- paste GA4 Measurement ID to enable GA4 */
};

/* Meta Pixel */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', window.NT_CONFIG.metaPixelId);
fbq('track','PageView');
})();
