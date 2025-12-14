// Root-level server.js entry point for Azure App Service
// This ensures Azure can find the server regardless of the start command

console.log('========================================');
console.log('🔧 InfraTrack Backend Entry Point');
console.log('========================================');
console.log('📁 Root directory:', __dirname);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || '5000 (default)');
console.log('📅 Started at:', new Date().toISOString());
console.log('========================================\n');

try {
  // Load the main server
  require('./src/server.js');
  
  console.log('✅ Server module loaded successfully\n');
} catch (error) {
  console.error('\n❌ CRITICAL ERROR during startup:');
  console.error('Error type:', error.constructor.name);
  console.error('Error message:', error.message);
  console.error('Stack trace:', error.stack);
  console.error('\n🔴 Application failed to start\n');
  process.exit(1);
}
