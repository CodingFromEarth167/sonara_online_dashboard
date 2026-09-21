/**
 * Sonara noise engine (JavaScript)
 *
 * Same math the MagicBit / ESP32 firmware runs:
 *   1. Take a short window of microphone samples
 *   2. Strip DC bias (MAX4466 rests at VCC/2)
 *   3. Measure RMS energy + peak + zero-crossing rate
 *   4. Convert to an estimated sound-pressure level (dB)
 *   5. Compare against a slow baseline — a sudden jump is an anomaly
 */

export type EventKind =
  | "quiet"
  | "traffic"
  | "congestion"
  | "engine"
  | "wildlife"
  | "impact";

export type Analysis = {
  rms: number;
  peak: number;
  zcr: number;
  dbfs: number;
  spl: number;
  mean: number;
};

export type Anomaly = {
  isAnomaly: boolean;
  delta: number;
  kind: EventKind;
  baseline: number;
};

export type EngineConfig = {
  calibration: number;
  thresholdDb: number;
  baselineAlpha: number;
};

export const DEFAULT_ENGINE: EngineConfig = {
  calibration: 94,
  thresholdDb: 12,
  baselineAlpha: 0.04,
};

export function analyzeSamples(
  samples: ArrayLike<number>,
  calibration = DEFAULT_ENGINE.calibration,
): Analysis {
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
    if ((prev >= 0 && d < 0) || (prev < 0 && d >= 0)) crossings += 1;
    prev = d;
  }

  const rms = Math.sqrt(ac / n);
  const zcr = crossings / n;
  const dbfs = rms > 1e-8 ? 20 * Math.log10(rms) : -90;
  const spl = clamp(dbfs + calibration, 18, 120);

  return { rms, peak, zcr, dbfs, mean, spl };
}

export function classifyEvent(
  analysis: Analysis,
  baseline: number,
  isAnomaly: boolean,
): EventKind {
  if (!isAnomaly) {
    if (analysis.spl < 48) return "quiet";
    if (analysis.spl < 62) return "traffic";
    return "congestion";
  }

  const peakRatio = analysis.rms > 1e-6 ? analysis.peak / analysis.rms : 0;
  if (peakRatio > 2.6 && analysis.zcr > 0.12) return "impact";
  if (analysis.zcr > 0.16 && analysis.spl < baseline + 22) return "wildlife";
  if (analysis.zcr < 0.09) return "engine";
  if (analysis.spl >= 72) return "congestion";
  return "traffic";
}

export function detectAnomaly(
  analysis: Analysis,
  baseline: number,
  thresholdDb: number,
): Anomaly {
  const delta = analysis.spl - baseline;
  const isAnomaly = delta >= thresholdDb;
  return {
    isAnomaly,
    delta,
    baseline,
    kind: classifyEvent(analysis, baseline, isAnomaly),
  };
}

export function updateBaseline(
  baseline: number,
  spl: number,
  isAnomaly: boolean,
  alpha = DEFAULT_ENGINE.baselineAlpha,
): number {
  if (isAnomaly) return baseline;
  return baseline * (1 - alpha) + spl * alpha;
}

export function intensityFromSpl(spl: number, floor = 32, ceil = 92): number {
  return clamp((spl - floor) / (ceil - floor), 0, 1);
}

export function formatDb(spl: number): string {
  return `${Math.round(spl)} dB`;
}

export const KIND_LABEL: Record<EventKind, string> = {
  quiet: "Ambient",
  traffic: "Traffic",
  congestion: "Congestion",
  engine: "Engine roar",
  wildlife: "Wildlife",
  impact: "Sharp burst",
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
