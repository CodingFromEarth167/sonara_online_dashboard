import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Check, r as Copy } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-DkFbPiZx.mjs";
import { t as Button } from "./button-DdKF2zOF.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lab-DNPVMqM1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CodeBlock({ code, filename }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-lg bg-surface-2 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate font-mono text-xs text-muted",
				children: filename
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: () => void copy(),
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied" : "Copy"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "max-h-[32rem] overflow-auto p-4 text-xs leading-relaxed text-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "font-mono",
				children: code
			})
		})]
	});
}
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center gap-1 rounded-md bg-surface-2 p-1 text-muted", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-9 items-center justify-center rounded-sm px-3 text-sm font-medium transition-colors duration-[var(--motion-quick)] data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=inactive]:hover:text-fg", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4 outline-none", className),
		...props
	});
}
var SONARA_JS = `/**
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
`;
var SONARA_INO = `/*
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
`;
function LabPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: "Lab"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-medium",
				children: "JavaScript listener"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "The heatmap runs this JavaScript engine. Use the same math on a MAX4466 microphone wired to an ESP32, MagicBit, MagicBit Tiny, or MagicBit Extension."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "js",
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-full justify-start overflow-x-auto sm:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "js",
								children: "JavaScript"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "wiring",
								children: "Wiring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "boards",
								children: "Boards"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "arduino",
								children: "Arduino"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "js",
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "space-y-3 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: "1. Sample a 50 ms window"
									}), " from the mic (Web Audio here, analogRead on the board)."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: "2. Remove DC bias"
									}), " — MAX4466 rests at VCC/2, so we subtract the mean before measuring energy."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: "3. RMS, peak, zero-crossings"
									}), " become an estimated SPL in dB."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: "4. Compare to a slow baseline."
									}), " A jump of +12 dB is an anomaly: engine, congestion, wildlife, or a sharp burst."] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/firmware/sonara.js",
									download: true,
									className: "text-fg underline decoration-border underline-offset-4",
									children: "Download sonara.js"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
								filename: "sonara.js",
								code: SONARA_JS
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "wiring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "border-b border-border text-xs tracking-wide text-muted uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "MAX4466"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "ESP32 / MagicBit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Notes"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: "VCC"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: "3.3V"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-muted",
												children: "Never 5V — ADC max is 3.3V"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: "GND"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: "GND"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-muted",
												children: "Common ground"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: "OUT"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: "GPIO 32"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-muted",
											children: "ADC1_CH4, free on all four boards"
										})
									] })
								] })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: "Plug the ESP32 and sensor into a breadboard with male-to-female jumpers. Upload over USB, then run from a power bank for a field video. On MagicBit, GPIO 36 is the LDR and GPIO 39 is the potentiometer — leave those alone and use 32 for the mic."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "boards",
						className: "space-y-4 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl text-fg",
									children: "Arduino IDE plugin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: "Preferences → Additional Board Manager URLs, paste:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 break-all font-mono text-xs text-fg",
									children: "https://github.com/magicbitlk/arduino-esp32/releases/download/Magicbit/package_magicbit_index.json"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3",
									children: "Boards Manager → install Magicbit. Then Tools → Board → MagicBit, MagicBit Tiny, or MagicBit Extension. For a generic NodeMCU ESP32, use the Espressif ESP32 package and pick ESP32 Dev Module."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "MagicBit"
								}), " — OLED, LEDs on 16/18, buzzer on 25. Sketch blinks green while quiet and yellow on an anomaly."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "MagicBit Tiny"
								}), " — same mic pin (GPIO 32), onboard LED as status."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "MagicBit Extension"
								}), " — analog header still GPIO 32 for the MAX4466."] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "arduino",
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Optional C++ firmware if you flash from Arduino IDE. Change SONARA_BOARD at the top, then set Wi-Fi. The dashboard you are using now is already driven by the JavaScript engine."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/firmware/sonara.ino",
									download: true,
									className: "text-fg underline decoration-border underline-offset-4",
									children: "Download sonara.ino"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
								filename: "sonara.ino",
								code: SONARA_INO
							})
						]
					})
				]
			})
		]
	}) });
}
//#endregion
export { LabPage as component };
