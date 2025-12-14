const azureService = require('./azureService');

/**
 * Real-Time Metrics Controller using WebSockets
 * Pushes live Azure metrics to connected clients every 5 seconds
 */
class RealTimeMetricsController {
  constructor(io) {
    this.io = io;
    this.updateInterval = 5000; // 5 seconds
    this.activeConnections = new Set();
    this.metricsInterval = null;
  }

  /**
   * Initialize WebSocket handlers
   */
  initialize() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.activeConnections.add(socket.id);

      // Send initial data immediately
      this.sendMetricsToClient(socket);

      // Handle client requests for specific data
      socket.on('request:servers', async () => {
        try {
          const servers = await azureService.getActiveServers();
          socket.emit('servers:update', servers);
        } catch (error) {
          console.error('Error sending servers:', error);
          socket.emit('error', { message: 'Failed to fetch servers' });
        }
      });

      socket.on('request:alerts', async () => {
        try {
          const alerts = await azureService.getActiveAlerts();
          socket.emit('alerts:update', alerts);
        } catch (error) {
          console.error('Error sending alerts:', error);
          socket.emit('error', { message: 'Failed to fetch alerts' });
        }
      });

      socket.on('request:metrics', async () => {
        try {
          const metrics = await azureService.getAggregatedMetrics();
          socket.emit('metrics:update', metrics);
        } catch (error) {
          console.error('Error sending metrics:', error);
          socket.emit('error', { message: 'Failed to fetch metrics' });
        }
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.activeConnections.delete(socket.id);

        // Stop broadcasting if no clients connected
        if (this.activeConnections.size === 0) {
          this.stopBroadcasting();
        }
      });

      // Start broadcasting when first client connects
      if (this.activeConnections.size === 1 && !this.metricsInterval) {
        this.startBroadcasting();
      }
    });
  }

  /**
   * Start broadcasting metrics to all connected clients
   */
  startBroadcasting() {
    console.log('Starting real-time metrics broadcasting...');
    
    this.metricsInterval = setInterval(async () => {
      if (this.activeConnections.size > 0) {
        await this.broadcastMetrics();
      }
    }, this.updateInterval);
  }

  /**
   * Stop broadcasting metrics
   */
  stopBroadcasting() {
    if (this.metricsInterval) {
      console.log('Stopping real-time metrics broadcasting...');
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
  }

  /**
   * Broadcast all metrics to connected clients
   */
  async broadcastMetrics() {
    try {
      // Fetch all data in parallel for efficiency
      const [metrics, stats, servers, alerts] = await Promise.all([
        azureService.getAggregatedMetrics(),
        azureService.getDashboardStats(),
        azureService.getActiveServers(),
        azureService.getActiveAlerts()
      ]);

      // Broadcast to all connected clients
      this.io.emit('dashboard:update', {
        metrics,
        stats,
        servers,
        alerts,
        timestamp: new Date().toISOString()
      });

      console.log(`Broadcasted metrics to ${this.activeConnections.size} clients`);
    } catch (error) {
      console.error('Error broadcasting metrics:', error);
      this.io.emit('error', { message: 'Failed to update dashboard metrics' });
    }
  }

  /**
   * Send metrics to a specific client
   */
  async sendMetricsToClient(socket) {
    try {
      const [metrics, stats, servers, alerts] = await Promise.all([
        azureService.getAggregatedMetrics(),
        azureService.getDashboardStats(),
        azureService.getActiveServers(),
        azureService.getActiveAlerts()
      ]);

      socket.emit('dashboard:update', {
        metrics,
        stats,
        servers,
        alerts,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending metrics to client:', error);
      socket.emit('error', { message: 'Failed to fetch dashboard data' });
    }
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      activeConnections: this.activeConnections.size,
      broadcasting: !!this.metricsInterval,
      updateInterval: this.updateInterval
    };
  }
}

module.exports = RealTimeMetricsController;
