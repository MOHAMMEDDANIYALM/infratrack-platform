import { useState } from 'react';
import { CpuChipIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Kubernetes = () => {
  const [selectedCluster, setSelectedCluster] = useState('prod-cluster-1');

  const clusters = [
    { name: 'prod-cluster-1', nodes: 12, pods: 248, status: 'healthy' },
    { name: 'staging-cluster-1', nodes: 6, pods: 89, status: 'healthy' },
    { name: 'dev-cluster-1', nodes: 4, pods: 45, status: 'warning' },
  ];

  const nodes = [
    { name: 'node-1', status: 'Ready', cpu: 45, memory: 62, pods: 28 },
    { name: 'node-2', status: 'Ready', cpu: 67, memory: 54, pods: 32 },
    { name: 'node-3', status: 'Ready', cpu: 34, memory: 48, pods: 24 },
    { name: 'node-4', status: 'NotReady', cpu: 0, memory: 0, pods: 0 },
  ];

  const pods = [
    {
      name: 'frontend-deployment-7d9f8b6c5d-x8k2m',
      namespace: 'production',
      status: 'Running',
      restarts: 0,
      age: '12d',
      node: 'node-1',
    },
    {
      name: 'api-service-6c8f9d7b5a-p4h9n',
      namespace: 'production',
      status: 'Running',
      restarts: 2,
      age: '45d',
      node: 'node-2',
    },
    {
      name: 'database-statefulset-0',
      namespace: 'production',
      status: 'Running',
      restarts: 0,
      age: '89d',
      node: 'node-3',
    },
    {
      name: 'cache-redis-5f7d8c6b4a-m2n5k',
      namespace: 'production',
      status: 'CrashLoopBackOff',
      restarts: 15,
      age: '2h',
      node: 'node-2',
    },
  ];

  const getStatusColor = (status) => {
    if (status === 'healthy' || status === 'Ready' || status === 'Running') return 'text-green-400 bg-green-500/20';
    if (status === 'warning') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getStatusIcon = (status) => {
    if (status === 'healthy' || status === 'Ready' || status === 'Running') return CheckCircleIcon;
    return ExclamationTriangleIcon;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Kubernetes Management</h1>
        <p className="text-gray-400">Monitor and manage your Kubernetes clusters, nodes, and pods</p>
      </div>

      {/* Cluster Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-400">Select Cluster:</span>
        <select
          value={selectedCluster}
          onChange={(e) => setSelectedCluster(e.target.value)}
          className="bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
        >
          {clusters.map((cluster) => (
            <option key={cluster.name} value={cluster.name}>
              {cluster.name} ({cluster.nodes} nodes, {cluster.pods} pods)
            </option>
          ))}
        </select>
      </div>

      {/* Cluster Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Nodes</p>
          <p className="text-3xl font-bold text-white mt-1">12</p>
        </div>
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Ready Nodes</p>
          <p className="text-3xl font-bold text-green-400 mt-1">11</p>
        </div>
        <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Pods</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">248</p>
        </div>
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Failed Pods</p>
          <p className="text-3xl font-bold text-red-400 mt-1">3</p>
        </div>
      </div>

      {/* Nodes */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <CpuChipIcon className="w-6 h-6 mr-2 text-cyan-400" />
          Nodes Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.map((node) => {
            const StatusIcon = getStatusIcon(node.status);
            return (
              <div
                key={node.name}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(node.status).split(' ')[0]}`} />
                    <span className="text-white font-medium">{node.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                    {node.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">CPU</span>
                    <p className="text-white font-semibold">{node.cpu}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Memory</span>
                    <p className="text-white font-semibold">{node.memory}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Pods</span>
                    <p className="text-white font-semibold">{node.pods}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pods */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Pods Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Namespace</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Restarts</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Age</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Node</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {pods.map((pod) => (
                <tr key={pod.name} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-white text-sm">{pod.name}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{pod.namespace}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pod.status)}`}>
                      {pod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${pod.restarts > 5 ? 'text-red-400' : 'text-green-400'}`}>
                      {pod.restarts}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{pod.age}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{pod.node}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Kubernetes;
