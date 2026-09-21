import { useEffect, useRef } from "react";
import {
  analyzeSamples,
  detectAnomaly,
  updateBaseline,
} from "@/lib/noise-engine";
import { useSonara } from "@/lib/store";

export function useLiveMic() {
  const listening = useSonara((s) => s.listening);
  const calibration = useSonara((s) => s.calibration);
  const thresholdDb = useSonara((s) => s.thresholdDb);
  const applyLive = useSonara((s) => s.applyLive);
  const setListening = useSonara((s) => s.setListening);
  const ctxRef = useRef<AudioContext | null>(null);
  const baselineRef = useRef(42);

  useEffect(() => {
    if (!listening) {
      void ctxRef.current?.close();
      ctxRef.current = null;
      return;
    }

    let raf = 0;
    let stopped = false;
    const buffer = new Float32Array(2048);

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
          video: false,
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
          baselineRef.current = updateBaseline(
            baselineRef.current,
            analysis.spl,
            anomaly.isAnomaly,
          );
          applyLive({
            spl: analysis.spl,
            kind: anomaly.kind,
            anomaly: anomaly.isAnomaly,
            delta: anomaly.delta,
          });
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        setListening(false, "Microphone permission was blocked.");
      }
    }

    void start();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, [listening, calibration, thresholdDb, applyLive, setListening]);
}
