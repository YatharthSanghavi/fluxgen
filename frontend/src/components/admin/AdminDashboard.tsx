import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, Users, Zap, RefreshCw, TrendingUp, AlertTriangle, Server, Clock, Image, Settings } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { HealthStatus, Analytics } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const { getHealthStatus, getAnalytics } = useApi();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHealth = async () => {
    try {
      setLoadingHealth(true);
      setError(null);
      const healthData = await getHealthStatus();
      setHealth(healthData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Health fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch health status');
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      setError(null);
      const analyticsData = await getAnalytics();
      console.log('Analytics data received:', analyticsData);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch both on mount for initial load
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchHealth(), fetchAnalytics()]);
      setLoading(false);
    };
    
    fetchAll();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshAll = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchHealth(), fetchAnalytics()]);
    setLoading(false);
  };

  if (loading && !health && !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              {lastUpdated && (
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fetchHealth}
                disabled={loadingHealth}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Activity className={`h-4 w-4 mr-2 ${loadingHealth ? 'animate-spin' : ''}`} />
                Health Check
              </button>
              <button
                onClick={fetchAnalytics}
                disabled={loadingAnalytics}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <BarChart3 className={`h-4 w-4 mr-2 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                Analytics
              </button>
              <button
                onClick={handleRefreshAll}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh All
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-lg">Error Occurred</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={handleRefreshAll}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Health Status */}
        {health && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl mr-3">
                <Server className="h-5 w-5 text-white" />
              </div>
              System Health
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                <div className="text-sm font-medium opacity-90">System Status</div>
                <div className="text-2xl font-bold mt-2 capitalize">{health.status}</div>
                <div className="text-sm opacity-90 mt-1">Uptime: {health.uptime}</div>
              </div>
              
              <div className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ${
                health.services.rateLimiter.status === 'healthy' 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                  : 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white'
              }`}>
                <div className="text-sm font-medium opacity-90">Rate Limiter</div>
                <div className="text-xl font-bold mt-2 capitalize">{health.services.rateLimiter.status.replace('_', ' ')}</div>
                <div className="text-sm opacity-90 mt-1">Active: {health.services.rateLimiter.activeClients}</div>
              </div>
              
              <div className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ${
                health.services.analytics.status === 'healthy' 
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white' 
                  : 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white'
              }`}>
                <div className="text-sm font-medium opacity-90">Analytics</div>
                <div className="text-xl font-bold mt-2 capitalize">{health.services.analytics.status.replace('_', ' ')}</div>
                <div className="text-sm opacity-90 mt-1">Requests: {health.services.analytics.totalRequests}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                <div className="text-sm font-medium opacity-90">Image Generation</div>
                <div className="text-xl font-bold mt-2 capitalize">{health.services.imageGeneration.status}</div>
                <div className="text-sm opacity-90 mt-1">Model: FLUX.1</div>
              </div>
            </div>

            {/* System Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-gray-600" />
                  System Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                    <span className="text-gray-600 font-medium">Version:</span>
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm">{health.version}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                    <span className="text-gray-600 font-medium">Model:</span>
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-xs">{health.services.imageGeneration.model}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                    <span className="text-gray-600 font-medium">Max Dimensions:</span>
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm">{health.features.maxDimensions}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                    <span className="text-gray-600 font-medium">Max Images:</span>
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm">{health.features.maxImages}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Max Steps:</span>
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm">{health.features.maxSteps}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <Image className="h-5 w-5 mr-2 text-gray-600" />
                  Available Styles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {health.features.stylePresets.map((style) => (
                    <span
                      key={style}
                      className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium capitalize hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-default"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {analytics ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-xl mr-3">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  Usage Statistics
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-xl">
                    <span className="text-gray-700 font-medium">Total Requests</span>
                    <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{analytics.overview.totalRequests}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50/50 rounded-xl">
                    <span className="text-gray-700 font-medium">Unique Clients</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{analytics.overview.uniqueClients}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50/50 rounded-xl">
                    <span className="text-gray-700 font-medium">Avg Requests/Client</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{analytics.overview.avgRequestsPerClient}</span>
                  </div>
                </div>
                {analytics.overview.totalRequests === 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                    <p className="text-blue-700 font-medium">No requests have been made yet. Generate some images to see usage statistics!</p>
                  </div>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl mr-3">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Time Windows
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-green-50/50 rounded-xl">
                    <span className="text-gray-700 font-medium">Last Hour</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{analytics.timeWindows.lastHour}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-xl">
                    <span className="text-gray-700 font-medium">Last Day</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{analytics.timeWindows.lastDay}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50/50 rounded-xl">
                    <span className="text-gray-700 font-medium">Last Week</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{analytics.timeWindows.lastWeek}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-xl mr-3">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  Style Usage
                </h3>
                {Object.keys(analytics.styleUsage).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(analytics.styleUsage)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([style, count]) => (
                        <div key={style} className="flex justify-between items-center p-3 bg-yellow-50/50 rounded-xl">
                          <span className="text-gray-700 font-medium capitalize">{style}</span>
                          <span className="font-bold text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{count}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                    <p className="text-yellow-700 font-medium">No style usage data available yet.</p>
                  </div>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  Top Clients
                </h3>
                {analytics.topClients.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topClients.slice(0, 5).map((client, index) => (
                      <div key={client.clientId} className="flex justify-between items-center p-3 bg-indigo-50/50 rounded-xl">
                        <span className="text-gray-700 font-mono text-sm truncate">
                          {client.clientId === 'anonymous' ? 'Anonymous' : `${client.clientId.slice(0, 12)}...`}
                        </span>
                        <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{client.requests}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50">
                    <p className="text-indigo-700 font-medium">No client data available yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Average Parameters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                <div className="bg-gradient-to-r from-gray-500 to-slate-600 p-2 rounded-xl mr-3">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                Average Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-200">
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">{analytics.averageParameters.steps}</div>
                  <div className="text-sm text-gray-600 font-medium mt-2">Avg Steps</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-200">
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">{analytics.averageParameters.width}</div>
                  <div className="text-sm text-gray-600 font-medium mt-2">Avg Width</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-200">
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">{analytics.averageParameters.height}</div>
                  <div className="text-sm text-gray-600 font-medium mt-2">Avg Height</div>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            {analytics.recentRequests && analytics.recentRequests.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-gray-500 to-slate-600 p-2 rounded-xl mr-3">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  Recent Requests
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-3 font-semibold text-gray-700">Time</th>
                        <th className="text-left py-4 px-3 font-semibold text-gray-700">Request ID</th>
                        <th className="text-left py-4 px-3 font-semibold text-gray-700">Style</th>
                        <th className="text-left py-4 px-3 font-semibold text-gray-700">Dimensions</th>
                        <th className="text-left py-4 px-3 font-semibold text-gray-700">Steps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentRequests.map((request, index) => (
                        <tr key={request.requestId} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}>
                          <td className="py-4 px-3 text-gray-700">{new Date(request.timestamp).toLocaleTimeString()}</td>
                          <td className="py-4 px-3 font-mono text-xs bg-gray-100 rounded px-2 py-1 inline-block">{request.requestId.slice(0, 8)}...</td>
                          <td className="py-4 px-3 capitalize text-gray-700">{request.style}</td>
                          <td className="py-4 px-3 text-gray-700">{request.parameters.width}×{request.parameters.height}</td>
                          <td className="py-4 px-3 text-gray-700">{request.parameters.steps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50/90 backdrop-blur-sm border border-yellow-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-yellow-800 font-semibold text-lg">Analytics Not Available</h3>
                <p className="text-yellow-700 mt-1">
                  Analytics data could not be loaded. This might be due to a network issue or the analytics service being unavailable.
                </p>
                <button
                  onClick={fetchAnalytics}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};