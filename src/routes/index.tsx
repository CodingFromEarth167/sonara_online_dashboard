import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EventFeed } from "@/components/event-feed";
import { HourStrip } from "@/components/hour-strip";
import { NodePanel } from "@/components/node-panel";
import { NoiseMap } from "@/components/noise-map";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSonara } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Field });

function Field() {
  const stations = useSonara((s) => s.stations);
  const events = useSonara((s) => s.events);
  const selectedId = useSonara((s) => s.selectedId);
  const select = useSonara((s) => s.select);
  const hourHeat = useSonara((s) => s.hourHeat);
  const calibration = useSonara((s) => s.calibration);
  const thresholdDb = useSonara((s) => s.thresholdDb);
  const setCalibration = useSonara((s) => s.setCalibration);
  const setThreshold = useSonara((s) => s.setThreshold);
  const replayDemo = useSonara((s) => s.replayDemo);
  const listening = useSonara((s) => s.listening);
  const micError = useSonara((s) => s.micError);

  const selected = stations.find((s) => s.id === selectedId) ?? stations[0];
  const heat = hourHeat[selected.id] ?? Array(24).fill(selected.baselineDb);

  return (
    <AppShell>
      <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-6">
        <section className="flex min-w-0 flex-col gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-muted uppercase">24-hour noise heatmap</p>
            <h1 className="mt-1 font-display text-3xl font-medium sm:text-4xl">
              Listen to the neighborhood
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Six field nodes plus this browser sample ambient sound. Spikes — engine roar,
              congestion, wildlife calls — are flagged as anomalies and painted on the map.
            </p>
          </div>
          <NoiseMap stations={stations} selectedId={selectedId} onSelect={select} />
          <div className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
            <HourStrip values={heat} label={selected.name} />
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <NodePanel station={selected} />

          <div className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Detector</p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="flex justify-between text-xs text-muted">
                  Calibration
                  <span className="tabular-nums text-fg">{calibration} dB</span>
                </span>
                <Slider
                  className="mt-3"
                  min={70}
                  max={110}
                  step={1}
                  value={[calibration]}
                  onValueChange={(v) => setCalibration(v[0] ?? 94)}
                />
              </label>
              <label className="block">
                <span className="flex justify-between text-xs text-muted">
                  Anomaly threshold
                  <span className="tabular-nums text-fg">+{thresholdDb} dB</span>
                </span>
                <Slider
                  className="mt-3"
                  min={6}
                  max={24}
                  step={1}
                  value={[thresholdDb]}
                  onValueChange={(v) => setThreshold(v[0] ?? 12)}
                />
              </label>
              {listening ? (
                <p className="text-xs text-quiet">Live microphone is the “This device” node.</p>
              ) : null}
              {micError ? <p className="text-xs text-heat">{micError}</p> : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => replayDemo("engine")}>
                Replay roar
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => replayDemo("wildlife")}>
                Replay wildlife
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => replayDemo("impact")}>
                Replay burst
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Anomaly log</p>
            <EventFeed events={events.slice(0, 18)} onSelect={select} />
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
