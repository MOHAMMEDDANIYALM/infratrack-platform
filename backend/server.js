// Root-level server.js entry point for Azure App Service
// This ensures Azure can find the server regardless of the start command
try {
  console.log('🔄 Starting InfraTrack Backend...');
  console.log('📁 Current directory:', __dirname);
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  require('./src/server.js');
} catch (error) {
  console.error('❌ CRITICAL ERROR during startup:');
  console.error('Error message:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
