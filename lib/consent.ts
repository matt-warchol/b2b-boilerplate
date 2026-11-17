// Cookie consent for analytics. One small vanilla banner, used by the Next pages (root layout) and by the
// panel and demo HTML. Nothing is measured until the visitor accepts: PostHog starts opted out (lib/posthog.ts).
// Choice is kept in localStorage under "rz_consent" ("granted" | "denied"). window.rzCookies() reopens the banner.
// Own devices: open any page with ?internal=1 once to stop measuring that browser (?internal=0 undoes it).
// Admins opening /admin are marked automatically.
export const consentCss = `.rzc{position:fixed;left:16px;bottom:16px;z-index:2147483000;max-width:380px;padding:16px;border-radius:12px;border:1px solid rgba(0,0,0,.12);background:#fff;color:#18181b;box-shadow:0 8px 30px rgba(0,0,0,.15);font:14px/1.45 system-ui,sans-serif}
.rzc p{margin:0 0 12px}.rzc a{color:inherit;text-decoration:underline}
.rzc-b{display:flex;gap:8px}.rzc-b button{flex:1;padding:8px 12px;border-radius:8px;border:1px solid rgba(0,0,0,.2);background:#fff;color:#18181b;font:inherit;font-weight:500;cursor:pointer}
.rzc-b button.rzc-y{background:#18181b;color:#fff;border-color:#18181b}
.rzc-b button:focus-visible{outline:2px solid #2563eb;outline-offset:2px}
@media print{.rzc{display:none}}`;

export const consentJs = `(function(){
try{var q=location.search;if(/[?&]internal=1/.test(q))localStorage.setItem("rz_internal","1");if(/[?&]internal=0/.test(q))localStorage.removeItem("rz_internal")}catch(e){}
function get(){try{return localStorage.getItem("rz_consent")}catch(e){return null}}
function apply(v){var p=window.posthog;if(!p)return;try{if(v==="granted")p.opt_in_capturing();else p.opt_out_capturing()}catch(e){}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var box=null;
function close(){if(box){box.remove();box=null}}
function choose(v){try{localStorage.setItem("rz_consent",v)}catch(e){}apply(v);close()}
function open(){
if(box)return;
box=el("div","rzc");box.setAttribute("role","dialog");box.setAttribute("aria-label","Cookie settings");
var p=el("p",null,"We use cookies to see how the site and product are used (PostHog, EU servers), so we can improve them. No advertising cookies. ");
var a=el("a",null,"Privacy policy");a.href="/privacy#cookies";p.appendChild(a);
var row=el("div","rzc-b");
var no=el("button",null,"Reject");no.type="button";no.onclick=function(){choose("denied")};
var yes=el("button","rzc-y","Accept");yes.type="button";yes.onclick=function(){choose("granted")};
row.appendChild(no);row.appendChild(yes);box.appendChild(p);box.appendChild(row);document.body.appendChild(box);
}
window.rzCookies=open;
var v=get();
if(v==="granted"||v==="denied")apply(v);else open();
})();`;

// For the raw HTML routes (/app, /demo): style and script as one string.
export function consentSnippet() {
  return `<style>${consentCss}</style><script>${consentJs}</script>`;
}
