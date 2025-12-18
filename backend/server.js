// Root-level server.js entry point for Azure App Service
// This ensures Azure can find the server regardless of the start command

// Keep the process alive - DO NOT unref() as it allows the process to exit
const keepAliveInterval = setInterval(() => {
  // Keep event loop busy
}, 30000);

console.log('InfraTrack entrypoint booting...');
console.log(`Env: ${process.env.NODE_ENV || 'development'} | Port: ${process.env.PORT || '8080 (default)'}`);

try {
  // Load the main server
  require('./src/server.js');
  
  console.log('✅ Server module loaded successfully\n');
  console.log('✅ Process will stay alive with setInterval\n');
} catch (error) {
  console.error('\n❌ CRITICAL ERROR during startup:');
  console.error('Error type:', error.constructor.name);
  console.error('Error message:', error.message);
  console.error('Stack trace:', error.stack);
  console.error('\n🔴 Application failed to start\n');
  process.exit(1);
}

// Extra safety - keep the process alive
process.on('beforeExit', () => {
  console.log('⚠️  Process would exit, but preventing with setInterval...');
});
