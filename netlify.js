// Netlify build script to handle TypeScript compatibility issues
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting Netlify build process');

// Ensure we're working with a clean environment
process.env.NETLIFY_USE_YARN = 'false';
process.env.NETLIFY_USE_PNPM = 'false';
process.env.NETLIFY_USE_NPM = 'true';
// Force Node to use legacy OpenSSL provider which can help with some compatibility issues
process.env.NODE_OPTIONS = '--openssl-legacy-provider';
// Set max memory for Node
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`;

function runCommand(command, message) {
  console.log(`📋 ${message}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${message} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${message} failed:`, error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

try {
  // Check if package.json exists
  if (!fs.existsSync('./package.json')) {
    console.error('❌ package.json not found!');
    process.exit(1);
  }

  console.log('📦 Starting dependency installation...');
  
  // First try: Regular npm install
  if (!runCommand('npm install --no-optional', 'Dependency installation')) {
    // Second try: Without optional and dev dependencies
    console.log('⚠️ Trying alternative installation approach...');
    if (!runCommand('npm install --production=false --no-optional', 'Alternative dependency installation')) {
      // Third try: Install critical dependencies only
      console.log('⚠️ Trying minimal installation...');
      if (!runCommand('npm install vue vite @vitejs/plugin-vue', 'Minimal dependency installation')) {
        throw new Error('All dependency installation methods failed');
      }
    }
  }

  // Create required directories if they don't exist
  console.log('📁 Ensuring build directories exist...');
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
  }
  
  // Extra check for vite.config.ts existence
  if (!fs.existsSync('./vite.config.ts')) {
    console.error('⚠️ vite.config.ts not found - this might cause issues');
  }
  
  // Building with simplified config first
  console.log('📦 Building application with Vite...');
  try {
    // IMPORTANT: Separate build command from other logic for clearer error messages
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
  } catch (buildError) {
    console.error('❌ Build failed:', buildError.message);
    
    // If the main build fails, try with a minimal configuration
    console.log('⚠️ Trying alternative build approach...');
    
    // Create a minimal vite.config.js to use as fallback
    const minimalConfig = `
      import { defineConfig } from 'vite';
      import vue from '@vitejs/plugin-vue';
      
      export default defineConfig({
        plugins: [vue()],
        build: {
          minify: false,
          sourcemap: false
        }
      });
    `;
    
    // Check if we should try the fallback approach
    console.log('⚠️ Build failed with standard configuration. Attempting simplified build...');
    
    try {
      const tempConfigPath = './vite.config.fallback.js';
      fs.writeFileSync(tempConfigPath, minimalConfig);
      execSync('npx vite build --config vite.config.fallback.js', { stdio: 'inherit' });
      console.log('✅ Simplified build completed successfully!');
    } catch (fallbackError) {
      console.error('❌ All build attempts failed:', fallbackError.message);
      throw new Error('Unable to complete build with any method');
    }
  }
  
  // Verify the build output exists
  if (!fs.existsSync('./dist/index.html')) {
    throw new Error('Build completed but expected output files are missing');
  }
  
  console.log('✅ Build process completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 