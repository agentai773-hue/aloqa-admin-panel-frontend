// Loader functions for route data fetching
import type { DashboardData, AnalyticsData, UserSettingsData } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dashboard loader
export async function dashboardLoader(): Promise<DashboardData> {
  await delay(500);
  
  return {
    stats: {
      totalUsers: 1234,
      activeSessions: 456,
      revenue: 12345,
    },
    recentActivity: [
      {
        id: '1',
        message: 'New user registered',
        timestamp: '2 minutes ago',
      },
      {
        id: '2',
        message: 'Order #1234 completed',
        timestamp: '5 minutes ago',
      },
      {
        id: '3',
        message: 'System backup completed',
        timestamp: '1 hour ago',
      },
    ],
  };
}

// Analytics loader
export async function analyticsLoader(): Promise<AnalyticsData> {
  await delay(800);
  
  return {
    userGrowth: [
      { date: '2024-01', value: 1000 },
      { date: '2024-02', value: 1200 },
      { date: '2024-03', value: 1500 },
      { date: '2024-04', value: 1800 },
    ],
    revenue: [
      { date: '2024-01', value: 10000 },
      { date: '2024-02', value: 12000 },
      { date: '2024-03', value: 15000 },
      { date: '2024-04', value: 18000 },
    ],
    metrics: [
      {
        name: 'Page Views',
        current: '45,678',
        change: '+12.5%',
        trend: 'up',
      },
      {
        name: 'Conversion Rate',
        current: '3.24%',
        change: '-0.8%',
        trend: 'down',
      },
      {
        name: 'Bounce Rate',
        current: '32.1%',
        change: '-5.2%',
        trend: 'up',
      },
    ],
  };
}

// Settings loader
export async function settingsLoader(): Promise<UserSettingsData> {
  await delay(300);
  
  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;
  
  return {
    profile: {
      email: user?.email || 'user@example.com',
      name: user?.name || 'User',
      avatar: undefined,
    },
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en',
      timezone: 'UTC',
    },
  };
}