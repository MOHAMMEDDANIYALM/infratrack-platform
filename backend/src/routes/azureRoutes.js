const express = require('express');
const router = express.Router();
const azureService = require('../services/azureService');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Azure Metrics Routes
 * REST API endpoints for fetching Azure data
 */

// Get aggregated metrics (CPU, RAM, Disk, Network)
router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const metrics = await azureService.getAggregatedMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Failed to fetch metrics', error: error.message });
  }
});

// Get dashboard stats (Active Servers, Containers, Uptime, Error Rate)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await azureService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

// Get active servers
router.get('/servers', authMiddleware, async (req, res) => {
  try {
    const servers = await azureService.getActiveServers();
    res.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ message: 'Failed to fetch servers', error: error.message });
  }
});

// Get active alerts
router.get('/alerts', authMiddleware, async (req, res) => {
  try {
    const alerts = await azureService.getActiveAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
});

// Get container count
router.get('/containers', authMiddleware, async (req, res) => {
  try {
    const containers = await azureService.getContainersCount();
    res.json(containers);
  } catch (error) {
    console.error('Error fetching containers:', error);
    res.status(500).json({ message: 'Failed to fetch containers', error: error.message });
  }
});

// Get network metrics
router.get('/network', authMiddleware, async (req, res) => {
  try {
    const network = await azureService.getNetworkMetrics();
    res.json(network);
  } catch (error) {
    console.error('Error fetching network metrics:', error);
    res.status(500).json({ message: 'Failed to fetch network metrics', error: error.message });
  }
});

// Get uptime metrics
router.get('/uptime', authMiddleware, async (req, res) => {
  try {
    const uptime = await azureService.getUptimeMetrics();
    res.json(uptime);
  } catch (error) {
    console.error('Error fetching uptime:', error);
    res.status(500).json({ message: 'Failed to fetch uptime', error: error.message });
  }
});

// Get error rate
router.get('/error-rate', authMiddleware, async (req, res) => {
  try {
    const errorRate = await azureService.getErrorRate();
    res.json(errorRate);
  } catch (error) {
    console.error('Error fetching error rate:', error);
    res.status(500).json({ message: 'Failed to fetch error rate', error: error.message });
  }
});

// Get all dashboard data in one request
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const [metrics, stats, servers, alerts] = await Promise.all([
      azureService.getAggregatedMetrics(),
      azureService.getDashboardStats(),
      azureService.getActiveServers(),
      azureService.getActiveAlerts()
    ]);

    res.json({
      metrics,
      stats,
      servers,
      alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

module.exports = router;
