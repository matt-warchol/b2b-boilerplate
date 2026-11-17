// PostHog browser snippet (product analytics, session replay). Loads only when NEXT_PUBLIC_POSTHOG_KEY is set,
// starts opted out and measures only after the visitor accepts the cookie banner (lib/consent.ts).
export const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export function posthogSnippet(identify?: { email: string; workspace?: string; name?: string }) {
  if (!PH_KEY) return "";
  const id = identify
    ? `posthog.identify(${JSON.stringify(identify.email)},{email:${JSON.stringify(identify.email)}});` +
      (identify.workspace ? `posthog.group("workspace",${JSON.stringify(identify.workspace)},{name:${JSON.stringify(identify.name ?? "")}});` : "")
    : "";
  return `(function(){try{if(localStorage.getItem("rz_internal")==="1")return}catch(e){}!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups reset get_distinct_id get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording captureException get_property createPersonProfile opt_in_capturing opt_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init(${JSON.stringify(PH_KEY)},{api_host:${JSON.stringify(PH_HOST)},person_profiles:"identified_only",capture_pageview:"history_change",opt_out_capturing_by_default:true});${id}})();`;
}
