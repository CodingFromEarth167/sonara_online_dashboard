import { intensityFromSpl, KIND_LABEL } from "@/lib/noise-engine";
import { BOARD_LABEL, type Station } from "@/lib/stations";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function NoiseMap({
  stations,
  selectedId,
  onSelect,
}: {
  stations: Station[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]">
      <img
        src="/city-basemap.jpg"
        alt="Aerial dusk view of the mapped neighborhood"
        className="aspect-video w-full object-cover"
        crossOrigin="anonymous"
      />
      {stations.map((s) => {
        const t = intensityFromSpl(s.liveDb);
        const size = 16 + t * 22;
        return (
          <div
            key={`${s.id}-heat`}
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${size}%`,
              aspectRatio: "1",
              opacity: 0.28 + t * 0.55,
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-heat) 75%, transparent) 0%, color-mix(in oklab, var(--color-quiet) 45%, transparent) 46%, transparent 72%)",
            }}
          />
        );
      })}
      {stations.map((s) => {
        const hot = s.liveDb - s.baselineDb >= 10;
        const selected = s.id === selectedId;
        return (
          <Tooltip key={s.id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                className={cn(
                  "absolute z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
                  selected ? "z-20" : "",
                )}
                aria-label={`${s.name}, ${Math.round(s.liveDb)} decibels`}
              >
                {hot ? (
                  <span className="sonara-pulse absolute size-10 rounded-full bg-heat/30" />
                ) : null}
                <span
                  className={cn(
                    "relative block size-3 rounded-full",
                    hot ? "bg-heat" : "bg-quiet",
                    selected ? "size-3.5 ring-2 ring-accent ring-offset-2 ring-offset-bg" : "",
                    !s.online ? "bg-muted" : "",
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-0.5">
                <p className="font-medium">{s.name}</p>
                <p className="text-muted">
                  {Math.round(s.liveDb)} dB · {KIND_LABEL[s.kindNow]}
                </p>
                <p className="text-muted">{BOARD_LABEL[s.board]}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
