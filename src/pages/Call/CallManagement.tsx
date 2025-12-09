import React, { useState } from 'react';
import { 
  Phone, 
  Users, 
  BarChart3, 
  Plus,
  Monitor,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';

type TabType = 'dashboard' | 'bulk' | 'monitor' | 'performance' | 'settings';

const CallManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedProject, setSelectedProject] = useState<string>('Main Project');
  const [showNewCallModal, setShowNewCallModal] = useState(false);

  // Mock data for demonstration
  const mockAnalytics = {
    summary: {
      totalCalls: 245,
      completedCalls: 198,
      interestedLeads: 67,
      avgDuration: 142
    }
  };

  const mockRecentCalls = [
    {
      _id: '1',
      leadId: { name: 'John Doe', mobile: '+1234567890' },
      status: 'completed',
      duration: 180,
      createdAt: new Date().toISOString(),
      recordingUrl: 'recording1.mp3'
    },
    {
      _id: '2',
      leadId: { name: 'Jane Smith', mobile: '+1234567891' },
      status: 'in_progress',
      duration: null,
      createdAt: new Date().toISOString(),
      recordingUrl: null
    },
    {
      _id: '3',
      leadId: { name: 'Bob Johnson', mobile: '+1234567892' },
      status: 'failed',
      duration: 45,
      createdAt: new Date().toISOString(),
      recordingUrl: null
    }
  ];

  const tabs = [
    {
      id: 'dashboard' as TabType,
      name: 'Dashboard',
      icon: BarChart3,
      description: 'Overview of all calls'
    },
    {
      id: 'bulk' as TabType,
      name: 'Bulk Calls',
      icon: Users,
      description: 'Manage bulk calling campaigns'
    },
    {
      id: 'monitor' as TabType,
      name: 'Live Monitor',
      icon: Monitor,
      description: 'Real-time call monitoring'
    },
    {
      id: 'performance' as TabType,
      name: 'Performance',
      icon: Activity,
      description: 'Agent metrics and analytics'
    }
  ];

  const renderQuickStats = () => {
    const isLoading = false; // Mock loading state

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Calls Today</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockAnalytics.summary.totalCalls}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round((mockAnalytics.summary.completedCalls / mockAnalytics.summary.totalCalls) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Interested Leads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockAnalytics.summary.interestedLeads}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Duration</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockAnalytics.summary.avgDuration}s
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecentCalls = () => {
    const isLoading = false; // Mock loading state

    if (isLoading) {
      return (
        <div className="bg-white rounded-lg border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Calls</h3>
        </div>
        
        {mockRecentCalls.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No calls found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start making calls to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockRecentCalls.map((call) => (
                  <tr key={call._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {call.leadId.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {call.leadId.mobile}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        call.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : call.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : call.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {call.duration ? `${call.duration}s` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(call.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      {call.recordingUrl && (
                        <button className="text-green-600 hover:text-green-900">
                          Play
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {renderQuickStats()}
            {renderRecentCalls()}
          </div>
        );
      
      case 'bulk':
        return (
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bulk Call Management</h3>
              <p className="text-gray-600 mb-6">Create and manage bulk calling campaigns</p>
              <div className="grid md:grid-cols-2 gap-4">
                <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Phone className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <h4 className="font-medium">Create New Campaign</h4>
                  <p className="text-sm text-gray-500">Start a new bulk calling campaign</p>
                </button>
                <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                  <BarChart3 className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <h4 className="font-medium">View Campaigns</h4>
                  <p className="text-sm text-gray-500">Monitor existing campaigns</p>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'monitor':
        return (
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center">
              <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Live Call Monitor</h3>
              <p className="text-gray-600">Real-time monitoring of active calls</p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  No active calls at the moment. Live calls will appear here when started.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'performance':
        return (
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center">
              <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Agent Performance</h3>
              <p className="text-gray-600">Track agent performance metrics and analytics</p>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Performance metrics will be available once calls are made.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your calling operations
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Project Selector */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="Main Project">Main Project</option>
            <option value="Secondary Project">Secondary Project</option>
            <option value="Test Project">Test Project</option>
          </select>
          
          <button
            onClick={() => setShowNewCallModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2"
          >
            <Plus className="w-4 h-4" />
            New Call
          </button>
          
          <button
            onClick={() => setActiveTab('bulk')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 gap-2"
          >
            <Users className="w-4 h-4" />
            Bulk Campaign
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
        
        {renderTabContent()}
      </div>

      {/* New Call Modal */}
      {showNewCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Start New Call</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Name (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowNewCallModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement single call initiation
                  console.log('Starting single call...');
                  setShowNewCallModal(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Phone className="w-4 h-4" />
                Start Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallManagement;