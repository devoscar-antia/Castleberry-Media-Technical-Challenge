# Version & Release Helper — Per Platform Commands

Single source of truth: `src/config/version.ts` (`APP_VERSION` + `BUILD_NUMBER`).
Note: `npm run build` automatically runs `version:sync` first (via the `prebuild` hook),
so native `build.gradle` / `project.pbxproj` are always kept in sync.

---

## ⚡ TL;DR — the one-liner per platform

After bumping the version (or editing `src/config/version.ts`), run **one** command:

```bash
# 🤖 Android (default = SES variant)
npm run android:prep

# 🤖 Android (old private TestFlight variant)
npm run android:prep:testflight

# 🍎 iOS (default = SES variant)
npm run ios:prep

# 🍎 iOS (old private TestFlight variant)
npm run ios:prep:testflight
```

Each `*:prep` script does exactly:
1. `npm run build` → which first runs `version:sync` (updates Android `build.gradle` + iOS `project.pbxproj`) and then builds the web bundle into `dist/`.
2. `npx cap sync <platform>` → copies the web bundle and plugins into the native project.

After that, just open the native IDE and ship.

---

## 0. Bump the version (run once before either platform)

```bash
# Set version (auto-increments build number)
npm run version:set -- 2.0.2

# Set version AND build number explicitly
npm run version:set -- 2.0.2 36

# Or edit src/config/version.ts manually — version:sync runs automatically on next build
```

---

## 1. 🤖 Android — release to Google Play

```bash
npm run android:prep            # build + sync (default SES variant)
# or: npm run android:prep:testflight

npx cap open android            # opens Android Studio
```

In Android Studio:
1. **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**
2. Select the upload keystore, build variant `release`.
3. Upload the resulting `.aab` to Google Play Console.

CLI alternative (no Android Studio):
```bash
cd android && ./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

Icon & label sources:
- Launcher icons: `android/app/src/main/res/mipmap-*/ic_launcher*.png`
- Play Store 512×512: `android/app/src/main/play-store-icon/ic_launcher-playstore.png`
- Display name: `android/app/src/main/res/values/strings.xml` → `app_name = "KOL App"`

---

## 2. 🍎 iOS — release to TestFlight / App Store

Two iOS variants controlled by `APP_VARIANT` (handled automatically by the scripts):

| Script                          | Bundle ID                  | Use case                       |
|---------------------------------|----------------------------|--------------------------------|
| `npm run ios:prep`              | `com.newbrain.kol.ses`     | Public unlisted SES app (default) |
| `npm run ios:prep:testflight`   | `com.newbrain.kol.ios`     | Original private TestFlight app |

```bash
npm run ios:prep                # build + sync (default SES variant)
# or: npm run ios:prep:testflight

npx cap open ios                # opens Xcode
```

In Xcode:
1. Select **App** scheme + **Any iOS Device (arm64)**.
2. **Product → Archive**.
3. **Distribute App → App Store Connect → Upload**.

Icon & label sources:
- AppIcon: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Display name: `ios/App/App/Info.plist` → `CFBundleDisplayName`

---

## 3. End-to-end release checklist

- [ ] `npm run version:set -- X.Y.Z`
- [ ] **Android**: `npm run android:prep` → Android Studio → signed AAB → Play Console
- [ ] **iOS**: `npm run ios:prep` → Xcode → Archive → App Store Connect
- [ ] Verify version on Login & Profile pages
- [ ] Tag the release in GitHub

---

## All available npm scripts (reference)

```
version:set             # Bump APP_VERSION (and optionally BUILD_NUMBER)
version:sync            # Push version.ts values into native projects
build                   # Vite production build (auto-runs version:sync)
build:dev               # Vite build in development mode

android:sync            # cap sync android (SES variant)
android:sync:testflight # cap sync android (TestFlight variant)
android:prep            # build + android:sync               ← one-shot
android:prep:testflight # build + android:sync:testflight    ← one-shot

ios:sync                # cap sync ios (SES variant)
ios:sync:testflight     # cap sync ios (TestFlight variant)
ios:prep                # build + ios:sync                   ← one-shot
ios:prep:testflight     # build + ios:sync:testflight        ← one-shot
```
