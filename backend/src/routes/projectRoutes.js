const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getServers,
  createServer,
  updateServer,
  getDashboardMetrics,
  getLogs,
  createLog,
  getAlerts,
  updateAlert,
  getCosts,
  getDeployments,
  getUsers,
} = require('../controllers/projectController');

// Dashboard
router.get('/dashboard/metrics', protect, getDashboardMetrics);

// Servers
router.get('/servers', protect, getServers);
router.post('/servers', protect, authorize(['Admin', 'DevOps']), createServer);
router.put('/servers/:serverId', protect, authorize(['Admin', 'DevOps']), updateServer);

// Logs
router.get('/logs', protect, getLogs);
router.post('/logs', protect, authorize(['Admin', 'DevOps']), createLog);

// Alerts
router.get('/alerts', protect, getAlerts);
router.put('/alerts/:alertId', protect, updateAlert);

// Costs
router.get('/costs', protect, getCosts);

// Deployments
router.get('/deployments', protect, getDeployments);

// Users
router.get('/users', protect, getUsers);

module.exports = router;
