/*
 * Sonara — Acoustic Wildlife & Urban Noise Heatmapper
 * Arduino IDE sketch for:
 *   ESP32 DevKit / NodeMCU-32S
 *   MagicBit
 *   MagicBit Tiny
 *   MagicBit Extension
 *
 * MagicBit plugin
 *   File → Preferences → Additional Board Manager URLs:
 *   https://github.com/magicbitlk/arduino-esp32/releases/download/Magicbit/package_magicbit_index.json
 *   Tools → Board → Boards Manager → install "Magicbit"
 *   Tools → Board → MagicBit  (or MagicBit Tiny / MagicBit Extension)
 *
 * Wiring  Analog Sound Sensor (MAX4466)
 *   VCC → 3.3V     (never 5V on ESP32)
 *   GND → GND
 *   OUT → GPIO 32  (ADC1_CH4 — free analog on all listed boards)
 *
 * Optional: KY-037 digital pin can go to GPIO 27 as a loudness gate.
 * Breadboard + jumper wires. Power via USB or a phone power bank.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <math.h>

#define BOARD_MAGICBIT        1
#define BOARD_MAGICBIT_TINY   2
#define BOARD_MAGICBIT_EXT    3
#define BOARD_ESP32_DEVKIT    4

#ifndef SONARA_BOARD
#define SONARA_BOARD BOARD_MAGICBIT
#endif

#if SONARA_BOARD == BOARD_MAGICBIT
  const int MIC_PIN = 32;
  const int LED_OK = 16;
  const int LED_ALERT = 18;
  const char* BOARD_NAME = "magicbit";
#elif SONARA_BOARD == BOARD_MAGICBIT_TINY
  const int MIC_PIN = 32;
  const int LED_OK = 2;
  const int LED_ALERT = 2;
  const char* BOARD_NAME = "magicbit-tiny";
#elif SONARA_BOARD == BOARD_MAGICBIT_EXT
  const int MIC_PIN = 32;
  const int LED_OK = 16;
  const int LED_ALERT = 18;
  const char* BOARD_NAME = "magicbit-ext";
#else
  const int MIC_PIN = 32;
  const int LED_OK = 2;
  const int LED_ALERT = 2;
  const char* BOARD_NAME = "esp32";
#endif

const char* WIFI_SSID = "YOUR_WIFI";
const char* WIFI_PASS = "YOUR_PASSWORD";
const char* DASHBOARD_URL = "https://YOUR-APP/api/ingest";
const char* DEVICE_ID = "sonara-01";

const int SAMPLE_WINDOW_MS = 50;
const float CALIBRATION = 94.0;
const float THRESHOLD_DB = 12.0;
const float BASELINE_ALPHA = 0.04;
const unsigned long POST_EVERY_MS = 4000;
const unsigned long ALERT_COOLDOWN_MS = 6000;

float baselineSpl = 40.0;
unsigned long lastPost = 0;
unsigned long lastAlert = 0;

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(250);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_OK, OUTPUT);
  pinMode(LED_ALERT, OUTPUT);
  analogReadResolution(12);
  analogSetPinAttenuation(MIC_PIN, ADC_11db);
  connectWifi();
  Serial.println("Sonara listener ready");
}

void loop() {
  unsigned long t0 = millis();
  uint32_t n = 0;
  uint64_t sum = 0;
  uint64_t sumSq = 0;
  int peak = 0;
  int prev = analogRead(MIC_PIN);
  uint32_t crossings = 0;

  while (millis() - t0 < SAMPLE_WINDOW_MS) {
    int v = analogRead(MIC_PIN);
    sum += v;
    sumSq += (uint64_t)v * v;
    int mag = abs(v - 2048);
    if (mag > peak) peak = mag;
    if ((prev >= 2048 && v < 2048) || (prev < 2048 && v >= 2048)) crossings++;
    prev = v;
    n++;
  }

  if (n == 0) return;
  float mean = (float)sum / n;
  float var = (float)sumSq / n - mean * mean;
  if (var < 0) var = 0;
  float rms = sqrt(var);
  float dbfs = 20.0 * log10(max(rms, 1.0f) / 2048.0f);
  float spl = constrain(dbfs + CALIBRATION, 18.0, 120.0);
  float zcr = (float)crossings / n;
  float delta = spl - baselineSpl;
  bool anomaly = delta >= THRESHOLD_DB;

  if (!anomaly) {
    baselineSpl = baselineSpl * (1.0 - BASELINE_ALPHA) + spl * BASELINE_ALPHA;
  }

  const char* kind = "traffic";
  if (!anomaly && spl < 48) kind = "quiet";
  else if (anomaly && zcr > 0.16) kind = "wildlife";
  else if (anomaly && zcr < 0.09) kind = "engine";
  else if (anomaly && peak > rms * 2.6) kind = "impact";
  else if (spl >= 72) kind = "congestion";

  digitalWrite(LED_OK, anomaly ? LOW : HIGH);
  digitalWrite(LED_ALERT, anomaly ? HIGH : LOW);

  Serial.printf(
    "spl=%.1f dB  baseline=%.1f  zcr=%.3f  %s  %s\n",
    spl, baselineSpl, zcr, kind, anomaly ? "ANOMALY" : "ok"
  );

  unsigned long now = millis();
  bool due = (now - lastPost) > POST_EVERY_MS;
  bool alert = anomaly && (now - lastAlert) > ALERT_COOLDOWN_MS;
  if ((due || alert) && WiFi.status() == WL_CONNECTED && strlen(DASHBOARD_URL) > 8) {
    HTTPClient http;
    http.begin(DASHBOARD_URL);
    http.addHeader("Content-Type", "application/json");
    String body = "{";
    body += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
    body += "\"board\":\"" + String(BOARD_NAME) + "\",";
    body += "\"ts\":" + String((unsigned long) millis()) + ",";
    body += "\"rms\":" + String(rms, 2) + ",";
    body += "\"peak\":" + String(peak) + ",";
    body += "\"spl\":" + String(spl, 1) + ",";
    body += "\"zcr\":" + String(zcr, 3) + ",";
    body += "\"anomaly\":" + String(anomaly ? "true" : "false") + ",";
    body += "\"kind\":\"" + String(kind) + "\"";
    body += "}";
    http.POST(body);
    http.end();
    lastPost = now;
    if (alert) lastAlert = now;
  }

  delay(20);
}
