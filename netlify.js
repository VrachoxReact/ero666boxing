// Netlify build script to handle TypeScript compatibility issues
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Netlify build process');

// Ensure we're working with a clean environment
process.env.NETLIFY_USE_YARN = 'false';
process.env.NETLIFY_USE_PNPM = 'false';
process.env.NETLIFY_USE_NPM = 'true';

try {
  // Check if package.json exists
  if (!fs.existsSync('./package.json')) {
    console.error('❌ package.json not found!');
    process.exit(1);
  }

  // Run clean NPM install specifically with no external tools
  console.log('📦 Installing dependencies with NPM...');
  execSync('npm ci --no-optional --prefer-offline --no-audit', { stdio: 'inherit' });
  
  // Skip TypeScript checking for production builds on Netlify
  console.log('📦 Building application with Vite (TypeScript checking disabled)');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 