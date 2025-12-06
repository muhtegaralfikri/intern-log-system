'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { activitiesApi } from '@/lib/api';

interface Analytics {
  totalActivities: number;
  totalMinutes: number;
  totalHours: number;
  avgMinutesPerDay: number;
  byCategory: {
    category: string;
    count: number;
    minutes: number;
    hours: number;
  }[];
  dailyTrend: {
    date: string;
    count: number;
    minutes: number;
  }[];
  peakHour: number | null;
}

export function TimeAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await activitiesApi.getAnalytics(days);
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [days]);

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  const formatPeakHour = (hour: number | null) => {
    if (hour === null) return '-';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <p className="text-gray-500 dark:text-slate-400 text-center py-8">Gagal memuat analytics</p>
      </Card>
    );
  }

  const maxMinutes = Math.max(...analytics.byCategory.map((c) => c.minutes), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Time Analytics</h2>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>7 hari terakhir</option>
          <option value={30}>30 hari terakhir</option>
          <option value={90}>90 hari terakhir</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.totalActivities}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Total Aktivitas</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.totalHours}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Total Jam</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.avgMinutesPerDay}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Menit/Hari</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatPeakHour(analytics.peakHour)}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Jam Produktif</p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Waktu per Kategori</h3>
        {analytics.byCategory.length > 0 ? (
          <div className="space-y-3">
            {analytics.byCategory
              .sort((a, b) => b.minutes - a.minutes)
              .map((cat, index) => (
                <div key={cat.category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{cat.category}</span>
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      {cat.hours}h ({cat.count} aktivitas)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getCategoryColor(index)}`}
                      style={{ width: `${(cat.minutes / maxMinutes) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-slate-400 text-center py-4">Belum ada data kategori</p>
        )}
      </Card>

      <Card>
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Tren Harian</h3>
        {analytics.dailyTrend.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max pb-2">
              {analytics.dailyTrend.slice(-14).map((day) => {
                const height = Math.max((day.minutes / 480) * 100, 5);
                return (
                  <div key={day.date} className="flex flex-col items-center">
                    <div className="h-24 w-8 bg-gray-100 dark:bg-slate-700 rounded relative flex items-end">
                      <div
                        className="w-full bg-blue-500 rounded"
                        style={{ height: `${Math.min(height, 100)}%` }}
                        title={`${day.count} aktivitas, ${Math.round(day.minutes / 60)}h`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 rotate-45 origin-left">
                      {new Date(day.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-slate-400 text-center py-4">Belum ada data tren</p>
        )}
      </Card>
    </div>
  );
}
