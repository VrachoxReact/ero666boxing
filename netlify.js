// Netlify build script to handle TypeScript compatibility issues
import { execSync } from 'child_process';
import fs from 'fs';

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

  // Run dependency installation with better error handling
  console.log('📦 Installing dependencies with NPM...');
  try {
    // Try npm install instead of npm ci for better compatibility
    execSync('npm install --no-optional', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (installError) {
    console.error('❌ Dependency installation failed:', installError.message);
    console.error('Stack trace:', installError.stack);
    // Try with fallback approach
    console.log('⚠️ Trying alternative installation approach...');
    execSync('npm install --production=false --no-optional', { stdio: 'inherit' });
  }
  
  // Skip TypeScript checking for production builds on Netlify
  console.log('📦 Building application with Vite (TypeScript checking disabled)');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 