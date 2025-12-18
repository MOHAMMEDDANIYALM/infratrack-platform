const Server = require('../models/Server');
const Log = require('../models/Log');
const Alert = require('../models/Alert');
const Cost = require('../models/Cost');
const Deployment = require('../models/Deployment');
const Project = require('../models/Project');
const azureService = require('../services/azureService');

// Get all servers
exports.getServers = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const servers = await Server.find({ organizationId }).catch(() => null);
    
    // Return servers from DB if available, otherwise return demo data
    if (servers && servers.length > 0) {
      return res.json(servers);
    }

    // Demo data for testing without database
    const demoServers = [
      {
        id: '1',
        name: 'EU-WEST-2-APP-01',
        status: 'running',
        cpu: 65,
        memory: 78,
        disk: 45,
        uptime: '99.8%',
        region: 'eu-west-2',
        instanceType: 'Standard_D4s_v3',
      },
      {
        id: '2',
        name: 'EU-CENTRAL-API-02',
        status: 'running',
        cpu: 42,
        memory: 56,
        disk: 62,
        uptime: '99.9%',
        region: 'eu-central-1',
        instanceType: 'Standard_D2s_v3',
      },
      {
        id: '3',
        name: 'US-EAST-1-DB-03',
        status: 'running',
        cpu: 85,
        memory: 92,
        disk: 78,
        uptime: '99.7%',
        region: 'us-east-1',
        instanceType: 'Standard_E4s_v5',
      },
      {
        id: '4',
        name: 'ASIA-SOUTH-WEB-05',
        status: 'running',
        cpu: 35,
        memory: 48,
        disk: 55,
        uptime: '99.95%',
        region: 'asia-south-1',
        instanceType: 'Standard_B2s',
      },
      {
        id: '5',
        name: 'SA-CENTRAL-CACHE-01',
        status: 'running',
        cpu: 71,
        memory: 81,
        disk: 38,
        uptime: '99.6%',
        region: 'sa-central-1',
        instanceType: 'Standard_D4s_v3',
      },
    ];

    res.json(demoServers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create server
exports.createServer = async (req, res) => {
  try {
    const { organizationId, role } = req.user;

    if (role !== 'Admin' && role !== 'DevOps') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const server = await Server.create({
      ...req.body,
      organizationId,
    });

    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update server
exports.updateServer = async (req, res) => {
  try {
    const { organizationId, role } = req.user;
    const { serverId } = req.params;

    if (role !== 'Admin' && role !== 'DevOps') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const server = await Server.findOneAndUpdate(
      { _id: serverId, organizationId },
      req.body,
      { new: true }
    );

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    res.json(server);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard metrics
exports.getDashboardMetrics = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const serverCount = await Server.countDocuments({ organizationId });
    const activeServers = await Server.countDocuments({
      organizationId,
      status: 'running',
    });
    const criticalAlerts = await Alert.countDocuments({
      organizationId,
      severity: 'critical',
      status: 'active',
    });

    // Calculate average metrics
    const servers = await Server.find({ organizationId });
    const avgCpu = servers.reduce((sum, s) => sum + s.cpu, 0) / (servers.length || 1);
    const avgMemory = servers.reduce((sum, s) => sum + s.memory, 0) / (servers.length || 1);

    res.json({
      totalServers: serverCount,
      activeServers,
      criticalAlerts,
      avgCpu: Math.round(avgCpu),
      avgMemory: Math.round(avgMemory),
      uptime: 99.9,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get logs
exports.getLogs = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { type, severity, search, limit = 50, skip = 0 } = req.query;

    const query = { organizationId };

    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (search) {
      query.message = { $regex: search, $options: 'i' };
    }

    // Prefer Azure Log Analytics if configured
    try {
      const azureLogs = await azureService.getRecentLogs({ search, severity, limit });
      if (Array.isArray(azureLogs) && azureLogs.length) {
        return res.json({ logs: azureLogs.slice(parseInt(skip) || 0, (parseInt(skip) || 0) + (parseInt(limit) || 50)), total: azureLogs.length });
      }
    } catch (e) {
      // continue to DB/demo
    }

    try {
      const logs = await Log.find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const total = await Log.countDocuments(query);

      if (logs && logs.length > 0) {
        return res.json({ logs, total });
      }
    } catch (e) {
      // Continue to demo data if DB fails
    }

    // Demo logs
    const demoLogs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        type: 'application',
        severity: 'error',
        source: 'api-service',
        message: 'Database connection timeout after 30 seconds',
        user: 'system',
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 120000).toISOString(),
        type: 'security',
        severity: 'warning',
        source: 'auth-service',
        message: 'Multiple failed login attempts detected',
        user: 'admin@enterprise.sa',
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'audit',
        severity: 'info',
        source: 'user-management',
        message: 'User role updated from Viewer to DevOps',
        user: 'superadmin@enterprise.sa',
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 360000).toISOString(),
        type: 'application',
        severity: 'critical',
        source: 'payment-service',
        message: 'Payment gateway connection failed',
        user: 'system',
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 480000).toISOString(),
        type: 'security',
        severity: 'warning',
        source: 'firewall',
        message: 'Potential DDoS attack detected',
        user: 'system',
      },
    ];

    res.json({ logs: demoLogs, total: demoLogs.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create log
exports.createLog = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const log = await Log.create({
      ...req.body,
      organizationId,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get alerts
exports.getAlerts = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { status, severity, limit = 50, skip = 0 } = req.query;

    const query = { organizationId };

    if (status) query.status = status;
    if (severity) query.severity = severity;

    // Prefer Azure alerts
    try {
      const azureAlerts = await azureService.getActiveAlerts();
      if (Array.isArray(azureAlerts) && azureAlerts.length) {
        const alerts = azureAlerts.slice(parseInt(skip) || 0).slice(0, parseInt(limit) || 50).map(a => ({
          id: a.id,
          title: a.name,
          description: a.description,
          priority: a.severity,
          severity: a.severity,
          status: 'active',
          message: a.description || a.name,
          triggeredAt: new Date().toISOString(),
          resource: a.resourceId || 'Azure',
          service: 'Azure Monitor',
          affected: a.resourceId || 'Resource'
        }));
        return res.json({ alerts, total: azureAlerts.length, hasMore: false });
      }
    } catch (e) {
      // continue to DB/demo
    }

    try {
      const alerts = await Alert.find(query)
        .sort({ triggeredAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const total = await Alert.countDocuments(query);

      if (alerts && alerts.length > 0) {
        return res.json({
          alerts,
          total,
          hasMore: skip + alerts.length < total,
        });
      }
    } catch (e) {
      // Continue to demo data if DB fails
    }

    // Demo alerts in INR context
    const demoAlerts = [
      {
        id: 1,
        title: 'High CPU Usage Alert',
        description: 'Server EU-WEST-2-APP-01 CPU usage exceeded 95% threshold',
        priority: 'critical',
        severity: 'critical',
        status: 'active',
        message: 'CPU usage at 95%',
        triggeredAt: new Date().toISOString(),
        resource: 'EU-WEST-2-APP-01',
        service: 'Compute',
        affected: 'EU-WEST-2-APP-01',
      },
      {
        id: 2,
        title: 'Server Down',
        description: 'Server EU-CENTRAL-API-02 is not responding',
        priority: 'critical',
        severity: 'critical',
        status: 'active',
        message: 'Server not responding',
        triggeredAt: new Date(Date.now() - 300000).toISOString(),
        resource: 'EU-CENTRAL-API-02',
        service: 'Compute',
        affected: 'EU-CENTRAL-API-02',
      },
      {
        id: 3,
        title: 'Budget Exceeded',
        description: 'Monthly cloud cost exceeded 90% of budget limit (₹50L)',
        priority: 'high',
        severity: 'high',
        status: 'active',
        message: 'Cost budget 90% consumed',
        triggeredAt: new Date(Date.now() - 600000).toISOString(),
        resource: 'All Services',
        service: 'Billing',
        affected: 'All Services',
      },
      {
        id: 4,
        title: 'High Memory Usage',
        description: 'Database server RAM usage at 85%',
        priority: 'medium',
        severity: 'medium',
        status: 'active',
        message: 'Memory at 85%',
        triggeredAt: new Date(Date.now() - 900000).toISOString(),
        resource: 'US-EAST-1-DB-03',
        service: 'Database',
        affected: 'US-EAST-1-DB-03',
      },
      {
        id: 5,
        title: 'Pod Restart Loop',
        description: 'Kubernetes pod cache-redis restarted 15 times',
        priority: 'high',
        severity: 'high',
        status: 'active',
        message: 'Pod restarting',
        triggeredAt: new Date(Date.now() - 1200000).toISOString(),
        resource: 'cache-redis',
        service: 'Kubernetes',
        affected: 'cache-redis pod',
      },
    ];

    res.json({
      alerts: demoAlerts.slice(0, parseInt(limit)),
      total: demoAlerts.length,
      hasMore: false,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update alert
exports.updateAlert = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { alertId } = req.params;
    const { status } = req.body;

    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, organizationId },
      {
        status,
        resolvedAt: status === 'resolved' ? new Date() : null,
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get costs
exports.getCosts = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { startDate, endDate, service } = req.query;

    const query = { organizationId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (service) query.service = service;

    // Prefer real Azure Cost Management data when available
    const azureCosts = await azureService.getCostBreakdown({ startDate, endDate, service });
    if (azureCosts && azureCosts.source === 'azure' && Array.isArray(azureCosts.costs) && azureCosts.costs.length) {
      return res.json(azureCosts);
    }

    try {
      const costs = await Cost.find(query).sort({ date: -1 });
      if (costs && costs.length > 0) {
        const totalCost = costs.reduce((sum, c) => sum + c.cost, 0);
        return res.json({ costs, totalCost });
      }
    } catch (e) {
      // Continue to demo data if DB fails
    }

    // Demo cost data in INR
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const demoCosts = [
      { date: startOfMonth, service: 'Compute', cost: 1250000 },
      { date: startOfMonth, service: 'Storage', cost: 750000 },
      { date: startOfMonth, service: 'Networking', cost: 350000 },
      { date: startOfMonth, service: 'Database', cost: 850000 },
      { date: new Date(startOfMonth.getTime() + 86400000 * 5), service: 'Compute', cost: 1300000 },
      { date: new Date(startOfMonth.getTime() + 86400000 * 5), service: 'Storage', cost: 800000 },
      { date: new Date(startOfMonth.getTime() + 86400000 * 10), service: 'Compute', cost: 1280000 },
      { date: new Date(startOfMonth.getTime() + 86400000 * 10), service: 'Database', cost: 900000 },
      { date: new Date(startOfMonth.getTime() + 86400000 * 15), service: 'Networking', cost: 380000 },
      { date: new Date(startOfMonth.getTime() + 86400000 * 15), service: 'Storage', cost: 820000 },
    ];

    const totalCost = demoCosts.reduce((sum, c) => sum + c.cost, 0);
    res.json({ costs: demoCosts, totalCost });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get deployments
exports.getDeployments = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { status, environment, limit = 50, skip = 0 } = req.query;

    // Prefer live GitHub Actions data when configured
    const ghToken = process.env.GITHUB_TOKEN || process.env.token_git || process.env.TOKEN_GIT || process.env.GH_TOKEN;
    const ghRepo = process.env.GITHUB_REPO; // format: owner/repo

    if (ghToken && ghRepo) {
      const perPage = 100;
      const maxPages = 5; // up to 500 runs
      const allRuns = [];
      for (let page = 1; page <= maxPages; page++) {
        const url = new URL(`https://api.github.com/repos/${ghRepo}/actions/runs`);
        url.searchParams.set('per_page', perPage);
        url.searchParams.set('page', page);
        const resp = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'infratrack-app'
          }
        });
        if (!resp.ok) {
          const text = await resp.text();
          return res.status(resp.status).json({ message: 'Failed to fetch GitHub workflows', error: text });
        }
        const data = await resp.json();
        const runs = Array.isArray(data.workflow_runs) ? data.workflow_runs : [];
        allRuns.push(...runs);
        if (runs.length < perPage) break; // no more pages
      }

      const mapStatus = (run) => {
        if (run.status === 'in_progress' || run.status === 'queued') return 'running';
        if (run.conclusion === 'success') return 'success';
        if (run.conclusion === 'skipped' || run.conclusion === 'cancelled') return 'success';
        if (run.conclusion === 'failure' || run.conclusion === 'timed_out') return 'failed';
        return 'running';
      };

      const deployments = allRuns.slice(parseInt(skip) || 0).map((run) => {
        const started = run.run_started_at || run.created_at;
        const completed = run.updated_at;
        const durationSeconds = started && completed ? Math.max(0, (new Date(completed) - new Date(started)) / 1000) : 0;

        return {
          id: run.id,
          name: run.name || run.display_title || run.head_branch || 'workflow',
          status: mapStatus(run),
          version: run.head_branch,
          commitHash: run.head_sha,
          environment: run.event,
          duration: durationSeconds,
          startedAt: started,
          completedAt: completed,
          htmlUrl: run.html_url
        };
      });

      return res.json({ deployments, total: deployments.length, hasMore: false });
    }

    // Fallback to database deployments
    const query = { organizationId };

    if (status) query.status = status;
    if (environment) query.environment = environment;

    try {
      const deployments = await Deployment.find(query)
        .sort({ startedAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const total = await Deployment.countDocuments(query);

      if (deployments && deployments.length > 0) {
        return res.json({
          deployments,
          total,
          hasMore: skip + deployments.length < total,
        });
      }
    } catch (e) {
      // Continue to demo data if DB fails
    }

    // Demo deployments data
    const demoDeployments = [
      {
        id: '1',
        name: 'Production Release v2.1.0',
        status: 'success',
        version: 'v2.1.0',
        commitHash: 'abc123def456',
        environment: 'production',
        duration: 1245,
        startedAt: new Date(Date.now() - 86400000).toISOString(),
        completedAt: new Date(Date.now() - 86400000 + 1245000).toISOString(),
      },
      {
        id: '2',
        name: 'Staging Deployment v2.0.9',
        status: 'success',
        version: 'v2.0.9',
        commitHash: 'xyz789abc123',
        environment: 'staging',
        duration: 892,
        startedAt: new Date(Date.now() - 172800000).toISOString(),
        completedAt: new Date(Date.now() - 172800000 + 892000).toISOString(),
      },
      {
        id: '3',
        name: 'Production Hotfix v2.0.8',
        status: 'success',
        version: 'v2.0.8',
        commitHash: 'def456xyz789',
        environment: 'production',
        duration: 756,
        startedAt: new Date(Date.now() - 259200000).toISOString(),
        completedAt: new Date(Date.now() - 259200000 + 756000).toISOString(),
      },
      {
        id: '4',
        name: 'Development Build v2.1.0-rc1',
        status: 'failed',
        version: 'v2.1.0-rc1',
        commitHash: '123abc456def',
        environment: 'development',
        duration: 534,
        startedAt: new Date(Date.now() - 345600000).toISOString(),
        completedAt: new Date(Date.now() - 345600000 + 534000).toISOString(),
      },
      {
        id: '5',
        name: 'API Service Update v1.5.2',
        status: 'success',
        version: 'v1.5.2',
        commitHash: '456def123abc',
        environment: 'production',
        duration: 1089,
        startedAt: new Date(Date.now() - 432000000).toISOString(),
        completedAt: new Date(Date.now() - 432000000 + 1089000).toISOString(),
      },
      {
        id: '6',
        name: 'Database Migration v1.4.0',
        status: 'success',
        version: 'v1.4.0',
        commitHash: 'abc789def456',
        environment: 'production',
        duration: 2145,
        startedAt: new Date(Date.now() - 518400000).toISOString(),
        completedAt: new Date(Date.now() - 518400000 + 2145000).toISOString(),
      },
    ];

    res.json({
      deployments: demoDeployments.slice(parseInt(skip) || 0).slice(0, parseInt(limit) || 50),
      total: demoDeployments.length,
      hasMore: (parseInt(skip) || 0) + (parseInt(limit) || 50) < demoDeployments.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ GET USER PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users in organization
exports.getUsers = async (req, res) => {
  try {
    const { organizationId, role } = req.user;
    
    // Only Admin can view all users
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const User = require('../models/User');
    const users = await User.find({ organizationId })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: create user
exports.createUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    const { name, email, password, department, organizationId, role: newRole } = req.body;
    if (!name || !email || !password || !organizationId) {
      return res.status(400).json({ message: 'name, email, password, organizationId are required' });
    }
    const User = require('../models/User');
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      organizationId,
      name,
      email,
      password: hashed,
      department: department || '',
      role: newRole || 'Viewer',
      status: 'active'
    });
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        organizationId: user.organizationId,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
