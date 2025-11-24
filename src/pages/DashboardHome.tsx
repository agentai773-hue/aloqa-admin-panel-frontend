import { useState } from 'react';

interface DashboardStats {
  totalUsers: number;
  totalMinutes: number;
  activeClients: number;
  remainingClientMinutes: number;
  totalActiveBots: number;
  totalBots: number;
}

export default function DashboardHome() {
  const [stats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMinutes: 125463,
    activeClients: 0,
    remainingClientMinutes: 47592,
    totalActiveBots: 23,
    totalBots: 45
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Admin Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Monitor your calling agent platform with real-time metrics
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Total Clients</h3>
              <p className="text-2xl font-bold text-blue-900 mt-2">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1 font-medium">All registered</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Minutes */}
        <div className="bg-linear-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Total Minutes</h3>
              <p className="text-2xl font-bold text-emerald-900 mt-2">{stats.totalMinutes.toLocaleString()}</p>
              <p className="text-sm text-emerald-600 mt-1 font-medium">All time usage</p>
            </div>
            <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Clients */}
        <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Active Clients</h3>
              <p className="text-2xl font-bold text-purple-900 mt-2">{stats.activeClients}</p>
              <p className="text-sm text-purple-600 mt-1 font-medium">Currently online</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Remaining Client Minutes */}
        <div className="bg-linear-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Remaining Minutes</h3>
              <p className="text-2xl font-bold text-amber-900 mt-2">{stats.remainingClientMinutes.toLocaleString()}</p>
              <p className="text-sm text-amber-600 mt-1 font-medium">Available balance</p>
            </div>
            <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Active Bots */}
        <div className="bg-linear-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Active Bots</h3>
              <p className="text-2xl font-bold text-indigo-900 mt-2">{stats.totalActiveBots}</p>
              <p className="text-sm text-indigo-600 mt-1 font-medium">Currently running</p>
            </div>
            <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Bots */}
        <div className="bg-linear-to-br from-rose-50 to-rose-100 p-6 rounded-xl border border-rose-200/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-rose-600 uppercase tracking-wider">Total Bots</h3>
              <p className="text-2xl font-bold text-rose-900 mt-2">{stats.totalBots}</p>
              <p className="text-sm text-rose-600 mt-1 font-medium">All configured</p>
            </div>
            <div className="p-3 bg-rose-500 rounded-xl shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Admin Dashboard</h3>
        <p className="text-gray-600">
          This dashboard provides an overview of your calling agent platform. Monitor key metrics and manage your system efficiently.
        </p>
      </div>
    </div>
  );
}
