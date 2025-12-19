const express = require('express');
const router = express.Router();
const azureService = require('../services/azureService');
const { protect } = require('../middleware/authMiddleware');

/**
 * Azure Metrics Routes
 * REST API endpoints for fetching Azure data
 * Authentication temporarily disabled to test Azure deployment
 */

// Get aggregated metrics (CPU, RAM, Disk, Network)
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await azureService.getAggregatedMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Failed to fetch metrics', error: error.message });
  }
});

// Debug Azure initialization/status
router.get('/debug/status', (req, res) => {
  try {
    const status = {
      subscriptionIdSet: !!process.env.AZURE_SUBSCRIPTION_ID,
      resourceGroupSet: !!process.env.AZURE_RESOURCE_GROUP,
      clientIdSet: !!process.env.AZURE_CLIENT_ID,
      clientSecretSet: !!process.env.AZURE_CLIENT_SECRET,
      tenantIdSet: !!process.env.AZURE_TENANT_ID,
      credentialInitialized: !!azureService.credential,
      credentialType: azureService.credentialType || 'unknown',
      initError: azureService.initError || null,
    };
    res.json(status);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Azure status', error: err.message });
  }
});

// Test acquiring an Azure AD token with Service Principal (does not return the token)
router.get('/debug/token', async (req, res) => {
  try {
    const { ClientSecretCredential } = require('@azure/identity');
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;

    if (!tenantId || !clientId || !clientSecret) {
      return res.status(400).json({
        success: false,
        error: 'Missing AZURE_TENANT_ID / AZURE_CLIENT_ID / AZURE_CLIENT_SECRET'
      });
    }

    const cred = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const token = await cred.getToken('https://management.azure.com/.default');
    res.json({
      success: true,
      tokenAcquired: !!token,
      expiresOn: token?.expiresOnTimestamp || null
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message, name: e.name, code: e.code || null });
  }
});

// Get dashboard stats (Active Servers, Containers, Uptime, Error Rate)
router.get('/stats', async (req, res) => {
  try {
    const stats = await azureService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

// Get active servers
router.get('/servers', async (req, res) => {
  try {
    const servers = await azureService.getActiveServers();
    res.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ message: 'Failed to fetch servers', error: error.message });
  }
});

// Get active alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await azureService.getActiveAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
});

// Get containers overview (clusters, nodes, pods) for UI
router.get('/containers', async (req, res) => {
  try {
    const overview = await azureService.getContainersOverview();
    res.json(overview);
  } catch (error) {
    console.error('Error fetching containers overview:', error);
    res.status(503).json({ message: 'No container data available from Azure', error: error.message });
  }
});

// Get network metrics
router.get('/network', async (req, res) => {
  try {
    const network = await azureService.getNetworkMetrics();
    res.json(network);
  } catch (error) {
    console.error('Error fetching network metrics:', error);
    res.status(500).json({ message: 'Failed to fetch network metrics', error: error.message });
  }
});

// Get uptime metrics
router.get('/uptime', async (req, res) => {
  try {
    const uptime = await azureService.getUptimeMetrics();
    res.json(uptime);
  } catch (error) {
    console.error('Error fetching uptime:', error);
    res.status(500).json({ message: 'Failed to fetch uptime', error: error.message });
  }
});

// Get error rate
router.get('/error-rate', async (req, res) => {
  try {
    const errorRate = await azureService.getErrorRate();
    res.json(errorRate);
  } catch (error) {
    console.error('Error fetching error rate:', error);
    res.status(500).json({ message: 'Failed to fetch error rate', error: error.message });
  }
});

// Get Azure Cost Management breakdown (INR) - unauthenticated for debug
router.get('/costs', async (req, res) => {
  try {
    const { startDate, endDate, service } = req.query;
    const data = await azureService.getCostBreakdown({ startDate, endDate, service });
    if (!data) {
      return res.status(503).json({ message: 'Azure cost data unavailable. Check credentials and permissions (Cost Management Reader).' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching Azure cost data:', error);
    res.status(500).json({ message: 'Failed to fetch Azure cost data', error: error.message });
  }
});

// Get all dashboard data in one request
router.get('/dashboard', async (req, res) => {
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
