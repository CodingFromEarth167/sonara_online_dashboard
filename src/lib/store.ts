import { create } from "zustand";
import {
  BOARD_LABEL,
  hourProfile,
  likelyKind,
  STATIONS,
  type NoiseEvent,
  type Station,
} from "./stations";
import { mulberry32, jitter } from "./rng";
import {
  detectAnomaly,
  type EventKind,
  intensityFromSpl,
  updateBaseline,
} from "./noise-engine";

const MAX_EVENTS = 240;
const STORAGE_KEY = "sonara-log-v2";

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadEvents(): NoiseEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as NoiseEvent[];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return parsed.filter((e) => e.ts >= cutoff);
  } catch {
    return [];
  }
}

function saveEvents(events: NoiseEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
  } catch {
    /* ignore quota */
  }
}

function seedHistory(now = Date.now()): { stations: Station[]; events: NoiseEvent[] } {
  const rand = mulberry32(20260921);
  const stations = STATIONS.map((s) => ({ ...s }));
  const events: NoiseEvent[] = [];

  for (let h = 23; h >= 0; h--) {
    const hourStart = now - h * 60 * 60 * 1000;
    const hour = new Date(hourStart).getHours();
    for (const s of stations) {
      if (s.id === "live") continue;
      const base = hourProfile(s.kind, hour);
      if (rand() > 0.62) {
        const kind = likelyKind(s.kind, base + 12, hour);
        events.push({
          id: uid(),
          stationId: s.id,
          ts: hourStart + Math.floor(rand() * 50 * 60 * 1000),
          spl: Math.round((base + 8 + rand() * 12) * 10) / 10,
          kind: kind === "quiet" ? "traffic" : kind,
          delta: 8 + rand() * 12,
        });
      }
    }
  }

  const recentKinds: EventKind[] = ["engine", "wildlife", "impact", "congestion"];
  recentKinds.forEach((kind, i) => {
    const station = stations[(i * 2) % (stations.length - 1)];
    if (!station || station.id === "live") return;
    events.push({
      id: uid(),
      stationId: station.id,
      ts: now - (4 + i * 7) * 60 * 1000,
      spl: kind === "wildlife" ? 54 : 78 + i,
      kind,
      delta: 11 + i,
    });
  });

  const hour = new Date(now).getHours();
  for (const s of stations) {
    if (s.id === "live") continue;
    s.liveDb = jitter(rand, hourProfile(s.kind, hour), 3);
    s.kindNow = likelyKind(s.kind, s.liveDb, hour);
  }

  events.sort((a, b) => b.ts - a.ts);
  return { stations, events: events.slice(0, 80) };
}

type LiveFrame = {
  spl: number;
  kind: EventKind;
  anomaly: boolean;
  delta: number;
};

type SonaraState = {
  stations: Station[];
  events: NoiseEvent[];
  selectedId: string;
  listening: boolean;
  micError: string | null;
  calibration: number;
  thresholdDb: number;
  hourHeat: Record<string, number[]>;
  hydrated: boolean;
  hydrate: () => void;
  select: (id: string) => void;
  setListening: (on: boolean, error?: string | null) => void;
  setCalibration: (n: number) => void;
  setThreshold: (n: number) => void;
  applyLive: (frame: LiveFrame) => void;
  tick: (now?: number) => void;
  replayDemo: (kind: EventKind) => void;
};

function emptyHeat(): Record<string, number[]> {
  const heat: Record<string, number[]> = {};
  for (const s of STATIONS) {
    heat[s.id] = Array.from({ length: 24 }, (_, hour) => hourProfile(s.kind, hour));
  }
  return heat;
}

