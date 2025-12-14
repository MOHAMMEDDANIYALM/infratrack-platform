import { RocketLaunchIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const CICD = () => {
  const deployments = [
    {
      id: 1,
      repo: 'infratrack-frontend',
      branch: 'main',
      commit: 'feat: Add new dashboard widgets',
      commitHash: 'a3f5d2b',
      author: 'Mohammed Daniyal',
      status: 'success',
      environment: 'production',
      timestamp: '2025-12-08 14:30:00',
      duration: '4m 32s',
      pipeline: 'Build → Test → Deploy',
    },
    {
      id: 2,
      repo: 'infratrack-backend',
      branch: 'develop',
      commit: 'fix: Database connection pool optimization',
      commitHash: '8b2c9e4',
      author: 'Ahmed Ali',
      status: 'running',
      environment: 'staging',
      timestamp: '2025-12-08 14:28:15',
      duration: '2m 18s',
      pipeline: 'Build → Test',
    },
    {
      id: 3,
      repo: 'infratrack-api',
      branch: 'feature/auth',
      commit: 'feat: Implement OAuth2 authentication',
      commitHash: 'c7d1a8f',
      author: 'Fatima Khan',
      status: 'failed',
      environment: 'staging',
      timestamp: '2025-12-08 13:45:22',
      duration: '1m 45s',
      pipeline: 'Build',
    },
    {
      id: 4,
      repo: 'infratrack-frontend',
      branch: 'main',
      commit: 'docs: Update API documentation',
      commitHash: 'f2b8c3d',
      author: 'Sarah Ahmed',
      status: 'success',
      environment: 'production',
      timestamp: '2025-12-08 12:15:00',
      duration: '3m 54s',
      pipeline: 'Build → Test → Deploy',
    },
  ];

  const pipelines = [
    { name: 'infratrack-frontend', status: 'healthy', lastRun: '10 min ago', successRate: '98%' },
    { name: 'infratrack-backend', status: 'healthy', lastRun: '15 min ago', successRate: '95%' },
    { name: 'infratrack-api', status: 'failing', lastRun: '30 min ago', successRate: '76%' },
    { name: 'infratrack-mobile', status: 'healthy', lastRun: '1 hour ago', successRate: '92%' },
  ];

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Successful Deployments</p>
          <p className="text-3xl font-bold text-green-400 mt-1">
            {deployments.filter((d) => d.status === 'success').length}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">
            {deployments.filter((d) => d.status === 'running').length}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Failed</p>
          <p className="text-3xl font-bold text-red-400 mt-1">
            {deployments.filter((d) => d.status === 'failed').length}
          </p>
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
          {pipelines.map((pipeline) => (
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
          {deployments.map((deployment) => {
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
                        <h4 className="text-white font-semibold">{deployment.repo}</h4>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono">
                          {deployment.branch}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                          {deployment.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{deployment.commit}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span>#{deployment.commitHash}</span>
                        <span>•</span>
                        <span>{deployment.author}</span>
                        <span>•</span>
                        <span>{deployment.environment}</span>
                        <span>•</span>
                        <span>{deployment.duration}</span>
                        <span>•</span>
                        <span>{deployment.pipeline}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm whitespace-nowrap ml-4">{deployment.timestamp}</span>
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
