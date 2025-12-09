'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { supervisorApi } from '@/lib/api';

interface DashboardStats {
  totalInterns: number;
  totalActivities: number;
  totalAttendances: number;
  pendingReports: number;
}

interface RecentActivity {
  id: string;
  title: string;
  category: string;
  duration: number;
  date: string;
  intern: {
    name: string;
  };
}

export default function SupervisorDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          supervisorApi.getStats(),
          supervisorApi.getRecentActivities(),
        ]);
        setStats(statsRes.data);
        setRecentActivities(activitiesRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Selamat Datang, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-slate-400 text-sm sm:text-base">
          Panel supervisor untuk memantau intern yang Anda bimbing
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats?.totalInterns || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Intern Dibimbing</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats?.totalActivities || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Total Aktivitas</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              {stats?.totalAttendances || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Total Kehadiran</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats?.pendingReports || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Laporan Pending</p>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Aktivitas Terbaru Intern
        </h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                      {activity.intern.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                      {activity.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
                    </span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 flex-shrink-0">
                  {formatDate(activity.date)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-slate-400 text-center py-8">
            Belum ada aktivitas dari intern Anda
          </p>
        )}
      </Card>
    </div>
  );
}
