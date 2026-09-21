import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SONARA_INO, SONARA_JS } from "@/lib/firmware";

export const Route = createFileRoute("/lab")({ component: LabPage });

function HtmlSource() {
  const [code, setCode] = useState("Loading sonara.html…");
  useEffect(() => {
    void fetch("/firmware/sonara.html")
      .then((r) => r.text())
      .then(setCode)
      .catch(() => setCode("Could not load sonara.html"));
  }, []);
  return <CodeBlock filename="sonara.html" code={code} />;
}

function LabPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Lab</p>
        <h1 className="mt-1 font-display text-3xl font-medium">JavaScript listener</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          The heatmap runs this JavaScript engine. Use the same math on a MAX4466 microphone
          wired to an ESP32, MagicBit, MagicBit Tiny, or MagicBit Extension.
        </p>

        <Tabs defaultValue="html" className="mt-6">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
            <TabsTrigger value="wiring">Wiring</TabsTrigger>
            <TabsTrigger value="boards">Boards</TabsTrigger>
            <TabsTrigger value="arduino">Arduino</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="space-y-4">
            <p className="text-sm text-muted">
              One file. Save it, open it in a browser. It includes the heatmap, live microphone
              listener, anomaly log, and the same detection math as the MagicBit sketch.
            </p>
            <p className="text-sm">
              <a
                href="/firmware/sonara.html"
                download="sonara.html"
                className="text-fg underline decoration-border underline-offset-4"
              >
                Download sonara.html
              </a>
            </p>
            <HtmlSource />
          </TabsContent>

          <TabsContent value="js" className="space-y-4">
            <ol className="space-y-3 text-sm text-muted">
              <li>
                <span className="text-fg">1. Sample a 50 ms window</span> from the mic (Web Audio
                here, analogRead on the board).
              </li>
              <li>
                <span className="text-fg">2. Remove DC bias</span> — MAX4466 rests at VCC/2, so we
                subtract the mean before measuring energy.
              </li>
              <li>
                <span className="text-fg">3. RMS, peak, zero-crossings</span> become an estimated
                SPL in dB.
              </li>
              <li>
                <span className="text-fg">4. Compare to a slow baseline.</span> A jump of +12 dB
                is an anomaly: engine, congestion, wildlife, or a sharp burst.
              </li>
            </ol>
            <p className="text-sm">
              <a
                href="/firmware/sonara.js"
                download
                className="text-fg underline decoration-border underline-offset-4"
              >
                Download sonara.js
              </a>
            </p>
            <CodeBlock filename="sonara.js" code={SONARA_JS} />
          </TabsContent>

          <TabsContent value="wiring">
            <div className="overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">MAX4466</th>
                    <th className="px-4 py-3 font-medium">ESP32 / MagicBit</th>
                    <th className="px-4 py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">VCC</td>
                    <td className="px-4 py-3">3.3V</td>
                    <td className="px-4 py-3 text-muted">Never 5V — ADC max is 3.3V</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">GND</td>
                    <td className="px-4 py-3">GND</td>
                    <td className="px-4 py-3 text-muted">Common ground</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">OUT</td>
                    <td className="px-4 py-3">GPIO 32</td>
                    <td className="px-4 py-3 text-muted">ADC1_CH4, free on all four boards</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted">
              Plug the ESP32 and sensor into a breadboard with male-to-female jumpers. Upload over
              USB, then run from a power bank for a field video. On MagicBit, GPIO 36 is the LDR
              and GPIO 39 is the potentiometer — leave those alone and use 32 for the mic.
            </p>
          </TabsContent>

          <TabsContent value="boards" className="space-y-4 text-sm text-muted">
            <div className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
              <h2 className="font-display text-xl text-fg">Arduino IDE plugin</h2>
              <p className="mt-2">Preferences → Additional Board Manager URLs, paste:</p>
              <p className="mt-2 break-all font-mono text-xs text-fg">
                https://github.com/magicbitlk/arduino-esp32/releases/download/Magicbit/package_magicbit_index.json
              </p>
              <p className="mt-3">
                Boards Manager → install Magicbit. Then Tools → Board → MagicBit, MagicBit Tiny,
                or MagicBit Extension. For a generic NodeMCU ESP32, use the Espressif ESP32
                package and pick ESP32 Dev Module.
              </p>
            </div>
            <ul className="space-y-2">
              <li>
                <span className="text-fg">MagicBit</span> — OLED, LEDs on 16/18, buzzer on 25.
                Sketch blinks green while quiet and yellow on an anomaly.
              </li>
              <li>
                <span className="text-fg">MagicBit Tiny</span> — same mic pin (GPIO 32), onboard
                LED as status.
              </li>
              <li>
                <span className="text-fg">MagicBit Extension</span> — analog header still GPIO
                32 for the MAX4466.
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="arduino" className="space-y-4">
            <p className="text-sm text-muted">
              Optional C++ firmware if you flash from Arduino IDE. Change SONARA_BOARD at the
              top, then set Wi-Fi. The dashboard you are using now is already driven by the
              JavaScript engine.
            </p>
            <p className="text-sm">
              <a
                href="/firmware/sonara.ino"
                download
                className="text-fg underline decoration-border underline-offset-4"
              >
                Download sonara.ino
              </a>
            </p>
            <CodeBlock filename="sonara.ino" code={SONARA_INO} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
