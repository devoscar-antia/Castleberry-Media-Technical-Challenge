import type { CapacitorConfig } from "@capacitor/cli";

// Read variant from environment: "testflight" for old private app, default is "ses" (new public app)
const variant = process.env.APP_VARIANT || "ses";

const config: CapacitorConfig = {
  appId:
    variant === "testflight"
      ? "com.newbrain.kol.ios"   // OLD app (private TestFlight)
      : "com.newbrain.kol.ses",  // NEW app (public for SES - Unlisted) — DEFAULT
  appName: "KOL",
  webDir: "dist",
  plugins: {
    LocalNotifications: {
      iconColor: "#0A66C2",
      smallIcon: "ic_stat_content_quill",
      sound: "default",
      // iOS 14+: use "banner" + "list" instead of deprecated "alert"
      presentationOptions: ["badge", "sound", "banner", "list"],
      categories: [
        {
          identifier: "REMINDER",
          actions: [
            {
              identifier: "OPEN_APP",
              title: "Open App",
              options: ["foreground"],
            },
          ],
        },
      ],
    },
    PushNotifications: {
      // iOS 14+: use "banner" + "list" instead of deprecated "alert"
      presentationOptions: ["badge", "sound", "banner", "list"],
    },
  },
};

export default config;
