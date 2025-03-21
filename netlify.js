// Minimal Netlify build script - simplified for reliability
import { execSync } from 'child_process';

console.log('🚀 Starting simplified Netlify build process');

try {
  // Install dependencies with standard npm install
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Run the build command
  console.log('🔨 Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build process completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 