import React from "react";
import { Activity, Mic, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { MicDiagnostics, CallPhase } from "@/hooks/useVoiceCall";
import { Capacitor } from "@capacitor/core";

interface Props {
  diag: MicDiagnostics;
  phase: CallPhase;
}

const formatPermission = (perm: MicDiagnostics["permission"]) => {
  switch (perm) {
    case "granted":
      return { label: "Granted", tone: "success" as const };
    case "denied":
      return { label: "Denied", tone: "error" as const };
    case "prompt":
      return { label: "Awaiting prompt", tone: "warn" as const };
    default:
      return { label: "Unknown", tone: "muted" as const };
  }
};

const formatSource = (source: MicDiagnostics["source"]) => {
  switch (source) {
    case "native-ios":
      return "Native iOS (AVAudioEngine)";
    case "web-audio":
      return "WKWebView / Web Audio";
    default:
      return "Not started";
  }
};

const toneClasses: Record<"success" | "error" | "warn" | "muted", string> = {
  success: "text-emerald-500",
  error: "text-destructive",
  warn: "text-amber-500",
  muted: "text-muted-foreground",
};

const MicDiagnosticsPanel: React.FC<Props> = ({ diag, phase }) => {
  const platform = Capacitor.getPlatform();
  const isNative = Capacitor.isNativePlatform();
  const perm = formatPermission(diag.permission);

  // Peak meter (0..1) — use 20*log10 mapping to feel responsive
  const peakPct = Math.min(100, Math.max(0, Math.round(diag.peak * 100)));
  const isLive = phase === "live" || phase === "session_ready";
  const silent = isLive && diag.chunksPerInterval > 0 && diag.peak < 0.001;
  const noChunks = isLive && diag.chunksPerInterval === 0;

  const statusIcon = noChunks || silent ? (
    <AlertTriangle className="w-4 h-4 text-amber-500" />
  ) : isLive ? (
    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
  ) : (
    <Activity className="w-4 h-4 text-muted-foreground" />
  );

  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 p-3 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Mic className="w-4 h-4" />
          Microphone diagnostics
        </div>
        <div className="flex items-center gap-1.5">{statusIcon}<span className="text-muted-foreground">{phase}</span></div>
      </div>

      {/* Peak meter */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Input level</span>
          <span className="font-mono">{diag.peak.toFixed(4)}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-all duration-150 ${
              silent || noChunks ? "bg-destructive" : "bg-primary"
            }`}
            style={{ width: `${peakPct}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div className="text-muted-foreground">Platform</div>
        <div className="text-right font-mono text-foreground">
          {platform}
          {isNative ? " (native)" : " (web)"}
        </div>

        <div className="text-muted-foreground">Capture path</div>
        <div className="text-right text-foreground">{formatSource(diag.source)}</div>

        <div className="text-muted-foreground">Permission</div>
        <div className={`text-right font-medium ${toneClasses[perm.tone]}`}>{perm.label}</div>

        <div className="text-muted-foreground">Sample rate</div>
        <div className="text-right font-mono text-foreground">
          {diag.sampleRate ? `${diag.sampleRate} Hz` : "—"}
        </div>

        <div className="text-muted-foreground">Chunks (last 2s)</div>
        <div className="text-right font-mono text-foreground">{diag.chunksPerInterval}</div>

        <div className="text-muted-foreground">Total chunks</div>
        <div className="text-right font-mono text-foreground">{diag.totalChunks}</div>

        <div className="text-muted-foreground">Track</div>
        <div className="text-right text-foreground truncate" title={diag.trackLabel ?? ""}>
          {diag.trackLabel || "—"}
          {diag.trackMuted === true && <span className="text-destructive"> (muted)</span>}
        </div>
      </div>

      {(silent || noChunks) && isLive && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-amber-600 dark:text-amber-400">
          {noChunks
            ? "No audio chunks received — the OS is not delivering microphone data to the app."
            : "Audio chunks received but level is silent — the mic may be muted, blocked, or capturing the wrong device."}
        </div>
      )}

      {diag.lastError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-destructive">
          {diag.lastError}
        </div>
      )}
    </div>
  );
};

export default MicDiagnosticsPanel;
