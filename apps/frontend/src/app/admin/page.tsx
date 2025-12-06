'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { adminApi } from '@/lib/api';

interface Stats {
  users: {
    total: number;
    interns: number;
    supervisors: number;
    admins: number;
  };
  activities: {
    total: number;
    monthly: number;
    weekly: number;
    byCategory: { category: string; count: number; totalMinutes: number }[];
  };
  reports: {
    total: number;
    pending: number;
    approved: number;
  };
  attendance: {
    today: number;
  };
  topInterns: {
    id: string;
    name: string;
    avatarUrl: string | null;
    activityCount: number;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.users.interns || 0}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Total Intern</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.activities.total || 0}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Total Aktivitas</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.reports.pending || 0}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Report Pending</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats?.attendance.today || 0}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Hadir Hari Ini</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Users Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <span className="text-gray-700 dark:text-slate-300">Interns</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{stats?.users.interns || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <span className="text-gray-700 dark:text-slate-300">Supervisors</span>
              <span className="font-bold text-green-600 dark:text-green-400">{stats?.users.supervisors || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <span className="text-gray-700 dark:text-slate-300">Admins</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{stats?.users.admins || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
              <span className="font-medium text-gray-900 dark:text-white">Total Users</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats?.users.total || 0}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reports Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <span className="text-gray-700 dark:text-slate-300">Pending</span>
              <span className="font-bold text-yellow-600 dark:text-yellow-400">{stats?.reports.pending || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <span className="text-gray-700 dark:text-slate-300">Approved</span>
              <span className="font-bold text-green-600 dark:text-green-400">{stats?.reports.approved || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
              <span className="font-medium text-gray-900 dark:text-white">Total Reports</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats?.reports.total || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Interns</h3>
          {stats?.topInterns && stats.topInterns.length > 0 ? (
            <div className="space-y-3">
              {stats.topInterns.map((intern, index) => (
                <div
                  key={intern.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-bold text-sm">
                      {index + 1}
                    </span>
                    <img
                      src={intern.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}`}
                      alt={intern.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{intern.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                    {intern.activityCount} aktivitas
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400 text-center py-8">Belum ada data</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activities by Category</h3>
          {stats?.activities.byCategory && stats.activities.byCategory.length > 0 ? (
            <div className="space-y-3">
              {stats.activities.byCategory.map((cat) => (
                <div key={cat.category} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-gray-700 dark:text-slate-300">{cat.category}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 dark:text-white">{cat.count}</span>
                    <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                      ({Math.round(cat.totalMinutes / 60)}h)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400 text-center py-8">Belum ada data</p>
          )}
        </Card>
      </div>
    </div>
  );
}