export const useSonara = create<SonaraState>((set, get) => ({
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
    const events =
      stored.length >= 8 ? stored : [...seeded.events, ...stored].slice(0, MAX_EVENTS);
    saveEvents(events);
    set({
      stations: seeded.stations,
      events,
      hourHeat: emptyHeat(),
      hydrated: true,
    });
  },

  select: (id) => set({ selectedId: id }),

  setListening: (on, error = null) =>
    set((state) => ({
      listening: on,
      micError: error,
      stations: state.stations.map((s) =>
        s.id === "live" ? { ...s, online: on } : s,
      ),
    })),

  setCalibration: (n) => set({ calibration: n }),
  setThreshold: (n) => set({ thresholdDb: n }),

  applyLive: (frame) => {
    const now = Date.now();
    set((state) => {
      const stations = state.stations.map((s) =>
        s.id === "live"
          ? {
              ...s,
              liveDb: frame.spl,
              kindNow: frame.kind,
              online: true,
              baselineDb: updateBaseline(s.baselineDb, frame.spl, frame.anomaly),
            }
          : s,
      );
      let events = state.events;
      if (frame.anomaly) {
        const last = events.find((e) => e.stationId === "live");
        if (!last || now - last.ts > 4000) {
          events = [
            {
              id: uid(),
              stationId: "live",
              ts: now,
              spl: frame.spl,
              kind: frame.kind,
              delta: frame.delta,
            },
            ...events,
          ].slice(0, MAX_EVENTS);
          saveEvents(events);
        }
      }
      const hour = new Date(now).getHours();
      const hourHeat = { ...state.hourHeat };
      const row = hourHeat.live ? [...hourHeat.live] : Array(24).fill(40);
      row[hour] = frame.spl;
      hourHeat.live = row;
      return { stations, events, hourHeat };
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
        const wander = s.liveDb * 0.82 + (target + (rand() * 4 - 2)) * 0.18;
        const spike = rand() < 0.045 ? target + 10 + rand() * 16 : wander;
        const liveDb = Math.max(22, Math.min(102, spike));
        const fake = {
          rms: intensityFromSpl(liveDb),
          peak: intensityFromSpl(liveDb) * (0.8 + rand() * 0.8),
          zcr:
            s.kind === "wildlife" || s.kind === "park"
              ? 0.18 + rand() * 0.08
              : 0.05 + rand() * 0.06,
          dbfs: liveDb - 94,
          spl: liveDb,
          mean: 0,
        };
        const anomaly = detectAnomaly(fake, s.baselineDb, thresholdDb);
        return {
          ...s,
          liveDb,
          kindNow: anomaly.kind,
          baselineDb: updateBaseline(s.baselineDb, liveDb, anomaly.isAnomaly),
        };
      });

      let events = state.events;
      for (const s of stations) {
        if (s.id === "live") continue;
        const prev = state.stations.find((p) => p.id === s.id);
        const jumped = prev && s.liveDb - prev.liveDb > thresholdDb * 0.7;
        const over = s.liveDb - s.baselineDb >= thresholdDb;
        if (jumped && over && rand() < 0.55) {
          events = [
            {
              id: uid(),
              stationId: s.id,
              ts: now,
              spl: Math.round(s.liveDb * 10) / 10,
              kind: s.kindNow === "quiet" ? "traffic" : s.kindNow,
              delta: s.liveDb - s.baselineDb,
            },
            ...events,
          ].slice(0, MAX_EVENTS);
        }
      }
      if (events !== state.events) saveEvents(events);

      const hourHeat = { ...state.hourHeat };
      for (const s of stations) {
        const row = hourHeat[s.id] ? [...hourHeat[s.id]] : Array(24).fill(s.baselineDb);
        row[hour] = Math.round(s.liveDb);
        hourHeat[s.id] = row;
      }

      return { stations, events, hourHeat };
    });
  },

  replayDemo: (kind) => {
    const now = Date.now();
    const selected = get().selectedId === "live" ? "intersection" : get().selectedId;
    const spl =
      kind === "wildlife" ? 54 : kind === "impact" ? 86 : kind === "engine" ? 82 : 76;
    set((state) => {
      const events = [
        {
          id: uid(),
          stationId: selected,
          ts: now,
          spl,
          kind,
          delta: 14,
        },
        ...state.events,
      ].slice(0, MAX_EVENTS);
      saveEvents(events);
      const stations = state.stations.map((s) =>
        s.id === selected ? { ...s, liveDb: spl, kindNow: kind } : s,
      );
      return { events, stations, selectedId: selected };
    });
  },
}));

export { BOARD_LABEL };
