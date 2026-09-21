import{a as e,at as t,d as n,f as r,m as i,o as a,p as o,r as s,rt as c,t as l,w as u}from"./utils-C6LglyjQ.js";import{n as d}from"./dist-CR4wx20U.js";import{a as f,i as p,o as m}from"./index-lIjb_rPZ.js";import{n as h,r as g,t as _}from"./dist-DDnymfhr.js";var v=i(`check`,[[`path`,{d:`M20 6 9 17l-5-5`,key:`1gmf2c`}]]),y=i(`copy`,[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]),b=t(c(),1),x=u();function S({code:e,filename:t}){let[n,r]=(0,b.useState)(!1);async function i(){try{await navigator.clipboard.writeText(e),r(!0),window.setTimeout(()=>r(!1),1600)}catch{}}return(0,x.jsxs)(`div`,{className:`overflow-hidden rounded-lg bg-surface-2 shadow-[var(--shadow-border)]`,children:[(0,x.jsxs)(`div`,{className:`flex items-center justify-between gap-3 border-b border-border px-3 py-2`,children:[(0,x.jsx)(`p`,{className:`truncate font-mono text-xs text-muted`,children:t}),(0,x.jsxs)(h,{type:`button`,variant:`ghost`,size:`sm`,onClick:()=>void i(),children:[n?(0,x.jsx)(v,{className:`size-4`}):(0,x.jsx)(y,{className:`size-4`}),n?`Copied`:`Copy`]})]}),(0,x.jsx)(`pre`,{className:`max-h-[32rem] overflow-auto p-4 text-xs leading-relaxed text-fg`,children:(0,x.jsx)(`code`,{className:`font-mono`,children:e})})]})}var C=Object.defineProperty,w=(e,t)=>C(e,`name`,{value:t,configurable:!0}),T=!1;function E(){let[e,t]=b.useState(T);return b.useEffect(()=>{T||(T=!0,t(!0))},[]),e}w(E,`useIsHydrated`);var D=b.useSyncExternalStore;function O(){return()=>{}}w(O,`subscribe`);function k(){return D(O,()=>!0,()=>!1)}w(k,`useIsHydratedModern`);var A=typeof D==`function`?k:E,j=Object.defineProperty,M=(e,t)=>j(e,`name`,{value:t,configurable:!0}),N=`rovingFocusGroup.onEntryFocus`,ee={bubbles:!1,cancelable:!0},P=`RovingFocusGroup`,[F,I,te]=_(P),[ne,L]=n(P,[te]),[re,ie]=ne(P),ae=b.forwardRef(M(function(e,t){return(0,x.jsx)(F.Provider,{scope:e.__scopeRovingFocusGroup,children:(0,x.jsx)(F.Slot,{scope:e.__scopeRovingFocusGroup,children:(0,x.jsx)(R,{...e,ref:t})})})},`RovingFocusGroup`)),R=b.forwardRef(M(function(e,t){let{__scopeRovingFocusGroup:n,orientation:i,loop:c=!1,dir:l,currentTabStopId:u,defaultCurrentTabStopId:d,onCurrentTabStopIdChange:f,onEntryFocus:p,preventScrollOnEntryFocus:h=!1,..._}=e,v=b.useRef(null),y=r(t,v),S=g(l),[C,w]=s({prop:u,defaultProp:d??null,onChange:f,caller:P}),[T,E]=b.useState(!1),D=m(p),O=I(n),k=b.useRef(!1),[A,j]=b.useState(0);return b.useEffect(()=>{let e=v.current;if(e)return e.addEventListener(N,D),()=>e.removeEventListener(N,D)},[D]),(0,x.jsx)(re,{scope:n,orientation:i,dir:S,loop:c,currentTabStopId:C,onItemFocus:b.useCallback(e=>w(e),[w]),onItemShiftTab:b.useCallback(()=>E(!0),[]),onFocusableItemAdd:b.useCallback(()=>j(e=>e+1),[]),onFocusableItemRemove:b.useCallback(()=>j(e=>e-1),[]),children:(0,x.jsx)(a.div,{tabIndex:T||A===0?-1:0,"data-orientation":i,..._,ref:y,style:{outline:`none`,...e.style},onMouseDown:o(e.onMouseDown,()=>{k.current=!0}),onFocus:o(e.onFocus,e=>{let t=!k.current;if(e.target===e.currentTarget&&t&&!T){let t=new CustomEvent(N,ee);if(e.currentTarget.dispatchEvent(t),!t.defaultPrevented){let e=O().filter(e=>e.focusable);V([e.find(e=>e.active),e.find(e=>e.id===C),...e].filter(Boolean).map(e=>e.ref.current),h)}}k.current=!1}),onBlur:o(e.onBlur,()=>E(!1))})})},`RovingFocusGroupImpl`)),oe=`RovingFocusGroupItem`,se=b.forwardRef(M(function(t,n){let{__scopeRovingFocusGroup:r,focusable:i=!0,active:s=!1,tabStopId:c,children:l,...u}=t,d=f(),p=c||d,m=ie(oe,r),h=m.currentTabStopId===p,g=I(r),{onFocusableItemAdd:_,onFocusableItemRemove:v,currentTabStopId:y}=m,S=A();return e(()=>{if(S&&i)return _(),()=>v()},[S,i,_,v]),b.useEffect(()=>{if(!S&&i)return _(),()=>v()},[S,i,_,v]),(0,x.jsx)(F.ItemSlot,{scope:r,id:p,focusable:i,active:s,children:(0,x.jsx)(a.span,{tabIndex:h?0:-1,"data-orientation":m.orientation,...u,ref:n,onMouseDown:o(t.onMouseDown,e=>{i?m.onItemFocus(p):e.preventDefault()}),onFocus:o(t.onFocus,()=>m.onItemFocus(p)),onKeyDown:o(t.onKeyDown,e=>{if(e.key===`Tab`&&e.shiftKey){m.onItemShiftTab();return}if(e.target!==e.currentTarget)return;let t=B(e,m.orientation,m.dir);if(t!==void 0){if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();let n=g().filter(e=>e.focusable).map(e=>e.ref.current);if(t===`last`)n.reverse();else if(t===`prev`||t===`next`){t===`prev`&&n.reverse();let r=n.indexOf(e.currentTarget);n=m.loop?H(n,r+1):n.slice(r+1)}setTimeout(()=>V(n))}}),children:typeof l==`function`?l({isCurrentTabStop:h,hasTabStop:y!=null}):l})})},`RovingFocusGroupItem`)),ce={ArrowLeft:`prev`,ArrowUp:`prev`,ArrowRight:`next`,ArrowDown:`next`,PageUp:`first`,Home:`first`,PageDown:`last`,End:`last`};function z(e,t){return t===`rtl`?e===`ArrowLeft`?`ArrowRight`:e===`ArrowRight`?`ArrowLeft`:e:e}M(z,`getDirectionAwareKey`);function B(e,t,n){let r=z(e.key,n);if(!(t===`vertical`&&[`ArrowLeft`,`ArrowRight`].includes(r))&&!(t===`horizontal`&&[`ArrowUp`,`ArrowDown`].includes(r)))return ce[r]}M(B,`getFocusIntent`);function V(e,t=!1){let n=document.activeElement;for(let r of e)if(r===n||(r.focus({preventScroll:t}),document.activeElement!==n))return}M(V,`focusFirst`);function H(e,t){return e.map((n,r)=>e[(t+r)%e.length])}M(H,`wrapArray`);var U=ae,W=se,le=Object.defineProperty,G=(e,t)=>le(e,`name`,{value:t,configurable:!0}),K=`Tabs`,[ue,de]=n(K,[L]),q=L(),[fe,J]=ue(K),pe=b.forwardRef(G(function(e,t){let{__scopeTabs:n,value:r,onValueChange:i,defaultValue:o,orientation:c=`horizontal`,dir:l,activationMode:u=`automatic`,...d}=e,p=g(l),[m,h]=s({prop:r,onChange:i,defaultProp:o??``,caller:K});return(0,x.jsx)(fe,{scope:n,baseId:f(),value:m,onValueChange:h,orientation:c,dir:p,activationMode:u,children:(0,x.jsx)(a.div,{dir:p,"data-orientation":c,...d,ref:t})})},`Tabs`)),me=`TabsList`,he=b.forwardRef(G(function(e,t){let{__scopeTabs:n,loop:r=!0,...i}=e,o=J(me,n),s=q(n);return(0,x.jsx)(U,{asChild:!0,...s,orientation:o.orientation,dir:o.dir,loop:r,children:(0,x.jsx)(a.div,{role:`tablist`,"aria-orientation":o.orientation,...i,ref:t})})},`TabsList`)),ge=`TabsTrigger`,_e=b.forwardRef(G(function(e,t){let{__scopeTabs:n,value:r,disabled:i=!1,...s}=e,c=J(ge,n),l=q(n),u=Y(c.baseId,r),d=X(c.baseId,r),f=r===c.value;return(0,x.jsx)(W,{asChild:!0,...l,focusable:!i,active:f,children:(0,x.jsx)(a.button,{type:`button`,role:`tab`,"aria-selected":f,"aria-controls":d,"data-state":f?`active`:`inactive`,"data-disabled":i?``:void 0,disabled:i,id:u,...s,ref:t,onMouseDown:o(e.onMouseDown,e=>{!i&&e.button===0&&e.ctrlKey===!1?c.onValueChange(r):e.preventDefault()}),onKeyDown:o(e.onKeyDown,e=>{i||e.target!==e.currentTarget||[` `,`Enter`].includes(e.key)&&c.onValueChange(r)}),onFocus:o(e.onFocus,()=>{let e=c.activationMode!==`manual`;!f&&!i&&e&&c.onValueChange(r)})})})},`TabsTrigger`)),ve=`TabsContent`,ye=b.forwardRef(G(function(e,t){let{__scopeTabs:n,value:r,forceMount:i,children:o,...s}=e,c=J(ve,n),l=Y(c.baseId,r),u=X(c.baseId,r),d=r===c.value,f=b.useRef(d);return b.useEffect(()=>{let e=requestAnimationFrame(()=>f.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,x.jsx)(p,{present:i||d,children:({present:n})=>(0,x.jsx)(a.div,{"data-state":d?`active`:`inactive`,"data-orientation":c.orientation,role:`tabpanel`,"aria-labelledby":l,hidden:!n,id:u,tabIndex:0,...s,ref:t,style:{...e.style,animationDuration:f.current?`0s`:void 0},children:n&&o})})},`TabsContent`));function Y(e,t){return`${e}-trigger-${t}`}G(Y,`makeTriggerId`);function X(e,t){return`${e}-content-${t}`}G(X,`makeContentId`);var Z=pe,be=he,xe=_e,Se=ye,Ce=Z;function we({className:e,...t}){return(0,x.jsx)(be,{className:l(`inline-flex h-11 items-center gap-1 rounded-md bg-surface-2 p-1 text-muted`,e),...t})}function Q({className:e,...t}){return(0,x.jsx)(xe,{className:l(`inline-flex h-9 items-center justify-center rounded-sm px-3 text-sm font-medium transition-colors duration-[var(--motion-quick)] data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=inactive]:hover:text-fg`,e),...t})}function $({className:e,...t}){return(0,x.jsx)(Se,{className:l(`mt-4 outline-none`,e),...t})}var Te=`/**
 * Sonara listener — JavaScript
 * Works in the browser (Web Audio) on this dashboard.
 * Same algorithm as the MagicBit / ESP32 Arduino sketch.
 *
 * MAX4466 wiring (all boards, 3.3V ONLY):
 *   VCC → 3.3V
 *   GND → GND
 *   OUT → GPIO 32  (ADC1_CH4 — safe on ESP32, MagicBit, Tiny, Extension)
 *
 * Arduino IDE boards plugin (MagicBit family):
 *   https://github.com/magicbitlk/arduino-esp32/releases/download/Magicbit/package_magicbit_index.json
 *   Tools → Board → MagicBit / MagicBit Tiny / MagicBit Extension
 */

export const DEFAULTS = {
  calibration: 94,   // add to dBFS to estimate SPL
  thresholdDb: 12,   // jump above baseline that counts as an anomaly
  baselineAlpha: 0.04,
};

export function analyzeSamples(samples, calibration = DEFAULTS.calibration) {
  const n = samples.length || 1;
  let sum = 0;
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const x = samples[i];
    sum += x;
    const a = Math.abs(x);
    if (a > peak) peak = a;
  }
  const mean = sum / n; // MAX4466 DC bias sits near VCC/2

  let ac = 0;
  let crossings = 0;
  let prev = samples[0] - mean;
  for (let i = 0; i < samples.length; i++) {
    const d = samples[i] - mean;
    ac += d * d;
    if ((prev >= 0 && d < 0) || (prev < 0 && d >= 0)) crossings += 1;
    prev = d;
  }

  const rms = Math.sqrt(ac / n);
  const zcr = crossings / n;
  const dbfs = rms > 1e-8 ? 20 * Math.log10(rms) : -90;
  const spl = Math.min(120, Math.max(18, dbfs + calibration));
  return { rms, peak, zcr, dbfs, mean, spl };
}

export function classifyEvent(analysis, baseline, isAnomaly) {
  if (!isAnomaly) {
    if (analysis.spl < 48) return "quiet";
    if (analysis.spl < 62) return "traffic";
    return "congestion";
  }
  const peakRatio = analysis.rms > 1e-6 ? analysis.peak / analysis.rms : 0;
  if (peakRatio > 2.6 && analysis.zcr > 0.12) return "impact";      // honk, bang
  if (analysis.zcr > 0.16 && analysis.spl < baseline + 22) return "wildlife";
  if (analysis.zcr < 0.09) return "engine";                         // roar / rev
  if (analysis.spl >= 72) return "congestion";
  return "traffic";
}

export function detectAnomaly(analysis, baseline, thresholdDb = DEFAULTS.thresholdDb) {
  const delta = analysis.spl - baseline;
  const isAnomaly = delta >= thresholdDb;
  return { isAnomaly, delta, baseline, kind: classifyEvent(analysis, baseline, isAnomaly) };
}

export function updateBaseline(baseline, spl, isAnomaly, alpha = DEFAULTS.baselineAlpha) {
  if (isAnomaly) return baseline;
  return baseline * (1 - alpha) + spl * alpha;
}

/** Live browser microphone — this device becomes a Sonara node. */
export async function startBrowserListener(onFrame, options = {}) {
  const calibration = options.calibration ?? DEFAULTS.calibration;
  const thresholdDb = options.thresholdDb ?? DEFAULTS.thresholdDb;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const ctx = new AudioContext();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  const buffer = new Float32Array(analyser.fftSize);
  let baseline = 42;
  let raf = 0;
  let stopped = false;

  const tick = () => {
    if (stopped) return;
    analyser.getFloatTimeDomainData(buffer);
    const analysis = analyzeSamples(buffer, calibration);
    const anomaly = detectAnomaly(analysis, baseline, thresholdDb);
    baseline = updateBaseline(baseline, analysis.spl, anomaly.isAnomaly);
    onFrame({ ...analysis, ...anomaly, ts: Date.now() });
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    stream.getTracks().forEach((t) => t.stop());
    ctx.close();
  };
}

/**
 * Payload the ESP32 / MagicBit firmware POSTs to the dashboard:
 * {
 *   deviceId, board, ts,
 *   rms, peak, spl, zcr,
 *   anomaly, kind
 * }
 */
`,Ee=`/*
 * Sonara — Acoustic Wildlife & Urban Noise Heatmapper
 * Arduino IDE sketch for:
 *   ESP32 DevKit / NodeMCU-32S
 *   MagicBit
 *   MagicBit Tiny
 *   MagicBit Extension
 *
 * MagicBit plugin
 *   File → Preferences → Additional Board Manager URLs:
 *   https://github.com/magicbitlk/arduino-esp32/releases/download/Magicbit/package_magicbit_index.json
 *   Tools → Board → Boards Manager → install "Magicbit"
 *   Tools → Board → MagicBit  (or MagicBit Tiny / MagicBit Extension)
 *
 * Wiring  Analog Sound Sensor (MAX4466)
 *   VCC → 3.3V     (never 5V on ESP32)
 *   GND → GND
 *   OUT → GPIO 32  (ADC1_CH4 — free analog on all listed boards)
 *
 * Optional: KY-037 digital pin can go to GPIO 27 as a loudness gate.
 * Breadboard + jumper wires. Power via USB or a phone power bank.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <math.h>

// ---------- choose one board profile ----------
#define BOARD_MAGICBIT        1
#define BOARD_MAGICBIT_TINY   2
#define BOARD_MAGICBIT_EXT    3
#define BOARD_ESP32_DEVKIT    4

#ifndef SONARA_BOARD
#define SONARA_BOARD BOARD_MAGICBIT
#endif

#if SONARA_BOARD == BOARD_MAGICBIT
  const int MIC_PIN = 32;
  const int LED_OK = 16;      // green
  const int LED_ALERT = 18;   // yellow
  const char* BOARD_NAME = "magicbit";
#elif SONARA_BOARD == BOARD_MAGICBIT_TINY
  const int MIC_PIN = 32;
  const int LED_OK = 2;
  const int LED_ALERT = 2;
  const char* BOARD_NAME = "magicbit-tiny";
#elif SONARA_BOARD == BOARD_MAGICBIT_EXT
  const int MIC_PIN = 32;     // Extension analog header
  const int LED_OK = 16;
  const int LED_ALERT = 18;
  const char* BOARD_NAME = "magicbit-ext";
#else
  const int MIC_PIN = 32;
  const int LED_OK = 2;
  const int LED_ALERT = 2;
  const char* BOARD_NAME = "esp32";
#endif

const char* WIFI_SSID = "YOUR_WIFI";
const char* WIFI_PASS = "YOUR_PASSWORD";
const char* DASHBOARD_URL = "https://YOUR-APP/api/ingest"; // optional
const char* DEVICE_ID = "sonara-01";

const int SAMPLE_WINDOW_MS = 50;
const float CALIBRATION = 94.0;
const float THRESHOLD_DB = 12.0;
const float BASELINE_ALPHA = 0.04;
const unsigned long POST_EVERY_MS = 4000;
const unsigned long ALERT_COOLDOWN_MS = 6000;

float baselineSpl = 40.0;
unsigned long lastPost = 0;
unsigned long lastAlert = 0;

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(250);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_OK, OUTPUT);
  pinMode(LED_ALERT, OUTPUT);
  analogReadResolution(12);
  analogSetPinAttenuation(MIC_PIN, ADC_11db);
  connectWifi();
  Serial.println("Sonara listener ready");
}

void loop() {
  unsigned long t0 = millis();
  uint32_t n = 0;
  uint64_t sum = 0;
  uint64_t sumSq = 0;
  int peak = 0;
  int prev = analogRead(MIC_PIN);
  uint32_t crossings = 0;

  while (millis() - t0 < SAMPLE_WINDOW_MS) {
    int v = analogRead(MIC_PIN);
    sum += v;
    sumSq += (uint64_t)v * v;
    int mag = abs(v - 2048);
    if (mag > peak) peak = mag;
    if ((prev >= 2048 && v < 2048) || (prev < 2048 && v >= 2048)) crossings++;
    prev = v;
    n++;
  }

  if (n == 0) return;
  float mean = (float)sum / n;
  float var = (float)sumSq / n - mean * mean;
  if (var < 0) var = 0;
  float rms = sqrt(var);
  float dbfs = 20.0 * log10(max(rms, 1.0f) / 2048.0f);
  float spl = constrain(dbfs + CALIBRATION, 18.0, 120.0);
  float zcr = (float)crossings / n;
  float delta = spl - baselineSpl;
  bool anomaly = delta >= THRESHOLD_DB;

  if (!anomaly) {
    baselineSpl = baselineSpl * (1.0 - BASELINE_ALPHA) + spl * BASELINE_ALPHA;
  }

  const char* kind = "traffic";
  if (!anomaly && spl < 48) kind = "quiet";
  else if (anomaly && zcr > 0.16) kind = "wildlife";
  else if (anomaly && zcr < 0.09) kind = "engine";
  else if (anomaly && peak > rms * 2.6) kind = "impact";
  else if (spl >= 72) kind = "congestion";

  digitalWrite(LED_OK, anomaly ? LOW : HIGH);
  digitalWrite(LED_ALERT, anomaly ? HIGH : LOW);

  Serial.printf(
    "spl=%.1f dB  baseline=%.1f  zcr=%.3f  %s  %s\\n",
    spl, baselineSpl, zcr, kind, anomaly ? "ANOMALY" : "ok"
  );

  unsigned long now = millis();
  bool due = (now - lastPost) > POST_EVERY_MS;
  bool alert = anomaly && (now - lastAlert) > ALERT_COOLDOWN_MS;
  if ((due || alert) && WiFi.status() == WL_CONNECTED && strlen(DASHBOARD_URL) > 8) {
    HTTPClient http;
    http.begin(DASHBOARD_URL);
    http.addHeader("Content-Type", "application/json");
    String body = "{";
    body += "\\"deviceId\\":\\"" + String(DEVICE_ID) + "\\",";
    body += "\\"board\\":\\"" + String(BOARD_NAME) + "\\",";
    body += "\\"ts\\":" + String((unsigned long)(millis())) + ",";
    body += "\\"rms\\":" + String(rms, 2) + ",";
    body += "\\"peak\\":" + String(peak) + ",";
    body += "\\"spl\\":" + String(spl, 1) + ",";
    body += "\\"zcr\\":" + String(zcr, 3) + ",";
    body += "\\"anomaly\\":" + String(anomaly ? "true" : "false") + ",";
    body += "\\"kind\\":\\"" + String(kind) + "\\"";
    body += "}";
    http.POST(body);
    http.end();
    lastPost = now;
    if (alert) lastAlert = now;
  }

  delay(20);
}
`;function De(){return(0,x.jsx)(d,{children:(0,x.jsxs)(`div`,{className:`mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6`,children:[(0,x.jsx)(`p`,{className:`text-xs tracking-[0.18em] text-muted uppercase`,children:`Lab`}),(0,x.jsx)(`h1`,{className:`mt-1 font-display text-3xl font-medium`,children:`JavaScript listener`}),(0,x.jsx)(`p`,{className:`mt-2 max-w-2xl text-sm text-muted`,children:`The heatmap runs this JavaScript engine. Use the same math on a MAX4466 microphone wired to an ESP32, MagicBit, MagicBit Tiny, or MagicBit Extension.`}),(0,x.jsxs)(Ce,{defaultValue:`js`,className:`mt-6`,children:[(0,x.jsxs)(we,{className:`w-full justify-start overflow-x-auto sm:w-auto`,children:[(0,x.jsx)(Q,{value:`js`,children:`JavaScript`}),(0,x.jsx)(Q,{value:`wiring`,children:`Wiring`}),(0,x.jsx)(Q,{value:`boards`,children:`Boards`}),(0,x.jsx)(Q,{value:`arduino`,children:`Arduino`})]}),(0,x.jsxs)($,{value:`js`,className:`space-y-4`,children:[(0,x.jsxs)(`ol`,{className:`space-y-3 text-sm text-muted`,children:[(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`span`,{className:`text-fg`,children:`1. Sample a 50 ms window`}),` from the mic (Web Audio here, analogRead on the board).`]}),(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`span`,{className:`text-fg`,children:`2. Remove DC bias`}),` — MAX4466 rests at VCC/2, so we subtract the mean before measuring energy.`]}),(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`span`,{className:`text-fg`,children:`3. RMS, peak, zero-crossings`}),` become an estimated SPL in dB.`]}),(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`span`,{className:`text-fg`,children:`4. Compare to a slow baseline.`}),` A jump of +12 dB is an anomaly: engine, congestion, wildlife, or a sharp burst.`]})]}),(0,x.jsx)(`p`,{className:`text-sm`,children:(0,x.jsx)(`a`,{href:`/firmware/sonara.js`,download:!0,className:`text-fg underline decoration-border underline-offset-4`,children:`Download sonara.js`})}),(0,x.jsx)(S,{filename:`sonara.js`,code:Te})]}),(0,x.jsxs)($,{value:`wiring`,children:[(0,x.jsx)(`div`,{className:`overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]`,children:(0,x.jsxs)(`table`,{className:`w-full text-left text-sm`,children:[(0,x.jsx)(`thead`,{className:`border-b border-border text-xs tracking-wide text-muted uppercase`,children:(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`th`,{className:`px-4 py-3 font-medium`,children:`MAX4466`}),(0,x.jsx)(`th`,{className:`px-4 py-3 font-medium`,children:`ESP32 / MagicBit`}),(0,x.jsx)(`th`,{className:`px-4 py-3 font-medium`,children:`Notes`})]})}),(0,x.jsxs)(`tbody`,{children:[(0,x.jsxs)(`tr`,{className:`border-b border-border`,children:[(0,x.jsx)(`td`,{className:`px-4 py-3`,children:`VCC`}),(0,x.jsx)(`td`,{className:`px-4 py-3`,children:`3.3V`}),(0,x.jsx)(`td`,{className:`px-4 py-3 text-muted`,children:`Never 5V — ADC max is 3.3V`})]}),(0,x.jsxs)(`tr`,{className:`border-b border-border`,children:[(0,x.jsx)(`td`,{className:`px-4 py-3`,children:`GND`}),(0,x.jsx)(`td`,{className:`px-4 py-3`,children:`GND`}),(0,x.jsx)(`td`,{className:`px-4 py-3 text-muted`,children:`Common ground`})]}),(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`td`,{className:`px-4 py-3`,children:`OUT`}),(0,x.jsx)(`td`,{className:`px-4 py-3`,children:`GPIO 32`}),(0,x.jsx)(`td`,{className:`px-4 py-3 text-muted`,children:`ADC1_CH4, free on all four boards`})]})]})]})}),(0,x.jsx)(`p`,{className:`mt-4 text-sm text-muted`,children:`Plug the ESP32 and sensor into a breadboard with male-to-female jumpers. Upload over USB, then run from a power bank for a field video. On MagicBit, GPIO 36 is the LDR and GPIO 39 is the potentiometer — leave those alone and use 32 for the mic.`})]}),(0,x.jsxs)($,{value:`boards`,className:`space-y-4 text-sm text-muted`,children:[(0,x.jsxs)(`div`,{className:`rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]`,children:[(0,x.jsx)(`h2`,{className:`font-display text-xl text-fg`,children:`Arduino IDE plugin`}),(0,x.jsx)(`p`,{className:`mt-2`,children:`Preferences → Additional Board Manager URLs, paste:`}),(0,x.jsx)(`p`,{className:`mt-2 break-all font-mono text-xs text-fg`,children:`https://github.com/magicbitlk/arduino-esp32/releases/download/Magicbit/package_magicbit_index.json`}),(0,x.jsx)(`p`,{className:`mt-3`,children:`Boards Manager → install Magicbit. Then Tools → Board → MagicBit, MagicBit Tiny, or MagicBit Extension. For a generic NodeMCU ESP32, use the Espressif ESP32 package and pick ESP32 Dev Module.`})]}),(0,x.jsxs)(`ul`,{className:`space-y-2`,children:[(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`span`,{className:`text-fg`,children:`MagicBit`}),` — OLED, LEDs on 16/18, buzzer on 25. Sketch blinks green while quiet and yellow on an anomaly.`]}),(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`span`,{className:`text-fg`,children:`MagicBit Tiny`}),` — same mic pin (GPIO 32), onboard LED as status.`]}),(0,x.jsxs)(`li`,{children:[(0,x.jsx)(`span`,{className:`text-fg`,children:`MagicBit Extension`}),` — analog header still GPIO 32 for the MAX4466.`]})]})]}),(0,x.jsxs)($,{value:`arduino`,className:`space-y-4`,children:[(0,x.jsx)(`p`,{className:`text-sm text-muted`,children:`Optional C++ firmware if you flash from Arduino IDE. Change SONARA_BOARD at the top, then set Wi-Fi. The dashboard you are using now is already driven by the JavaScript engine.`}),(0,x.jsx)(`p`,{className:`text-sm`,children:(0,x.jsx)(`a`,{href:`/firmware/sonara.ino`,download:!0,className:`text-fg underline decoration-border underline-offset-4`,children:`Download sonara.ino`})}),(0,x.jsx)(S,{filename:`sonara.ino`,code:Ee})]})]})]})})}export{De as component};