import { useState } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, LightBulbIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const AIops = () => {
  const [selectedTab, setSelectedTab] = useState('predictions');

  const predictions = [
    {
      id: 1,
      title: 'Server EU-WEST-2-APP-01 Failure Prediction',
      probability: 78,
      timeframe: 'Next 24 hours',
      reason: 'Increasing CPU temperature and disk errors detected',
      severity: 'high',
      recommendation: 'Schedule immediate maintenance or failover',
    },
    {
      id: 2,
      title: 'Database Performance Degradation',
      probability: 65,
      timeframe: 'Next 48 hours',
      reason: 'Query response time trending upward, connection pool near capacity',
      severity: 'medium',
      recommendation: 'Optimize queries and increase connection pool size',
    },
    {
      id: 3,
      title: 'Storage Capacity Exhaustion',
      probability: 92,
      timeframe: 'Next 7 days',
      reason: 'Linear growth pattern indicates disk will reach 95% in 7 days',
      severity: 'high',
      recommendation: 'Add storage capacity or implement data archiving',
    },
  ];

  const anomalies = [
    {
      id: 1,
      metric: 'Network Traffic',
      detected: '2025-12-08 14:15:00',
      deviation: '+245%',
      baseline: '1.2 GB/s',
      actual: '4.1 GB/s',
      confidence: 94,
    },
    {
      id: 2,
      metric: 'API Response Time',
      detected: '2025-12-08 13:30:00',
      deviation: '+180%',
      baseline: '125ms',
      actual: '350ms',
      confidence: 88,
    },
    {
      id: 3,
      metric: 'Memory Usage Pattern',
      detected: '2025-12-08 12:45:00',
      deviation: '+65%',
      baseline: '4.2 GB',
      actual: '6.9 GB',
      confidence: 76,
    },
  ];

  const scalingRecommendations = [
    {
      id: 1,
      resource: 'Kubernetes Node Pool',
      action: 'Scale Up',
      from: '8 nodes',
      to: '12 nodes',
      reason: 'Pod scheduling failures increasing, average CPU at 85%',
      estimatedCost: '+$432/month',
      confidence: 89,
    },
    {
      id: 2,
      resource: 'Database Read Replicas',
      action: 'Add Replica',
      from: '2 replicas',
      to: '3 replicas',
      reason: 'Read query latency exceeding SLA, load imbalance detected',
      estimatedCost: '+$890/month',
      confidence: 82,
    },
    {
      id: 3,
      resource: 'Cache Memory',
      action: 'Increase Size',
      from: '8 GB',
      to: '16 GB',
      reason: 'Cache eviction rate 40%, hit ratio dropped to 65%',
      estimatedCost: '+$145/month',
      confidence: 91,
    },
  ];

  const costOptimization = [
    {
      id: 1,
      title: 'Idle Resource Cleanup',
      savings: '$1,234/month',
      impact: 'No impact',
      resources: '15 unused volumes, 8 unattached IPs, 23 old snapshots',
      confidence: 100,
    },
    {
      id: 2,
      title: 'Auto-scaling Optimization',
      savings: '$876/month',
      impact: 'Performance improved',
      resources: 'Adjust scaling policies based on ML-predicted traffic patterns',
      confidence: 87,
    },
    {
      id: 3,
      title: 'Storage Tier Migration',
      savings: '$543/month',
      impact: 'Minimal',
      resources: 'Move 2.4 TB of cold data to cheaper storage tier',
      confidence: 95,
    },
  ];

  const getProbabilityColor = (prob) => {
    if (prob >= 75) return 'text-red-400 border-red-500/30 bg-red-500/20';
    if (prob >= 50) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
    return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <SparklesIcon className="w-8 h-8 mr-3 text-cyan-400" />
          AI Ops Intelligence
        </h1>
        <p className="text-gray-400">AI-powered predictions, anomaly detection, and optimization recommendations</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-900/50 border border-cyan-500/20 rounded-xl p-2">
        {[
          { id: 'predictions', label: 'Failure Predictions' },
          { id: 'anomalies', label: 'Anomaly Detection' },
          { id: 'scaling', label: 'Smart Scaling' },
          { id: 'cost', label: 'Cost Optimization' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTab === tab.id
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Failure Predictions */}
      {selectedTab === 'predictions' && (
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{prediction.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{prediction.reason}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(prediction.severity)}`}>
                      {prediction.severity.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-sm">{prediction.timeframe}</span>
                  </div>
                </div>
                <div className="ml-6">
                  <div className={`w-24 h-24 rounded-full border-4 ${getProbabilityColor(prediction.probability)} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{prediction.probability}%</div>
                      <div className="text-xs">Risk</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 flex items-start space-x-3">
                <LightBulbIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-cyan-300 font-medium text-sm mb-1">AI Recommendation</p>
                  <p className="text-gray-300 text-sm">{prediction.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Anomaly Detection */}
      {selectedTab === 'anomalies' && (
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white">Detected Anomalies</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Detected</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Baseline</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actual</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Deviation</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {anomalies.map((anomaly) => (
                  <tr key={anomaly.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{anomaly.metric}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{anomaly.detected}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{anomaly.baseline}</td>
                    <td className="px-6 py-4 text-white font-semibold">{anomaly.actual}</td>
                    <td className="px-6 py-4">
                      <span className="text-red-400 font-bold">{anomaly.deviation}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-400">{anomaly.confidence}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Smart Scaling */}
      {selectedTab === 'scaling' && (
        <div className="space-y-4">
          {scalingRecommendations.map((rec) => (
            <div key={rec.id} className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-semibold text-lg">{rec.resource}</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                      {rec.action}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{rec.reason}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">From: <span className="text-white">{rec.from}</span></span>
                    <span className="text-cyan-400">→</span>
                    <span className="text-gray-500">To: <span className="text-white">{rec.to}</span></span>
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-yellow-400 font-bold text-lg">{rec.estimatedCost}</p>
                  <p className="text-gray-400 text-xs mt-1">Confidence: {rec.confidence}%</p>
                </div>
              </div>
              <button className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all font-medium">
                Apply Recommendation
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cost Optimization */}
      {selectedTab === 'cost' && (
        <div className="space-y-4">
          {costOptimization.map((opt) => (
            <div key={opt.id} className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{opt.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{opt.resources}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">Impact: <span className="text-green-400">{opt.impact}</span></span>
                    <span className="text-gray-500">Confidence: <span className="text-cyan-400">{opt.confidence}%</span></span>
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-green-400 font-bold text-2xl">{opt.savings}</p>
                  <p className="text-gray-400 text-xs mt-1">Potential Savings</p>
                </div>
              </div>
              <button className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all font-medium">
                Implement Optimization
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIops;
