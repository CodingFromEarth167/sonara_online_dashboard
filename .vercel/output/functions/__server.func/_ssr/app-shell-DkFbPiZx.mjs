import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CodeXml, n as Radio, o as AudioLines, s as Activity } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-DkFbPiZx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_ENGINE = {
	calibration: 94,
	thresholdDb: 12,
	baselineAlpha: .04
};
function analyzeSamples(samples, calibration = DEFAULT_ENGINE.calibration) {
	const n = samples.length || 1;
	let sum = 0;
	let peak = 0;
	for (let i = 0; i < samples.length; i++) {
		const x = samples[i] ?? 0;
		sum += x;
		const a = Math.abs(x);
		if (a > peak) peak = a;
	}
	const mean = sum / n;
	let ac = 0;
	let crossings = 0;
	let prev = (samples[0] ?? 0) - mean;
	for (let i = 0; i < samples.length; i++) {
		const d = (samples[i] ?? 0) - mean;
		ac += d * d;
		if (prev >= 0 && d < 0 || prev < 0 && d >= 0) crossings += 1;
		prev = d;
	}
	const rms = Math.sqrt(ac / n);
	const zcr = crossings / n;
	const dbfs = rms > 1e-8 ? 20 * Math.log10(rms) : -90;
	const spl = clamp(dbfs + calibration, 18, 120);
	return {
		rms,
		peak,
		zcr,
		dbfs,
		mean,
		spl
	};
}
function classifyEvent(analysis, baseline, isAnomaly) {
	if (!isAnomaly) {
		if (analysis.spl < 48) return "quiet";
		if (analysis.spl < 62) return "traffic";
		return "congestion";
	}
	if ((analysis.rms > 1e-6 ? analysis.peak / analysis.rms : 0) > 2.6 && analysis.zcr > .12) return "impact";
	if (analysis.zcr > .16 && analysis.spl < baseline + 22) return "wildlife";
	if (analysis.zcr < .09) return "engine";
	if (analysis.spl >= 72) return "congestion";
	return "traffic";
}
function detectAnomaly(analysis, baseline, thresholdDb) {
	const delta = analysis.spl - baseline;
	const isAnomaly = delta >= thresholdDb;
	return {
		isAnomaly,
		delta,
		baseline,
		kind: classifyEvent(analysis, baseline, isAnomaly)
	};
}
function updateBaseline(baseline, spl, isAnomaly, alpha = DEFAULT_ENGINE.baselineAlpha) {
	if (isAnomaly) return baseline;
	return baseline * (1 - alpha) + spl * alpha;
}
function intensityFromSpl(spl, floor = 32, ceil = 92) {
	return clamp((spl - floor) / (ceil - floor), 0, 1);
}
var KIND_LABEL = {
	quiet: "Ambient",
	traffic: "Traffic",
	congestion: "Congestion",
	engine: "Engine roar",
	wildlife: "Wildlife",
	impact: "Sharp burst"
};
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
var BOARD_LABEL = {
	esp32: "ESP32 DevKit",
	magicbit: "MagicBit",
	"magicbit-tiny": "MagicBit Tiny",
	"magicbit-ext": "MagicBit Extension"
};
var STATIONS = [
	{
		id: "school",
		name: "Oakridge School",
		place: "Drop-off loop",
		kind: "school",
		board: "magicbit",
		x: 18,
		y: 44,
		baselineDb: 44,
		liveDb: 46,
		kindNow: "quiet",
		online: true
	},
	{
		id: "transit",
		name: "Harbor Transit",
		place: "Bus plaza",
		kind: "transit",
		board: "esp32",
		x: 48,
		y: 16,
		baselineDb: 58,
		liveDb: 61,
		kindNow: "traffic",
		online: true
	},
	{
		id: "park",
		name: "Riverside Park",
		place: "Canopy edge",
		kind: "park",
		board: "magicbit-tiny",
		x: 78,
		y: 22,
		baselineDb: 36,
		liveDb: 37,
		kindNow: "quiet",
		online: true
	},
	{
		id: "intersection",
		name: "5th & Harbor",
		place: "Main crossing",
		kind: "intersection",
		board: "magicbit-ext",
		x: 49,
		y: 52,
		baselineDb: 62,
		liveDb: 66,
		kindNow: "congestion",
		online: true
	},
	{
		id: "library",
		name: "Willow Library",
		place: "Reading court",
		kind: "library",
		board: "magicbit",
		x: 22,
		y: 74,
		baselineDb: 38,
		liveDb: 39,
		kindNow: "quiet",
		online: true
	},
	{
		id: "creek",
		name: "Willow Creek",
		place: "Wildlife corridor",
		kind: "wildlife",
		board: "magicbit-tiny",
		x: 84,
		y: 78,
		baselineDb: 34,
		liveDb: 35,
		kindNow: "quiet",
		online: true
	},
	{
		id: "live",
		name: "This device",
		place: "Browser microphone",
		kind: "live",
		board: "esp32",
		x: 8,
		y: 12,
		baselineDb: 40,
		liveDb: 40,
		kindNow: "quiet",
		online: false
	}
];
function hourProfile(kind, hour) {
	const rushAm = hour >= 7 && hour <= 9;
	const rushPm = hour >= 16 && hour <= 19;
	const dusk = hour >= 18 && hour <= 21;
	const night = hour >= 22 || hour <= 5;
	const pickup = hour >= 14 && hour <= 16;
	switch (kind) {
		case "school":
			if (rushAm) return 68;
			if (pickup) return 66;
			if (night) return 32;
			return 44;
		case "intersection":
			if (rushAm || rushPm) return 78;
			if (night) return 48;
			return 64;
		case "transit":
			if (rushAm || rushPm) return 74;
			if (night) return 50;
			return 62;
		case "park":
			if (dusk) return 42;
			if (night) return 30;
			return 36;
		case "wildlife":
			if (dusk) return 46;
			if (night) return 38;
			return 33;
		case "library":
			if (hour >= 10 && hour <= 16) return 42;
			if (night) return 28;
			return 36;
		case "live": return 40;
	}
}
function likelyKind(kind, spl, hour) {
	if (spl < 48) return "quiet";
	if (kind === "wildlife" || kind === "park") {
		if (hour >= 18 || hour <= 6) return "wildlife";
		return spl > 55 ? "wildlife" : "quiet";
	}
	if (kind === "intersection" || kind === "transit") return spl >= 74 ? "congestion" : spl >= 70 ? "engine" : "traffic";
	if (kind === "school") return spl >= 70 ? "impact" : "traffic";
	return "traffic";
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return function next() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function jitter(rand, center, spread) {
	return center + (rand() * 2 - 1) * spread;
}
var MAX_EVENTS = 240;
var STORAGE_KEY = "sonara-log-v2";
function uid() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function loadEvents() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		const cutoff = Date.now() - 864e5;
		return parsed.filter((e) => e.ts >= cutoff);
	} catch {
		return [];
	}
}
function saveEvents(events) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
	} catch {}
}
function seedHistory(now = Date.now()) {
	const rand = mulberry32(20260921);
	const stations = STATIONS.map((s) => ({ ...s }));
	const events = [];
	for (let h = 23; h >= 0; h--) {
		const hourStart = now - h * 60 * 60 * 1e3;
		const hour = new Date(hourStart).getHours();
		for (const s of stations) {
			if (s.id === "live") continue;
			const base = hourProfile(s.kind, hour);
			if (rand() > .62) {
				const kind = likelyKind(s.kind, base + 12, hour);
				events.push({
					id: uid(),
					stationId: s.id,
					ts: hourStart + Math.floor(rand() * 50 * 60 * 1e3),
					spl: Math.round((base + 8 + rand() * 12) * 10) / 10,
					kind: kind === "quiet" ? "traffic" : kind,
					delta: 8 + rand() * 12
				});
			}
		}
	}
	[
		"engine",
		"wildlife",
		"impact",
		"congestion"
	].forEach((kind, i) => {
		const station = stations[i * 2 % (stations.length - 1)];
		if (!station || station.id === "live") return;
		events.push({
			id: uid(),
			stationId: station.id,
			ts: now - (4 + i * 7) * 60 * 1e3,
			spl: kind === "wildlife" ? 54 : 78 + i,
			kind,
			delta: 11 + i
		});
	});
	const hour = new Date(now).getHours();
	for (const s of stations) {
		if (s.id === "live") continue;
		s.liveDb = jitter(rand, hourProfile(s.kind, hour), 3);
		s.kindNow = likelyKind(s.kind, s.liveDb, hour);
	}
	events.sort((a, b) => b.ts - a.ts);
	return {
		stations,
		events: events.slice(0, 80)
	};
}
function emptyHeat() {
	const heat = {};
	for (const s of STATIONS) heat[s.id] = Array.from({ length: 24 }, (_, hour) => hourProfile(s.kind, hour));
	return heat;
}
var useSonara = create((set, get) => ({
	stations: STATIONS.map((s) => ({ ...s })),
	events: [],
	selectedId: "intersection",
	listening: false,
	micError: null,
	calibration: 94,
	thresholdDb: 12,
	hourHeat: emptyHeat(),
	hydrated: false,
	hydrate: () => {
		if (get().hydrated) return;
		const stored = loadEvents();
		const seeded = seedHistory();
		const events = stored.length >= 8 ? stored : [...seeded.events, ...stored].slice(0, MAX_EVENTS);
		saveEvents(events);
		set({
			stations: seeded.stations,
			events,
			hourHeat: emptyHeat(),
			hydrated: true
		});
	},
	select: (id) => set({ selectedId: id }),
	setListening: (on, error = null) => set((state) => ({
		listening: on,
		micError: error,
		stations: state.stations.map((s) => s.id === "live" ? {
			...s,
			online: on
		} : s)
	})),
	setCalibration: (n) => set({ calibration: n }),
	setThreshold: (n) => set({ thresholdDb: n }),
	applyLive: (frame) => {
		const now = Date.now();
		set((state) => {
			const stations = state.stations.map((s) => s.id === "live" ? {
				...s,
				liveDb: frame.spl,
				kindNow: frame.kind,
				online: true,
				baselineDb: updateBaseline(s.baselineDb, frame.spl, frame.anomaly)
			} : s);
			let events = state.events;
			if (frame.anomaly) {
				const last = events.find((e) => e.stationId === "live");
				if (!last || now - last.ts > 4e3) {
					events = [{
						id: uid(),
						stationId: "live",
						ts: now,
						spl: frame.spl,
						kind: frame.kind,
						delta: frame.delta
					}, ...events].slice(0, MAX_EVENTS);
					saveEvents(events);
				}
			}
			const hour = new Date(now).getHours();
			const hourHeat = { ...state.hourHeat };
			const row = hourHeat.live ? [...hourHeat.live] : Array(24).fill(40);
			row[hour] = frame.spl;
			hourHeat.live = row;
			return {
				stations,
				events,
				hourHeat
			};
		});
	},
	tick: (now = Date.now()) => {
		const rand = Math.random;
		const hour = new Date(now).getHours();
		const { thresholdDb } = get();
		set((state) => {
			const stations = state.stations.map((s) => {
				if (s.id === "live") return s;
				const target = hourProfile(s.kind, hour);
				const wander = s.liveDb * .82 + (target + (rand() * 4 - 2)) * .18;
				const spike = rand() < .045 ? target + 10 + rand() * 16 : wander;
				const liveDb = Math.max(22, Math.min(102, spike));
				const anomaly = detectAnomaly({
					rms: intensityFromSpl(liveDb),
					peak: intensityFromSpl(liveDb) * (.8 + rand() * .8),
					zcr: s.kind === "wildlife" || s.kind === "park" ? .18 + rand() * .08 : .05 + rand() * .06,
					dbfs: liveDb - 94,
					spl: liveDb,
					mean: 0
				}, s.baselineDb, thresholdDb);
				return {
					...s,
					liveDb,
					kindNow: anomaly.kind,
					baselineDb: updateBaseline(s.baselineDb, liveDb, anomaly.isAnomaly)
				};
			});
			let events = state.events;
			for (const s of stations) {
				if (s.id === "live") continue;
				const prev = state.stations.find((p) => p.id === s.id);
				const jumped = prev && s.liveDb - prev.liveDb > thresholdDb * .7;
				const over = s.liveDb - s.baselineDb >= thresholdDb;
				if (jumped && over && rand() < .55) events = [{
					id: uid(),
					stationId: s.id,
					ts: now,
					spl: Math.round(s.liveDb * 10) / 10,
					kind: s.kindNow === "quiet" ? "traffic" : s.kindNow,
					delta: s.liveDb - s.baselineDb
				}, ...events].slice(0, MAX_EVENTS);
			}
			if (events !== state.events) saveEvents(events);
			const hourHeat = { ...state.hourHeat };
			for (const s of stations) {
				const row = hourHeat[s.id] ? [...hourHeat[s.id]] : Array(24).fill(s.baselineDb);
				row[hour] = Math.round(s.liveDb);
				hourHeat[s.id] = row;
			}
			return {
				stations,
				events,
				hourHeat
			};
		});
	},
	replayDemo: (kind) => {
		const now = Date.now();
		const selected = get().selectedId === "live" ? "intersection" : get().selectedId;
		const spl = kind === "wildlife" ? 54 : kind === "impact" ? 86 : kind === "engine" ? 82 : 76;
		set((state) => {
			const events = [{
				id: uid(),
				stationId: selected,
				ts: now,
				spl,
				kind,
				delta: 14
			}, ...state.events].slice(0, MAX_EVENTS);
			saveEvents(events);
			return {
				events,
				stations: state.stations.map((s) => s.id === selected ? {
					...s,
					liveDb: spl,
					kindNow: kind
				} : s),
				selectedId: selected
			};
		});
	}
}));
function useLiveMic() {
	const listening = useSonara((s) => s.listening);
	const calibration = useSonara((s) => s.calibration);
	const thresholdDb = useSonara((s) => s.thresholdDb);
	const applyLive = useSonara((s) => s.applyLive);
	const setListening = useSonara((s) => s.setListening);
	const ctxRef = (0, import_react.useRef)(null);
	const baselineRef = (0, import_react.useRef)(42);
	(0, import_react.useEffect)(() => {
		if (!listening) {
			ctxRef.current?.close();
			ctxRef.current = null;
			return;
		}
		let raf = 0;
		let stopped = false;
		const buffer = /* @__PURE__ */ new Float32Array(2048);
		async function start() {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: false,
						noiseSuppression: false,
						autoGainControl: false
					},
					video: false
				});
				if (stopped) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				const ctx = new AudioContext();
				ctxRef.current = ctx;
				const source = ctx.createMediaStreamSource(stream);
				const analyser = ctx.createAnalyser();
				analyser.fftSize = 2048;
				source.connect(analyser);
				const tick = () => {
					if (stopped) return;
					analyser.getFloatTimeDomainData(buffer);
					const analysis = analyzeSamples(buffer, calibration);
					const anomaly = detectAnomaly(analysis, baselineRef.current, thresholdDb);
					baselineRef.current = updateBaseline(baselineRef.current, analysis.spl, anomaly.isAnomaly);
					applyLive({
						spl: analysis.spl,
						kind: anomaly.kind,
						anomaly: anomaly.isAnomaly,
						delta: anomaly.delta
					});
					raf = requestAnimationFrame(tick);
				};
				raf = requestAnimationFrame(tick);
			} catch {
				setListening(false, "Microphone permission was blocked.");
			}
		}
		start();
		return () => {
			stopped = true;
			cancelAnimationFrame(raf);
			ctxRef.current?.close();
			ctxRef.current = null;
		};
	}, [
		listening,
		calibration,
		thresholdDb,
		applyLive,
		setListening
	]);
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full shadow-[var(--shadow-border)] transition-colors duration-[var(--motion-quick)] data-[state=checked]:bg-accent data-[state=unchecked]:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform duration-[var(--motion-quick)] data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-accent-fg" })
	});
}
var NAV = [
	{
		to: "/",
		label: "Field",
		icon: Radio
	},
	{
		to: "/log",
		label: "Log",
		icon: Activity
	},
	{
		to: "/lab",
		label: "Lab",
		icon: CodeXml
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const hydrate = useSonara((s) => s.hydrate);
	const tick = useSonara((s) => s.tick);
	const listening = useSonara((s) => s.listening);
	const setListening = useSonara((s) => s.setListening);
	const events = useSonara((s) => s.events);
	const stations = useSonara((s) => s.stations);
	useLiveMic();
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => tick(), 1100);
		return () => window.clearInterval(id);
	}, [tick]);
	const online = stations.filter((s) => s.online).length;
	const anomalies = events.filter((e) => Date.now() - e.ts < 36e5).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-baseline gap-2 no-underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-medium tracking-tight text-fg",
							children: "Sonara"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs tracking-[0.18em] text-muted uppercase sm:inline",
							children: "Acoustic field"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3 sm:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted tabular-nums",
							children: [online, " live"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex items-center gap-1",
					"aria-label": "Primary",
					children: NAV.map((item) => {
						const active = pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("inline-flex h-11 items-center gap-2 rounded-sm px-3 text-sm no-underline transition-colors duration-[var(--motion-quick)]", active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-4 text-xs text-muted sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [online, " nodes"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [anomalies, " alerts / hr"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-11 items-center gap-2 rounded-sm px-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { className: "size-4 text-muted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Listen"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: listening,
								onCheckedChange: (on) => setListening(on),
								"aria-label": "Use this device as a live microphone node"
							})
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-h-0 flex-1 flex-col",
			children
		})]
	});
}
//#endregion
export { intensityFromSpl as a, STATIONS as i, BOARD_LABEL as n, useSonara as o, KIND_LABEL as r, AppShell as t };
