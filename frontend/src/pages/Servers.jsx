import { useState } from 'react';
import { ServerIcon, PlayIcon, StopIcon, ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Servers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const servers = [
    {
      id: 1,
      name: 'EU-WEST-2-APP-01',
      ip: '10.0.1.45',
      status: 'running',
      cpu: 67,
      ram: 54,
      disk: 45,
      uptime: '45d 12h',
      location: 'EU West (London)',
      type: 'Application Server',
    },
    {
      id: 2,
      name: 'US-EAST-1-DB-03',
      ip: '10.0.2.78',
      status: 'running',
      cpu: 89,
      ram: 78,
      disk: 82,
      uptime: '120d 5h',
      location: 'US East (Virginia)',
      type: 'Database Server',
    },
    {
      id: 3,
      name: 'ASIA-SOUTH-WEB-05',
      ip: '10.0.3.22',
      status: 'running',
      cpu: 34,
      ram: 42,
      disk: 38,
      uptime: '89d 18h',
      location: 'Asia South (Mumbai)',
      type: 'Web Server',
    },
    {
      id: 4,
      name: 'EU-CENTRAL-API-02',
      ip: '10.0.4.91',
      status: 'stopped',
      cpu: 0,
      ram: 0,
      disk: 65,
      uptime: '0d 0h',
      location: 'EU Central (Frankfurt)',
      type: 'API Server',
    },
    {
      id: 5,
      name: 'US-WEST-CACHE-01',
      ip: '10.0.5.12',
      status: 'running',
      cpu: 23,
      ram: 56,
      disk: 28,
      uptime: '234d 8h',
      location: 'US West (Oregon)',
      type: 'Cache Server',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMetricColor = (value) => {
    if (value >= 80) return 'text-red-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredServers = servers.filter((server) => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || server.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Server Management</h1>
        <p className="text-gray-400">Monitor and manage your virtual machines and cloud servers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Servers</p>
          <p className="text-3xl font-bold text-white mt-1">{servers.length}</p>
        </div>
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Running</p>
          <p className="text-3xl font-bold text-green-400 mt-1">
            {servers.filter((s) => s.status === 'running').length}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Stopped</p>
          <p className="text-3xl font-bold text-red-400 mt-1">
            {servers.filter((s) => s.status === 'stopped').length}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Warning</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">
            {servers.filter((s) => s.cpu > 80 || s.ram > 80).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search servers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 text-white placeholder-gray-500 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
        </select>
      </div>

      {/* Servers Table */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Server</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Resources</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Uptime</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredServers.map((server) => (
                <tr key={server.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <ServerIcon className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-medium">{server.name}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{server.ip}</p>
                      <p className="text-gray-500 text-xs">{server.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)} animate-pulse`}></div>
                      <span className="text-white capitalize">{server.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-400">CPU: </span>
                        <span className={getMetricColor(server.cpu)}>{server.cpu}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">RAM: </span>
                        <span className={getMetricColor(server.ram)}>{server.ram}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Disk: </span>
                        <span className={getMetricColor(server.disk)}>{server.disk}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm">{server.location}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm">{server.uptime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {server.status === 'running' ? (
                        <>
                          <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                            <StopIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all">
                            <ArrowPathIcon className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all">
                          <PlayIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Servers;
