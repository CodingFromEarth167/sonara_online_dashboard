import { formatDistanceToNow } from "date-fns";
import { KIND_LABEL, type EventKind } from "@/lib/noise-engine";
import { STATIONS, type NoiseEvent } from "@/lib/stations";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

function kindVariant(kind: EventKind): "heat" | "quiet" | "muted" {
  if (kind === "quiet") return "quiet";
  if (kind === "wildlife") return "quiet";
  if (kind === "engine" || kind === "impact" || kind === "congestion") return "heat";
  return "muted";
}

export function EventFeed({
  events,
  onSelect,
}: {
  events: NoiseEvent[];
  onSelect: (stationId: string) => void;
}) {
  if (events.length === 0) {
    return (
      <p className="px-1 py-8 text-sm text-muted">
        No anomaly events yet. Turn on Listen, or wait for a field spike.
      </p>
    );
  }

  return (
    <ScrollArea className="h-[min(52vh,28rem)]">
      <ul className="flex flex-col">
        {events.map((e) => {
          const station = STATIONS.find((s) => s.id === e.stationId);
          return (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onSelect(e.stationId)}
                className="flex w-full items-start justify-between gap-3 rounded-sm px-1 py-3 text-left transition-colors duration-[var(--motion-quick)] hover:bg-surface-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{station?.name ?? e.stationId}</p>
                  <p className="text-xs text-muted">
                    {formatDistanceToNow(e.ts, { addSuffix: true })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm tabular-nums">{Math.round(e.spl)} dB</span>
                  <Badge variant={kindVariant(e.kind)}>{KIND_LABEL[e.kind]}</Badge>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
