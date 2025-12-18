// Root-level server.js entry point for Azure App Service
// This ensures Azure can find the server regardless of the start command

// Keep the process alive - DO NOT unref() as it allows the process to exit
const keepAliveInterval = setInterval(() => {
  // Keep event loop busy
}, 30000);

// Set a startup timeout to catch hanging issues
const startupTimeout = setTimeout(() => {
  console.error('\n❌ STARTUP TIMEOUT: Server did not start within 30 seconds');
  console.error('The app may be hanging on database connection or module loading');
  process.exit(1);
}, 30000);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🚀 InfraTrack Application Starting...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📌 Port: ${process.env.PORT || '8080 (default)'}`);
console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Missing'}`);
console.log(`🔑 MONGODB_URI: ${process.env.MONGODB_URI ? '✓ Set' : '✗ Missing'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

try {
  // Load the main server
  require('./src/server.js');
  
  // Clear startup timeout once server loads
  clearTimeout(startupTimeout);
  
  console.log('\n✅ Server module loaded successfully');
  console.log('✅ Process will stay alive with setInterval\n');
} catch (error) {
  clearTimeout(startupTimeout);
  console.error('\n' + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ CRITICAL ERROR DURING STARTUP:');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('Error type:', error.constructor.name);
  console.error('Error message:', error.message);
  console.error('Stack trace:', error.stack);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.error('🔴 Application failed to start - check logs above for details\n');
  process.exit(1);
}

// Extra safety - keep the process alive
process.on('beforeExit', () => {
  console.log('⚠️  Process would exit, but preventing with setInterval...');
});
