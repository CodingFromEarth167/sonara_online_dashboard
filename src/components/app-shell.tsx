import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, AudioLines, Code2, Radio } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useLiveMic } from "@/hooks/use-live-mic";
import { useSonara } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";

const NAV = [
  { to: "/", label: "Field", icon: Radio },
  { to: "/log", label: "Log", icon: Activity },
  { to: "/lab", label: "Lab", icon: Code2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrate = useSonara((s) => s.hydrate);
  const tick = useSonara((s) => s.tick);
  const listening = useSonara((s) => s.listening);
  const setListening = useSonara((s) => s.setListening);
  const events = useSonara((s) => s.events);
  const stations = useSonara((s) => s.stations);

  useLiveMic();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const id = window.setInterval(() => tick(), 1100);
    return () => window.clearInterval(id);
  }, [tick]);

  const online = stations.filter((s) => s.online).length;
  const anomalies = events.filter((e) => Date.now() - e.ts < 60 * 60 * 1000).length;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-baseline gap-2 no-underline">
            <span className="font-display text-2xl font-medium tracking-tight text-fg">Sonara</span>
            <span className="hidden text-xs tracking-[0.18em] text-muted uppercase sm:inline">
              Acoustic field
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:hidden">
            <span className="text-xs text-muted tabular-nums">{online} live</span>
          </div>
        </div>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-sm px-3 text-sm no-underline transition-colors duration-[var(--motion-quick)]",
                  active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 text-xs text-muted sm:flex">
            <span className="tabular-nums">{online} nodes</span>
            <span className="tabular-nums">{anomalies} alerts / hr</span>
          </div>
          <label className="flex h-11 items-center gap-2 rounded-sm px-1">
            <AudioLines className="size-4 text-muted" />
            <span className="text-sm">Listen</span>
            <Switch
              checked={listening}
              onCheckedChange={(on) => setListening(on)}
              aria-label="Use this device as a live microphone node"
            />
          </label>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}

