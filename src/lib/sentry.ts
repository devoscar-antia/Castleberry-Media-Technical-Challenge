import * as Sentry from "@sentry/react";
import { APP_VERSION } from "@/config/version";

const DSN = "https://2a5880f756af244f7c4e127ee7437a69@o4511350257352704.ingest.us.sentry.io/4511350285271040";

export function initSentry() {
  if (typeof window === "undefined") return;

  Sentry.init({
    dsn: DSN,
    release: `kol-platform@${APP_VERSION}`,
    environment: import.meta.env.DEV ? "development" : "production",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    // Don't spam Sentry with dev noise
    enabled: !import.meta.env.DEV,
  });
}

export function setSentryUser(user: { id: string; email?: string | null } | null) {
  if (!user) {
    Sentry.setUser(null);
    return;
  }
  Sentry.setUser({ id: user.id, email: user.email ?? undefined });
}

export { Sentry };
