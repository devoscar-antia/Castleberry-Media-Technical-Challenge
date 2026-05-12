#!/usr/bin/env node

/**
 * CLI tool to update app version
 * Usage: npm run version:set -- 1.9.2
 * or: npm run version:set -- 1.9.2 23
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Usage: npm run version:set -- <version> [buildNumber]');
  console.error('   Example: npm run version:set -- 1.9.2');
  console.error('   Example: npm run version:set -- 1.9.2 23');
  process.exit(1);
}

const newVersion = args[0];
const newBuildNumber = args[1];

// Validate version format
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('❌ Invalid version format. Use semantic versioning: X.Y.Z');
  process.exit(1);
}

const versionFilePath = path.join(__dirname, '../src/config/version.ts');
let versionFileContent = fs.readFileSync(versionFilePath, 'utf8');

// Update APP_VERSION
versionFileContent = versionFileContent.replace(
  /APP_VERSION\s*=\s*["'].+?["']/,
  `APP_VERSION = "${newVersion}"`
);

// Update BUILD_NUMBER if provided
if (newBuildNumber) {
  const buildNum = parseInt(newBuildNumber, 10);
  if (isNaN(buildNum)) {
    console.error('❌ Build number must be a valid integer');
    process.exit(1);
  }
  
  versionFileContent = versionFileContent.replace(
    /BUILD_NUMBER\s*=\s*\d+/,
    `BUILD_NUMBER = ${buildNum}`
  );
  
  console.log(`📝 Setting version to ${newVersion} (build ${buildNum})`);
} else {
  // Auto-increment build number
  const buildMatch = versionFileContent.match(/BUILD_NUMBER\s*=\s*(\d+)/);
  if (buildMatch) {
    const currentBuild = parseInt(buildMatch[1], 10);
    const newBuild = currentBuild + 1;
    
    versionFileContent = versionFileContent.replace(
      /BUILD_NUMBER\s*=\s*\d+/,
      `BUILD_NUMBER = ${newBuild}`
    );
    
    console.log(`📝 Setting version to ${newVersion} (build ${newBuild} - auto-incremented)`);
  }
}

// Write updated version file
fs.writeFileSync(versionFilePath, versionFileContent, 'utf8');
console.log('✅ Updated src/config/version.ts');

// Run sync script
console.log('');
console.log('🔄 Running version sync...');
try {
  execSync('node scripts/sync-version.cjs', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to sync version');
  process.exit(1);
}
