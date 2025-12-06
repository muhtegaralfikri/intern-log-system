'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { adminApi } from '@/lib/api';

interface Report {
  id: string;
  title: string;
  type: string;
  periodStart: string;
  periodEnd: string;
  isApproved: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getReports(page, 10, statusFilter || undefined);
        setReports(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [page, statusFilter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      daily: 'bg-blue-100 text-blue-700',
      weekly: 'bg-green-100 text-green-700',
      monthly: 'bg-purple-100 text-purple-700',
      final: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">Tidak ada report ditemukan</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={report.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.user.name)}`}
                      alt={report.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-500">by {report.user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        report.isApproved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {report.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    <div className="text-right text-sm text-gray-500">
                      <p>{formatDate(report.periodStart)} - {formatDate(report.periodEnd)}</p>
                      <p className="text-xs">Dibuat: {formatDate(report.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
