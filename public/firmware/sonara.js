/**
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
  calibration: 94,
  thresholdDb: 12,
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
  const mean = sum / n;

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
  if (peakRatio > 2.6 && analysis.zcr > 0.12) return "impact";
  if (analysis.zcr > 0.16 && analysis.spl < baseline + 22) return "wildlife";
  if (analysis.zcr < 0.09) return "engine";
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
