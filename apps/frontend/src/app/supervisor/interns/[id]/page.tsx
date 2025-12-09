'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';
import { supervisorApi } from '@/lib/api';

interface InternDetail {
  id: string;
  email: string;
  name: string;
  department: string | null;
  avatarUrl: string | null;
  createdAt: string;
  stats: {
    activities: number;
    attendances: number;
    reports: number;
  };
  topSkills: { name: string; level: number; hours: number }[];
  recentActivities: {
    id: string;
    title: string;
    category: string;
    duration: number;
    date: string;
  }[];
  recentAttendances: {
    id: string;
    date: string;
    checkIn: string;
    checkOut: string | null;
    status: string;
  }[];
}

export default function SupervisorInternDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [intern, setIntern] = useState<InternDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const response = await supervisorApi.getInternDetail(params.id as string);
        setIntern(response.data);
      } catch (error) {
        console.error('Failed to fetch intern:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIntern();
  }, [params.id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!intern) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Intern tidak ditemukan</h1>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        &larr; Kembali
      </Button>

      {/* Profile Card */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <img
            src={intern.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}&size=128`}
            alt={intern.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover flex-shrink-0"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{intern.name}</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base break-all">{intern.email}</p>
            {intern.department && (
              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm rounded-full">
                {intern.department}
              </span>
            )}
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
              Bergabung: {formatDate(intern.createdAt)}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{intern.stats.activities}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Total Aktivitas</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{intern.stats.attendances}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Total Kehadiran</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{intern.stats.reports}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Total Laporan</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Skills */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Skills</h3>
          {intern.topSkills.length > 0 ? (
            <div className="space-y-3">
              {intern.topSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700 dark:text-slate-300">{skill.name}</span>
                    <span className="text-sm text-gray-500 dark:text-slate-400">{skill.hours}h</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400 text-center py-4">Belum ada data skill</p>
          )}
        </Card>

        {/* Recent Attendances */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kehadiran Terakhir</h3>
          {intern.recentAttendances.length > 0 ? (
            <div className="space-y-2">
              {intern.recentAttendances.map((att) => (
                <div
                  key={att.id}
                  className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{formatDate(att.date)}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {formatTime(att.checkIn)} - {att.checkOut ? formatTime(att.checkOut) : 'Belum checkout'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    att.status === 'PRESENT' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : att.status === 'LATE'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400 text-center py-4">Belum ada data kehadiran</p>
          )}
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aktivitas Terbaru</h3>
        {intern.recentActivities.length > 0 ? (
          <div className="space-y-3">
            {intern.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
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
          <p className="text-gray-500 dark:text-slate-400 text-center py-4">Belum ada aktivitas</p>
        )}
      </Card>
    </div>
  );
}
