'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';
import { adminApi } from '@/lib/api';

interface InternDetail {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string | null;
  avatarUrl: string | null;
  supervisor: { id: string; name: string } | null;
  createdAt: string;
  stats: {
    activities: number;
    attendances: number;
    reports: number;
  };
  topSkills: { name: string; level: number; hours: number }[];
  badges: { name: string; icon: string; earnedAt: string }[];
  recentActivities: {
    id: string;
    title: string;
    category: string;
    duration: number;
    date: string;
  }[];
}

export default function InternDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [intern, setIntern] = useState<InternDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const response = await adminApi.getInternDetail(params.id as string);
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

  if (loading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="h-20 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!intern) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Intern tidak ditemukan</h1>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        &larr; Kembali
      </Button>

      <Card className="mb-6">
        <div className="flex items-center gap-6">
          <img
            src={intern.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}&size=128`}
            alt={intern.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{intern.name}</h1>
            <p className="text-gray-500">{intern.email}</p>
            <div className="flex gap-2 mt-2">
              {intern.department && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {intern.department}
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {intern.role}
              </span>
            </div>
            {intern.supervisor && (
              <p className="text-sm text-gray-600 mt-2">
                Supervisor: <span className="font-medium">{intern.supervisor.name}</span>
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{intern.stats.activities}</p>
            <p className="text-gray-600 text-sm">Total Aktivitas</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{intern.stats.attendances}</p>
            <p className="text-gray-600 text-sm">Total Kehadiran</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{intern.stats.reports}</p>
            <p className="text-gray-600 text-sm">Total Report</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
          {intern.topSkills.length > 0 ? (
            <div className="space-y-3">
              {intern.topSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.hours}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada data skill</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges</h3>
          {intern.badges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {intern.badges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{badge.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(badge.earnedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada badge</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        {intern.recentActivities.length > 0 ? (
          <div className="space-y-3">
            {intern.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {activity.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(activity.date)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Belum ada aktivitas</p>
        )}
      </Card>
    </div>
  );
}
