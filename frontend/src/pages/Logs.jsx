import { useState } from 'react';
import { DocumentTextIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Logs = () => {
  const [logType, setLogType] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const logs = [
    {
      id: 1,
      timestamp: '2025-12-08 14:32:45',
      type: 'application',
      severity: 'error',
      source: 'api-service',
      message: 'Database connection timeout after 30 seconds',
      user: 'system',
    },
    {
      id: 2,
      timestamp: '2025-12-08 14:30:12',
      type: 'security',
      severity: 'warning',
      source: 'auth-service',
      message: 'Multiple failed login attempts from IP 192.168.1.100',
      user: 'admin@enterprise.sa',
    },
    {
      id: 3,
      timestamp: '2025-12-08 14:28:33',
      type: 'audit',
      severity: 'info',
      source: 'user-management',
      message: 'User role updated from Viewer to DevOps',
      user: 'superadmin@enterprise.sa',
    },
    {
      id: 4,
      timestamp: '2025-12-08 14:25:18',
      type: 'application',
      severity: 'critical',
      source: 'payment-service',
      message: 'Payment gateway connection failed - service unavailable',
      user: 'system',
    },
    {
      id: 5,
      timestamp: '2025-12-08 14:22:50',
      type: 'security',
      severity: 'critical',
      source: 'firewall',
      message: 'Potential DDoS attack detected from multiple IPs',
      user: 'system',
    },
    {
      id: 6,
      timestamp: '2025-12-08 14:20:05',
      type: 'audit',
      severity: 'info',
      source: 'server-management',
      message: 'Server EU-WEST-2-APP-01 restarted successfully',
      user: 'devops@enterprise.sa',
    },
    {
      id: 7,
      timestamp: '2025-12-08 14:15:42',
      type: 'application',
      severity: 'warning',
      source: 'cache-service',
      message: 'Cache memory usage exceeded 80%',
      user: 'system',
    },
    {
      id: 8,
      timestamp: '2025-12-08 14:10:28',
      type: 'security',
      severity: 'info',
      source: 'auth-service',
      message: 'Successful login from admin@enterprise.sa',
      user: 'admin@enterprise.sa',
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'error':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'application':
        return 'bg-cyan-500/20 text-cyan-400';
      case 'security':
        return 'bg-red-500/20 text-red-400';
      case 'audit':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesType = logType === 'all' || log.type === logType;
    const matchesSeverity = severity === 'all' || log.severity === severity;
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Logs & Audit System</h1>
        <p className="text-gray-400">Monitor application, security, and audit logs in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Logs</p>
          <p className="text-3xl font-bold text-white mt-1">{logs.length}</p>
        </div>
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Critical</p>
          <p className="text-3xl font-bold text-red-400 mt-1">
            {logs.filter((l) => l.severity === 'critical').length}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Warnings</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">
            {logs.filter((l) => l.severity === 'warning').length}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Info</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">
            {logs.filter((l) => l.severity === 'info').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Log Type</label>
            <select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="application">Application</option>
              <option value="security">Security</option>
              <option value="audit">Audit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Recent Logs</h3>
          </div>
          <span className="text-gray-400 text-sm">{filteredLogs.length} logs found</span>
        </div>
        <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                    {log.severity.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                    {log.type}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">{log.timestamp}</span>
              </div>
              <p className="text-white font-medium mb-2">{log.message}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>
                  <span className="text-gray-500">Source:</span> {log.source}
                </span>
                <span>
                  <span className="text-gray-500">User:</span> {log.user}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logs;
