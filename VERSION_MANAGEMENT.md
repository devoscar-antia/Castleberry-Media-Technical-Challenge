# Version Management System

This project uses a centralized version management system with a single source of truth for app versions across all platforms (web, iOS, and Android).

## Quick Start

### To update the app version:

```bash
# Update version (auto-increments build number)
npm run version:set -- 1.9.2

# Update version with specific build number
npm run version:set -- 1.9.2 25

# Sync version to native platforms (if you edited version.ts manually)
npm run version:sync
```

## Setup Instructions

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "version:sync": "node scripts/sync-version.cjs",
    "version:set": "node scripts/set-version.cjs",
    "prebuild": "npm run version:sync"
  }
}
```

The `prebuild` script ensures versions are synced before every build.

## File Structure

```
project/
├── src/
│   └── config/
│       └── version.ts          # Single source of truth
├── scripts/
│   ├── sync-version.cjs        # Syncs to native platforms
│   └── set-version.cjs         # CLI tool to update version
├── src/pages/
│   ├── Login.tsx               # Displays version in footer
│   └── Profile.tsx             # Displays version and build
└── VERSION_MANAGEMENT.md       # This file
```

## How It Works

1. **Single Source of Truth**: `src/config/version.ts` contains `APP_VERSION` and `BUILD_NUMBER`
2. **Web App**: Login and Profile pages import and display the version
3. **Auto Sync**: Scripts automatically update:
   - `android/app/build.gradle` (versionName, versionCode)
   - `ios/App/App.xcodeproj/project.pbxproj` (MARKETING_VERSION, CURRENT_PROJECT_VERSION)

## Workflow

1. Update version: `npm run version:set -- 1.9.2`
2. Build project: `npm run build` (automatically runs version:sync)
3. Sync to native: `npx cap sync`
4. Build native apps as usual

## Manual Updates

If you prefer to update manually:

1. Edit `src/config/version.ts`
2. Run `npm run version:sync`
3. Proceed with build

## Version Display

- **Login Page**: Shows version in footer (e.g., "Version 1.9.1")
- **Profile Page**: Shows version and build number (e.g., "Version 1.9.1 (Build 22)")

## Current Version

- **Version**: 1.9.1
- **Build**: 22
