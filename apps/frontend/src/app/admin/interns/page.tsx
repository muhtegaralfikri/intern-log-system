'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { adminApi } from '@/lib/api';

interface Intern {
  id: string;
  email: string;
  name: string;
  department: string | null;
  avatarUrl: string | null;
  supervisor: { id: string; name: string } | null;
  createdAt: string;
  _count: {
    activities: number;
    attendances: number;
  };
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function InternsPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadInterns = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getInterns(page, 10);
        setInterns(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error('Failed to fetch interns:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInterns();
  }, [page]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Intern</h1>
        <p className="text-gray-600 dark:text-slate-400">Total: {meta?.total || 0} intern</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : interns.length === 0 ? (
        <Card>
          <p className="text-gray-500 dark:text-slate-400 text-center py-8">Belum ada intern terdaftar</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {interns.map((intern) => (
              <Card key={intern.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={intern.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}`}
                      alt={intern.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{intern.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{intern.email}</p>
                      {intern.department && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                          {intern.department}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{intern._count.activities}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Aktivitas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{intern._count.attendances}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Kehadiran</p>
                    </div>
                    <div className="text-right">
                      {intern.supervisor ? (
                        <p className="text-sm text-gray-600 dark:text-slate-300">
                          Supervisor: <span className="font-medium">{intern.supervisor.name}</span>
                        </p>
                      ) : (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Belum ada supervisor</p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                        Bergabung: {formatDate(intern.createdAt)}
                      </p>
                    </div>
                    <Link href={`/admin/interns/${intern.id}`}>
                      <Button variant="outline" className="text-sm">
                        Detail
                      </Button>
                    </Link>
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
              <span className="flex items-center px-4 text-sm text-gray-600 dark:text-slate-400">
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
