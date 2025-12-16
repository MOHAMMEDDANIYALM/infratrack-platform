import { useState, useEffect } from 'react';
import { DocumentTextIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { dashboardAPI } from '../services/api';

const Logs = () => {
  const [logType, setLogType] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getLogs({
          type: logType === 'all' ? null : logType,
          severity: severity === 'all' ? null : severity,
          search: searchTerm || null,
          limit: 100,
        });
        setLogs(Array.isArray(data?.logs) ? data.logs : []);
      } catch (e) {
        console.error('Failed to fetch logs:', e);
        setError('Failed to load logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [logType, severity, searchTerm]);

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
          <span className="text-gray-400 text-sm">{logs.length} logs found</span>
        </div>
        <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-gray-400">
              Loading logs...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border-t border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && logs.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No logs available
            </div>
          )}

          {!loading && logs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                    {(log.severity || 'info').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                    {log.type || 'application'}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">{log.timestamp || new Date(log.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-white font-medium mb-2">{log.message}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>
                  <span className="text-gray-500">Source:</span> {log.source || 'system'}
                </span>
                <span>
                  <span className="text-gray-500">User:</span> {log.user || 'system'}
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
