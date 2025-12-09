'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { supervisorApi } from '@/lib/api';

interface Intern {
  id: string;
  email: string;
  name: string;
  department: string | null;
  avatarUrl: string | null;
  createdAt: string;
  _count: {
    activities: number;
    attendances: number;
  };
}

export default function SupervisorInternsPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterns = async () => {
      try {
        const response = await supervisorApi.getMyInterns();
        setInterns(response.data);
      } catch (error) {
        console.error('Failed to fetch interns:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInterns();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Intern Saya</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400">Total: {interns.length} intern</p>
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
          <p className="text-gray-500 dark:text-slate-400 text-center py-8">
            Anda belum memiliki intern yang dibimbing
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {interns.map((intern) => (
            <Card key={intern.id}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Profile Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={intern.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}`}
                    alt={intern.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{intern.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{intern.email}</p>
                    {intern.department && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                        {intern.department}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="flex gap-4 sm:gap-6">
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{intern._count.activities}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Aktivitas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{intern._count.attendances}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Kehadiran</p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right text-xs text-gray-400 dark:text-slate-500">
                    Bergabung: {formatDate(intern.createdAt)}
                  </div>
                  <Link href={`/supervisor/interns/${intern.id}`} className="ml-auto lg:ml-0">
                    <Button variant="outline" className="text-sm">
                      Detail
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
