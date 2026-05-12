#!/usr/bin/env node

/**
 * Syncs version from src/config/version.ts to native platforms
 * Automatically updates:
 * - android/app/build.gradle (versionName, versionCode)
 * - ios/App/App.xcodeproj/project.pbxproj (MARKETING_VERSION, CURRENT_PROJECT_VERSION)
 */

const fs = require('fs');
const path = require('path');

// Read version from source of truth
const versionFilePath = path.join(__dirname, '../src/config/version.ts');
const versionFileContent = fs.readFileSync(versionFilePath, 'utf8');

const versionMatch = versionFileContent.match(/APP_VERSION\s*=\s*["'](.+?)["']/);
const buildMatch = versionFileContent.match(/BUILD_NUMBER\s*=\s*(\d+)/);

if (!versionMatch || !buildMatch) {
  console.error('❌ Could not parse version from src/config/version.ts');
  process.exit(1);
}

const APP_VERSION = versionMatch[1];
const BUILD_NUMBER = parseInt(buildMatch[1], 10);

console.log(`📦 Syncing version: ${APP_VERSION} (build ${BUILD_NUMBER})`);

// Update Android build.gradle
const androidGradlePath = path.join(__dirname, '../android/app/build.gradle');
if (fs.existsSync(androidGradlePath)) {
  let gradleContent = fs.readFileSync(androidGradlePath, 'utf8');
  
  // Update versionCode
  gradleContent = gradleContent.replace(
    /versionCode\s+\d+/,
    `versionCode ${BUILD_NUMBER}`
  );
  
  // Update versionName
  gradleContent = gradleContent.replace(
    /versionName\s+["'].+?["']/,
    `versionName "${APP_VERSION}"`
  );
  
  fs.writeFileSync(androidGradlePath, gradleContent, 'utf8');
  console.log('✅ Updated android/app/build.gradle');
} else {
  console.log('⚠️  android/app/build.gradle not found, skipping Android');
}

// Update iOS project.pbxproj
const iosProjectPath = path.join(__dirname, '../ios/App/App.xcodeproj/project.pbxproj');
if (fs.existsSync(iosProjectPath)) {
  let projectContent = fs.readFileSync(iosProjectPath, 'utf8');
  
  // Update MARKETING_VERSION (appears twice - Debug and Release)
  projectContent = projectContent.replace(
    /MARKETING_VERSION\s*=\s*[^;]+;/g,
    `MARKETING_VERSION = ${APP_VERSION};`
  );
  
  // Update CURRENT_PROJECT_VERSION (appears twice - Debug and Release)
  projectContent = projectContent.replace(
    /CURRENT_PROJECT_VERSION\s*=\s*[^;]+;/g,
    `CURRENT_PROJECT_VERSION = ${BUILD_NUMBER};`
  );
  
  fs.writeFileSync(iosProjectPath, projectContent, 'utf8');
  console.log('✅ Updated ios/App/App.xcodeproj/project.pbxproj');
} else {
  console.log('⚠️  ios/App/App.xcodeproj/project.pbxproj not found, skipping iOS');
}

console.log('');
console.log('🎉 Version sync complete!');
console.log(`   Version: ${APP_VERSION}`);
console.log(`   Build: ${BUILD_NUMBER}`);
console.log('');
console.log('Next steps:');
console.log('  1. npm run build');
console.log('  2. npx cap sync');
