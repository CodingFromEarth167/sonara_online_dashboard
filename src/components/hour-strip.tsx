import { intensityFromSpl } from "@/lib/noise-engine";
import { cn } from "@/lib/utils";

export function HourStrip({
  values,
  label,
}: {
  values: number[];
  label: string;
}) {
  const hour = new Date().getHours();
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-xs tracking-[0.16em] text-muted uppercase">{label}</p>
        <p className="text-xs text-muted">24 hours</p>
      </div>
      <div className="grid grid-cols-24 gap-px">
        {values.map((spl, i) => {
          const t = intensityFromSpl(spl);
          return (
            <div
              key={i}
              title={`${i}:00 · ${Math.round(spl)} dB`}
              className={cn(
                "h-10 rounded-xs",
                i === hour ? "ring-1 ring-accent" : "",
              )}
              style={{
                backgroundColor: `color-mix(in oklab, var(--color-heat) ${Math.round(t * 88)}%, var(--color-quiet))`,
                opacity: 0.35 + t * 0.65,
              }}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] tracking-wide text-subtle uppercase">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
      </div>
    </div>
  );
}
