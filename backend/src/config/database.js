const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('⚠️  MONGODB_URI not set - app will start in limited mode');
    console.warn('📝 Please set MONGODB_URI in Azure App Service Configuration');
    return false; // Return false instead of throwing
  }

  try {
    await mongoose.connect(mongoUri, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: false,
      directConnection: false,
    });

    // Disable buffering - fail fast instead of buffering queries
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferTimeoutMS', 20000);

    console.log('✅ Cosmos DB Connected');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.warn('⚠️  App will start without database - some features may not work');
    return false; // Don't crash the app
  }
};

module.exports = connectDB;
