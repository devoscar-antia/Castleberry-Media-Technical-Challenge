# KOL App — Build & Deployment Guide

This project supports **two app variants** with different bundle IDs:

| Variant | Bundle ID | Description |
|---------|-----------|-------------|
| **SES** (default) | `com.newbrain.kol.ses` | New public app (Unlisted on stores) |
| **TestFlight** | `com.newbrain.kol.ios` | Old private TestFlight app |

The variant is controlled by the `APP_VARIANT` environment variable. If not set, it defaults to **SES**.

---

## Quick Reference

### Default (SES app — `com.newbrain.kol.ses`)

```bash
# Build + sync iOS
npm run ios:prep

# Build + sync Android
npm run android:prep

# Just sync (no rebuild)
npm run ios:sync
npm run android:sync
```

### TestFlight app (`com.newbrain.kol.ios`)

```bash
# Build + sync iOS
npm run ios:prep:testflight

# Build + sync Android
npm run android:prep:testflight

# Just sync (no rebuild)
npm run ios:sync:testflight
npm run android:sync:testflight
```

### Manual variant selection

You can also set `APP_VARIANT` directly:

```bash
# SES (default — same as omitting the variable)
APP_VARIANT=ses npx cap sync ios

# TestFlight
APP_VARIANT=testflight npx cap sync ios
```

---

## Full Build Workflow

### 1. Update version (optional)

```bash
npm run version:set -- 1.9.5
```

See [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md) for details.

### 2. Build the web app

```bash
npm run build
```

### 3. Sync to native platforms

```bash
# Default (SES)
npx cap sync ios
npx cap sync android

# TestFlight
APP_VARIANT=testflight npx cap sync ios
APP_VARIANT=testflight npx cap sync android
```

### 4. Open in IDE & run

```bash
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

Or run directly on a device/emulator:

```bash
npx cap run ios
npx cap run android
```

---

## How It Works

The `capacitor.config.ts` file reads `process.env.APP_VARIANT`:

- If `APP_VARIANT=testflight` → uses `com.newbrain.kol.ios`
- Otherwise (default) → uses `com.newbrain.kol.ses`

The npm scripts in `package.json` wrap this:

| Script | Variant | Action |
|--------|---------|--------|
| `ios:sync` | SES | Sync iOS |
| `ios:sync:testflight` | TestFlight | Sync iOS |
| `ios:prep` | SES | Build + Sync iOS |
| `ios:prep:testflight` | TestFlight | Build + Sync iOS |
| `android:sync` | SES | Sync Android |
| `android:sync:testflight` | TestFlight | Sync Android |
| `android:prep` | SES | Build + Sync Android |
| `android:prep:testflight` | TestFlight | Build + Sync Android |

---

## Important Notes

- **Push Notifications**: Each variant uses a different APNS topic matching its bundle ID. Ensure your Edge Functions (`send-push-notification`, `test-push-notification`) use the correct topic for the target app.
- **Google Services**: Each variant may need its own `google-services.json` (Android) and `GoogleService-Info.plist` (iOS).
- **Signing**: Each variant requires its own provisioning profile and signing certificate.
