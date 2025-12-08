const Server = require('../models/Server');
const Log = require('../models/Log');
const Alert = require('../models/Alert');
const Cost = require('../models/Cost');
const Deployment = require('../models/Deployment');
const Project = require('../models/Project');

// Get all servers
exports.getServers = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const servers = await Server.find({ organizationId });
    res.json(servers);
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

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Log.countDocuments(query);

    res.json({
      logs,
      total,
      hasMore: skip + logs.length < total,
    });
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

    const alerts = await Alert.find(query)
      .sort({ triggeredAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Alert.countDocuments(query);

    res.json({
      alerts,
      total,
      hasMore: skip + alerts.length < total,
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

    const costs = await Cost.find(query).sort({ date: -1 });

    const totalCost = costs.reduce((sum, c) => sum + c.cost, 0);

    res.json({
      costs,
      totalCost,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get deployments
exports.getDeployments = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { status, environment, limit = 50, skip = 0 } = req.query;

    const query = { organizationId };

    if (status) query.status = status;
    if (environment) query.environment = environment;

    const deployments = await Deployment.find(query)
      .sort({ startedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Deployment.countDocuments(query);

    res.json({
      deployments,
      total,
      hasMore: skip + deployments.length < total,
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
