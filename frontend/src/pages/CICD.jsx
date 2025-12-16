import { useEffect, useMemo, useState } from 'react';
import { RocketLaunchIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { dashboardAPI } from '../services/api';

const CICD = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deployments, setDeployments] = useState([]);

  const timeAgo = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 60) return `${mins} min ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
      const days = Math.floor(hrs / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } catch (e) {
      return '—';
    }
  };

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getDeployments({ limit: 50 });
        setDeployments(Array.isArray(data?.deployments) ? data.deployments : []);
        setError('');
      } catch (e) {
        console.error('Failed to fetch deployments:', e);
        setError(e.message || 'Failed to fetch deployments');
        setDeployments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeployments();
  }, []);

  const pipelines = useMemo(() => {
    try {
      const byName = new Map();
      deployments.forEach(d => {
        const key = d.name || d.pipelineId || 'unknown';
        const item = byName.get(key) || { name: key, total: 0, success: 0, lastRun: d.startedAt, status: 'healthy' };
        item.total += 1;
        if (d.status === 'success') item.success += 1;
        if (!item.lastRun || new Date(d.startedAt) > new Date(item.lastRun)) item.lastRun = d.startedAt;
        if (d.status === 'failed') item.status = 'failing';
        byName.set(key, item);
      });
      return Array.from(byName.values()).map(x => ({
        name: x.name,
        status: x.status,
        lastRun: x.lastRun ? timeAgo(x.lastRun) : '—',
        successRate: x.total ? Math.round((x.success / x.total) * 100) + '%' : '0%'
      }));
    } catch (e) {
      console.error('Error computing pipelines:', e);
      return [];
    }
  }, [deployments]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return 'text-green-400 bg-green-500/20';
      case 'running':
        return 'text-blue-400 bg-blue-500/20';
      case 'failed':
      case 'failing':
        return 'text-red-400 bg-red-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return CheckCircleIcon;
      case 'running':
        return ClockIcon;
      case 'failed':
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">CI/CD Pipeline Monitor</h1>
        <p className="text-gray-400">Track deployments, builds, and pipeline status</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Successful Deployments</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{deployments.filter((d) => d.status === 'success').length}</p>
        </div>
        <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{deployments.filter((d) => d.status === 'running').length}</p>
        </div>
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Failed</p>
          <p className="text-3xl font-bold text-red-400 mt-1">{deployments.filter((d) => d.status === 'failed').length}</p>
        </div>
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Pipelines</p>
          <p className="text-3xl font-bold text-cyan-400 mt-1">{pipelines.length}</p>
        </div>
      </div>

      {/* Pipelines Health */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Pipeline Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="text-gray-400">Loading pipeline health...</div>
          ) : pipelines.length === 0 ? (
            <div className="text-gray-400">No pipeline data available.</div>
          ) : pipelines.map((pipeline) => (
            <div
              key={pipeline.name}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{pipeline.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                  {pipeline.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last Run: {pipeline.lastRun}</span>
                <span className="text-green-400 font-semibold">Success Rate: {pipeline.successRate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deployments */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RocketLaunchIcon className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Recent Deployments</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-800">
          {loading ? (
            <div className="p-6 text-gray-400">Loading deployments...</div>
          ) : deployments.length === 0 ? (
            <div className="p-6 text-gray-400">No deployments found.</div>
          ) : deployments.map((deployment) => {
            const StatusIcon = getStatusIcon(deployment.status);
            return (
              <div key={deployment.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${getStatusColor(deployment.status)}`}>
                      <StatusIcon className={`w-6 h-6 ${deployment.status === 'running' ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-semibold">{deployment.name}</h4>
                        {deployment.version && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono">
                            {deployment.version}
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                          {deployment.status}
                        </span>
                      </div>
                      {deployment.commitHash && (
                        <p className="text-gray-400 text-sm mb-2">Commit: {deployment.commitHash}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        {deployment.environment && <span>{deployment.environment}</span>}
                        <span>•</span>
                        <span>{deployment.duration ? Math.round(deployment.duration / 60) + 'm' : '—'}</span>
                        <span>•</span>
                        <span>{deployment.startedAt ? new Date(deployment.startedAt).toLocaleString() : '—'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm whitespace-nowrap ml-4">{deployment.completedAt ? new Date(deployment.completedAt).toLocaleString() : ''}</span>
                </div>
                <div className="flex items-center gap-3 pl-16">
                  <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all text-sm font-medium">
                    View Logs
                  </button>
                  {deployment.status === 'success' && deployment.environment === 'production' && (
                    <button className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all text-sm font-medium">
                      Rollback
                    </button>
                  )}
                  {deployment.status === 'failed' && (
                    <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm font-medium">
                      Retry
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CICD;
