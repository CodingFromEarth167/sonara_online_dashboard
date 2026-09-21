import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function CodeBlock({
  code,
  filename,
}: {
  code: string;
  filename: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface-2 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <p className="truncate font-mono text-xs text-muted">{filename}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void copy()}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="max-h-[32rem] overflow-auto p-4 text-xs leading-relaxed text-fg">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
