import { KIND_LABEL } from "@/lib/noise-engine";
import { BOARD_LABEL, type Station } from "@/lib/stations";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export function NodePanel({ station }: { station: Station }) {
  const hot = station.liveDb - station.baselineDb >= 10;
  return (
    <div className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs tracking-[0.16em] text-muted uppercase">Selected node</p>
      <h2 className="mt-2 font-display text-2xl font-medium">{station.name}</h2>
      <p className="mt-1 text-sm text-muted">{station.place}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-5xl leading-none font-medium tabular-nums">
            {Math.round(station.liveDb)}
          </p>
          <p className="mt-1 text-xs tracking-wide text-muted uppercase">dB SPL</p>
        </div>
        <Badge variant={hot ? "heat" : "quiet"}>{KIND_LABEL[station.kindNow]}</Badge>
      </div>
      <Separator className="my-4" />
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Baseline</dt>
          <dd className="tabular-nums">{Math.round(station.baselineDb)} dB</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Board</dt>
          <dd>{BOARD_LABEL[station.board]}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Link</dt>
          <dd>{station.online ? "Online" : "Standby"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Mic pin</dt>
          <dd className="tabular-nums">GPIO 32</dd>
        </div>
      </dl>
    </div>
  );
}
