import { useState, useEffect } from 'react';
import {
  CpuChipIcon,
  CircleStackIcon,
  ServerIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    cpu: 67,
    ram: 54,
    disk: 78,
    network: 1234,
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 30) + 50,
        ram: Math.floor(Math.random() * 40) + 40,
        disk: Math.floor(Math.random() * 30) + 60,
        network: Math.floor(Math.random() * 2000) + 800,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const stats = [
    { name: 'Active Servers', value: '248', change: '+12', icon: ServerIcon, color: 'cyan' },
    { name: 'Containers', value: '1,429', change: '+54', icon: CircleStackIcon, color: 'blue' },
    { name: 'Uptime', value: '99.97%', change: '+0.02', icon: CheckCircleIcon, color: 'green' },
    { name: 'Error Rate', value: '0.03%', change: '-0.01', icon: ExclamationTriangleIcon, color: 'red' },
  ];

  const recentAlerts = [
    { id: 1, type: 'critical', server: 'EU-WEST-2-APP-01', message: 'CPU usage exceeded 95%', time: '2 min ago' },
    { id: 2, type: 'warning', server: 'US-EAST-1-DB-03', message: 'High memory consumption', time: '15 min ago' },
    { id: 3, type: 'info', server: 'ASIA-SOUTH-WEB-05', message: 'Scheduled maintenance upcoming', time: '1 hour ago' },
  ];

  const activeServers = [
    { name: 'EU-WEST-2-APP-01', status: 'healthy', cpu: 67, ram: 54, uptime: '45d 12h' },
    { name: 'US-EAST-1-DB-03', status: 'warning', cpu: 89, ram: 78, uptime: '120d 5h' },
    { name: 'ASIA-SOUTH-WEB-05', status: 'healthy', cpu: 34, ram: 42, uptime: '89d 18h' },
    { name: 'EU-CENTRAL-API-02', status: 'healthy', cpu: 45, ram: 61, uptime: '67d 9h' },
  ];

  const getMetricColor = (value) => {
    if (value >= 80) return 'text-red-400 border-red-500/30 bg-red-500/10';
    if (value >= 60) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-green-400 border-green-500/30 bg-green-500/10';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Real-Time Dashboard</h1>
          <p className="text-gray-400">Monitor your entire infrastructure in real-time</p>
        </div>
        <button
          onClick={handleRefresh}
          className={`flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all ${
            refreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={refreshing}
        >
          <ClockIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Auto Refresh: ON'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.name}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <CpuChipIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">CPU Usage</h3>
                <p className="text-gray-400 text-xs">Real-time monitoring</p>
              </div>
            </div>
            <span className={`text-2xl font-bold px-4 py-2 rounded-lg border ${getMetricColor(metrics.cpu)}`}>
              {metrics.cpu}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000 rounded-full shadow-lg shadow-cyan-500/50"
              style={{ width: `${metrics.cpu}%` }}
            ></div>
          </div>
        </div>

        {/* RAM */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CircleStackIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">RAM Usage</h3>
                <p className="text-gray-400 text-xs">Memory consumption</p>
              </div>
            </div>
            <span className={`text-2xl font-bold px-4 py-2 rounded-lg border ${getMetricColor(metrics.ram)}`}>
              {metrics.ram}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 rounded-full shadow-lg shadow-blue-500/50"
              style={{ width: `${metrics.ram}%` }}
            ></div>
          </div>
        </div>

        {/* Disk */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Disk Usage</h3>
                <p className="text-gray-400 text-xs">Storage capacity</p>
              </div>
            </div>
            <span className={`text-2xl font-bold px-4 py-2 rounded-lg border ${getMetricColor(metrics.disk)}`}>
              {metrics.disk}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-1000 rounded-full shadow-lg shadow-purple-500/50"
              style={{ width: `${metrics.disk}%` }}
            ></div>
          </div>
        </div>

        {/* Network */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <SignalIcon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Network Traffic</h3>
                <p className="text-gray-400 text-xs">Current throughput</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-400 px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10">
              {metrics.network} MB/s
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>↓ {Math.floor(metrics.network * 0.6)} MB/s</span>
            <span>↑ {Math.floor(metrics.network * 0.4)} MB/s</span>
          </div>
        </div>
      </div>

      {/* Active Servers & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Servers */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <ServerIcon className="w-6 h-6 mr-2 text-cyan-400" />
            Active Servers
          </h3>
          <div className="space-y-3">
            {activeServers.map((server) => (
              <div
                key={server.name}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)} animate-pulse`}></div>
                    <span className="text-white font-medium">{server.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{server.uptime}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">CPU:</span>{' '}
                    <span className={server.cpu > 80 ? 'text-red-400' : 'text-green-400'}>{server.cpu}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">RAM:</span>{' '}
                    <span className={server.ram > 70 ? 'text-yellow-400' : 'text-green-400'}>{server.ram}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 mr-2 text-yellow-400" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 ${getAlertColor(alert.type)} p-4 rounded-r-lg hover:bg-gray-800/50 transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-white font-medium text-sm">{alert.server}</span>
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
                <p className="text-gray-300 text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-all text-sm font-medium">
            View All Alerts
          </button>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">All Systems Operational</span>
          </div>
          <span className="text-gray-400 text-sm">Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
