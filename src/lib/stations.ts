import type { EventKind } from "./noise-engine";

export type StationKind =
  | "school"
  | "park"
  | "intersection"
  | "wildlife"
  | "library"
  | "transit"
  | "live";

export type BoardId = "esp32" | "magicbit" | "magicbit-tiny" | "magicbit-ext";

export type Station = {
  id: string;
  name: string;
  place: string;
  kind: StationKind;
  board: BoardId;
  x: number;
  y: number;
  baselineDb: number;
  liveDb: number;
  kindNow: EventKind;
  online: boolean;
};

export type NoiseEvent = {
  id: string;
  stationId: string;
  ts: number;
  spl: number;
  kind: EventKind;
  delta: number;
};

export const BOARD_LABEL: Record<BoardId, string> = {
  esp32: "ESP32 DevKit",
  magicbit: "MagicBit",
  "magicbit-tiny": "MagicBit Tiny",
  "magicbit-ext": "MagicBit Extension",
};

export const STATIONS: Station[] = [
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
    online: true,
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
    online: true,
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
    online: true,
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
    online: true,
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
    online: true,
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
    online: true,
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
    online: false,
  },
];

export function hourProfile(kind: StationKind, hour: number): number {
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
    case "live":
      return 40;
  }
}

export function likelyKind(kind: StationKind, spl: number, hour: number): EventKind {
  if (spl < 48) return "quiet";
  if (kind === "wildlife" || kind === "park") {
    if (hour >= 18 || hour <= 6) return "wildlife";
    return spl > 55 ? "wildlife" : "quiet";
  }
  if (kind === "intersection" || kind === "transit") {
    return spl >= 74 ? "congestion" : spl >= 70 ? "engine" : "traffic";
  }
  if (kind === "school") return spl >= 70 ? "impact" : "traffic";
  return "traffic";
}
