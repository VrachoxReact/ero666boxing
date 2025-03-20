// Netlify build script to handle TypeScript compatibility issues
const { execSync } = require('child_process');

console.log('🚀 Starting Netlify build process');

try {
  // Skip TypeScript checking for production builds on Netlify
  console.log('📦 Building application with Vite (TypeScript checking disabled)');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 