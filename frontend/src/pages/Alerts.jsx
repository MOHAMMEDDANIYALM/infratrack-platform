import { useState } from 'react';
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const Alerts = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const alerts = [
    {
      id: 1,
      title: 'High CPU Usage Alert',
      description: 'Server EU-WEST-2-APP-01 CPU usage exceeded 95% threshold',
      priority: 'critical',
      status: 'active',
      timestamp: '2025-12-08 14:32:45',
      service: 'Compute',
      affected: 'EU-WEST-2-APP-01',
    },
    {
      id: 2,
      title: 'Server Down',
      description: 'Server EU-CENTRAL-API-02 is not responding',
      priority: 'critical',
      status: 'active',
      timestamp: '2025-12-08 14:25:12',
      service: 'Compute',
      affected: 'EU-CENTRAL-API-02',
    },
    {
      id: 3,
      title: 'Budget Exceeded',
      description: 'Monthly cloud cost exceeded 90% of budget limit',
      priority: 'high',
      status: 'active',
      timestamp: '2025-12-08 13:45:30',
      service: 'Billing',
      affected: 'All Services',
    },
    {
      id: 4,
      title: 'Unauthorized Access Attempt',
      description: 'Multiple failed login attempts detected from IP 192.168.1.100',
      priority: 'high',
      status: 'acknowledged',
      timestamp: '2025-12-08 12:18:22',
      service: 'Security',
      affected: 'Auth Service',
    },
    {
      id: 5,
      title: 'High Memory Usage',
      description: 'Database server RAM usage at 85%',
      priority: 'medium',
      status: 'resolved',
      timestamp: '2025-12-08 11:30:15',
      service: 'Database',
      affected: 'US-EAST-1-DB-03',
    },
    {
      id: 6,
      title: 'Pod Restart Loop',
      description: 'Kubernetes pod cache-redis restarted 15 times',
      priority: 'medium',
      status: 'active',
      timestamp: '2025-12-08 10:45:08',
      service: 'Kubernetes',
      affected: 'cache-redis pod',
    },
    {
      id: 7,
      title: 'SSL Certificate Expiring',
      description: 'SSL certificate for api.enterprise.sa expiring in 7 days',
      priority: 'low',
      status: 'active',
      timestamp: '2025-12-08 09:00:00',
      service: 'Security',
      affected: 'api.enterprise.sa',
    },
    {
      id: 8,
      title: 'Disk Space Warning',
      description: 'Server storage usage at 78%',
      priority: 'low',
      status: 'acknowledged',
      timestamp: '2025-12-08 08:15:42',
      service: 'Storage',
      affected: 'ASIA-SOUTH-WEB-05',
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-red-500/20 text-red-400';
      case 'acknowledged':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return ExclamationTriangleIcon;
      case 'acknowledged':
        return BellIcon;
      case 'resolved':
        return CheckCircleIcon;
      default:
        return XCircleIcon;
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const stats = {
    active: alerts.filter((a) => a.status === 'active').length,
    acknowledged: alerts.filter((a) => a.status === 'acknowledged').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
    critical: alerts.filter((a) => a.priority === 'critical' && a.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Alerts & Notifications</h1>
        <p className="text-gray-400">Monitor and manage system alerts in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Alerts</p>
          <p className="text-3xl font-bold text-red-400 mt-1">{stats.active}</p>
        </div>
        <div className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Acknowledged</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.acknowledged}</p>
        </div>
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{stats.resolved}</p>
        </div>
        <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-4">
          <p className="text-gray-300 text-sm">Critical Active</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.critical}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const StatusIcon = getStatusIcon(alert.status);
          return (
            <div
              key={alert.id}
              className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getPriorityColor(alert.priority).split(' ')[0]}`}>
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{alert.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{alert.description}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-xs">{alert.service}</span>
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-gray-500 text-xs">{alert.affected}</span>
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm whitespace-nowrap">{alert.timestamp}</span>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                {alert.status === 'active' && (
                  <>
                    <button className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all text-sm font-medium">
                      Acknowledge
                    </button>
                    <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all text-sm font-medium">
                      Resolve
                    </button>
                  </>
                )}
                {alert.status === 'acknowledged' && (
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all text-sm font-medium">
                    Resolve
                  </button>
                )}
                <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;
