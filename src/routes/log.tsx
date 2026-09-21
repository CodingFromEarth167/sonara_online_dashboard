import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { KIND_LABEL, type EventKind } from "@/lib/noise-engine";
import { STATIONS } from "@/lib/stations";
import { useSonara } from "@/lib/store";

export const Route = createFileRoute("/log")({ component: LogPage });

function variant(kind: EventKind) {
  if (kind === "wildlife" || kind === "quiet") return "quiet" as const;
  if (kind === "engine" || kind === "impact" || kind === "congestion") return "heat" as const;
  return "muted" as const;
}

function LogPage() {
  const events = useSonara((s) => s.events);
  const select = useSonara((s) => s.select);
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Event log</p>
        <h1 className="mt-1 font-display text-3xl font-medium">Last 24 hours</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Every flagged spike is stored on this device. Open a row to jump back to its node on
          the field map.
        </p>

        <div className="mt-6 overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]">
          {events.length === 0 ? (
            <p className="p-6 text-sm text-muted">No events recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Node</th>
                    <th className="px-4 py-3 font-medium">Kind</th>
                    <th className="px-4 py-3 font-medium">Level</th>
                    <th className="px-4 py-3 font-medium">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => {
                    const station = STATIONS.find((s) => s.id === e.stationId);
                    return (
                      <tr key={e.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 tabular-nums text-muted">
                          {format(e.ts, "HH:mm:ss")}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            className="text-left text-fg hover:underline"
                            onClick={() => {
                              select(e.stationId);
                              void navigate({ to: "/" });
                            }}
                          >
                            {station?.name ?? e.stationId}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={variant(e.kind)}>{KIND_LABEL[e.kind]}</Badge>
                        </td>
                        <td className="px-4 py-3 tabular-nums">{e.spl.toFixed(1)} dB</td>
                        <td className="px-4 py-3 tabular-nums text-muted">
                          +{e.delta.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
