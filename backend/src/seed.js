require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Server = require('./models/Server');
const Log = require('./models/Log');
const Alert = require('./models/Alert');
const Cost = require('./models/Cost');
const Deployment = require('./models/Deployment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infratrack';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Server.deleteMany({});
    await Log.deleteMany({});
    await Alert.deleteMany({});
    await Cost.deleteMany({});
    await Deployment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      organizationId: 'SA-GOV-001',
      name: 'Mohammed Daniyal',
      email: 'admin@enterprise.sa',
      password: hashedPassword,
      role: 'Admin',
      department: 'Infrastructure',
      status: 'active',
      lastLogin: new Date(),
    });
    console.log('✅ Created admin user');

    // Create demo DevOps user
    const devopsUser = await User.create({
      organizationId: 'SA-GOV-001',
      name: 'Ali Al-Mansouri',
      email: 'devops@enterprise.sa',
      password: hashedPassword,
      role: 'DevOps',
      department: 'DevOps',
      status: 'active',
    });
    console.log('✅ Created DevOps user');

    // Create demo Viewer user
    const viewerUser = await User.create({
      organizationId: 'SA-GOV-001',
      name: 'Sara Al-Dosari',
      email: 'viewer@enterprise.sa',
      password: hashedPassword,
      role: 'Viewer',
      department: 'Operations',
      status: 'active',
    });
    console.log('✅ Created Viewer user');

    // Create demo servers
    const servers = await Server.insertMany([
      {
        organizationId: 'SA-GOV-001',
        name: 'Web Server 1',
        hostname: 'web-01.enterprise.sa',
        ipAddress: '192.168.1.10',
        status: 'running',
        region: 'sa-central',
        cpu: 65,
        memory: 72,
        disk: 85,
        network: 1250,
        tags: ['production', 'web'],
      },
      {
        organizationId: 'SA-GOV-001',
        name: 'Database Server',
        hostname: 'db-01.enterprise.sa',
        ipAddress: '192.168.1.20',
        status: 'running',
        region: 'sa-central',
        cpu: 45,
        memory: 88,
        disk: 92,
        network: 2100,
        tags: ['production', 'database'],
      },
      {
        organizationId: 'SA-GOV-001',
        name: 'API Server',
        hostname: 'api-01.enterprise.sa',
        ipAddress: '192.168.1.30',
        status: 'running',
        region: 'sa-central',
        cpu: 52,
        memory: 64,
        disk: 78,
        network: 1800,
        tags: ['production', 'api'],
      },
    ]);
    console.log('✅ Created 3 demo servers');

    // Create demo logs
    const now = new Date();
    const logs = await Log.insertMany([
      {
        organizationId: 'SA-GOV-001',
        serverId: servers[0]._id,
        type: 'application',
        severity: 'info',
        message: 'Application started successfully',
        source: 'app-service',
        timestamp: new Date(now.getTime() - 5 * 60000),
      },
      {
        organizationId: 'SA-GOV-001',
        serverId: servers[1]._id,
        type: 'application',
        severity: 'warning',
        message: 'High memory usage detected: 88%',
        source: 'monitoring',
        timestamp: new Date(now.getTime() - 3 * 60000),
      },
      {
        organizationId: 'SA-GOV-001',
        serverId: servers[0]._id,
        type: 'security',
        severity: 'critical',
        message: 'Failed login attempt from 10.0.0.5',
        source: 'auth-service',
        timestamp: new Date(now.getTime() - 1 * 60000),
      },
    ]);
    console.log('✅ Created 3 demo logs');

    // Create demo alerts
    const alerts = await Alert.insertMany([
      {
        organizationId: 'SA-GOV-001',
        serverId: servers[1]._id,
        title: 'High CPU Usage',
        description: 'CPU usage on Database Server exceeded 80%',
        severity: 'high',
        status: 'active',
        triggeredAt: new Date(now.getTime() - 10 * 60000),
      },
      {
        organizationId: 'SA-GOV-001',
        serverId: servers[0]._id,
        title: 'Disk Space Low',
        description: 'Disk usage on Web Server 1 is at 85%',
        severity: 'medium',
        status: 'acknowledged',
        triggeredAt: new Date(now.getTime() - 20 * 60000),
      },
      {
        organizationId: 'SA-GOV-001',
        serverId: servers[2]._id,
        title: 'Service Down',
        description: 'API Server health check failed',
        severity: 'critical',
        status: 'active',
        triggeredAt: new Date(now.getTime() - 2 * 60000),
      },
    ]);
    console.log('✅ Created 3 demo alerts');

    // Create demo cost data
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const costs = await Cost.insertMany([
      {
        organizationId: 'SA-GOV-001',
        date: startDate,
        service: 'Compute',
        cost: 15000,
        region: 'sa-central',
      },
      {
        organizationId: 'SA-GOV-001',
        date: startDate,
        service: 'Storage',
        cost: 8500,
        region: 'sa-central',
      },
      {
        organizationId: 'SA-GOV-001',
        date: startDate,
        service: 'Networking',
        cost: 3200,
        region: 'sa-central',
      },
      {
        organizationId: 'SA-GOV-001',
        date: startDate,
        service: 'Database',
        cost: 12000,
        region: 'sa-central',
      },
    ]);
    console.log('✅ Created 4 demo cost records');

    // Create demo deployments
    const deployments = await Deployment.insertMany([
      {
        organizationId: 'SA-GOV-001',
        pipelineId: 'pipe-001',
        name: 'Production Release v2.1.0',
        status: 'success',
        version: 'v2.1.0',
        commitHash: 'abc123def456',
        environment: 'production',
        duration: 1250,
        startedAt: new Date(now.getTime() - 2 * 3600000),
        completedAt: new Date(now.getTime() - 1.98 * 3600000),
      },
      {
        organizationId: 'SA-GOV-001',
        pipelineId: 'pipe-002',
        name: 'Staging Release v2.1.0-beta',
        status: 'success',
        version: 'v2.1.0-beta',
        commitHash: 'xyz789abc123',
        environment: 'staging',
        duration: 890,
        startedAt: new Date(now.getTime() - 5 * 3600000),
        completedAt: new Date(now.getTime() - 4.98 * 3600000),
      },
      {
        organizationId: 'SA-GOV-001',
        pipelineId: 'pipe-003',
        name: 'Development Deployment',
        status: 'running',
        version: 'v2.2.0-dev',
        commitHash: 'new456abc789',
        environment: 'dev',
        duration: 0,
        startedAt: new Date(now.getTime() - 15 * 60000),
      },
    ]);
    console.log('✅ Created 3 demo deployments');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Organization ID: SA-GOV-001');
    console.log('   Admin Email: admin@enterprise.sa');
    console.log('   DevOps Email: devops@enterprise.sa');
    console.log('   Viewer Email: viewer@enterprise.sa');
    console.log('   Password (all users): admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
