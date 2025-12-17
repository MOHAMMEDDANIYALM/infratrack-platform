require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async () => {
  try {
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'Platform Admin', ADMIN_ORG = 'infratrack' } = process.env;
    if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('ADMIN_EMAIL/ADMIN_PASSWORD missing');

    await mongoose.connect(MONGODB_URI);

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('Admin already exists:', ADMIN_EMAIL);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const user = await User.create({
      organizationId: ADMIN_ORG,
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashed,
      role: 'Admin',
      department: 'Administration',
      status: 'active'
    });

    console.log('✅ Admin created:', user.email);
    process.exit(0);
  } catch (e) {
    console.error('Failed to create admin:', e.message);
    process.exit(1);
  }
})();
