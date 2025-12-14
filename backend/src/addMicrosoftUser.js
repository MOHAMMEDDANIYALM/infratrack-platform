require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not defined.');
  process.exit(1);
}

const addMicrosoftUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'mohammeddaniyal21@gmail.com';
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('ℹ️  User already exists, updating status to active...');
      user.status = 'active';
      user.role = 'Admin';
      await user.save();
      console.log('✅ User updated successfully');
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash('TempPassword123!', 10);
      user = await User.create({
        organizationId: 'SA-GOV-001',
        name: 'Mohammed Daniyal',
        email: email,
        password: hashedPassword,
        role: 'Admin',
        department: 'Infrastructure',
        status: 'active',
      });
      console.log('✅ User created successfully');
    }

    console.log('\n📋 User Details:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}`);
    console.log(`   Organization ID: ${user.organizationId}`);
    console.log('\n✅ You can now log in with your Microsoft account!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addMicrosoftUser();
