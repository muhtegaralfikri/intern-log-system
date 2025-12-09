'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { supervisorApi } from '@/lib/api';

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export default function SupervisorReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const response = await supervisorApi.getReports(statusFilter || undefined);
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [statusFilter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      APPROVED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DAILY: 'Harian',
      WEEKLY: 'Mingguan',
      MONTHLY: 'Bulanan',
    };
    return labels[type] || type;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Laporan Intern</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Semua Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <p className="text-gray-500 dark:text-slate-400 text-center py-8">
            Tidak ada laporan ditemukan
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Report Info */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src={report.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.user.name)}`}
                    alt={report.user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{report.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{report.user.name}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        {getTypeLabel(report.type)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                    {formatDate(report.createdAt)}
                  </span>
                  <Button variant="outline" className="text-sm">
                    Lihat
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
