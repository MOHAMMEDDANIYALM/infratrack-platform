const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('⚠️ MONGODB_URI not set - database features disabled');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Cosmos DB Connected:', mongoUri.substring(0, 30) + '...');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('   Check MONGODB_URI in Azure App Settings');
  }
};

module.exports = connectDB;
