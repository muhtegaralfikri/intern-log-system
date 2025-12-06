'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';
import { TimeAnalytics } from '@/components/dashboard/TimeAnalytics';
import { attendanceApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface TodayAttendance {
  id: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  leave: number;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance | null>(null);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todayRes, summaryRes] = await Promise.all([
          attendanceApi.getToday().catch(() => ({ data: null })),
          attendanceApi.getSummary(new Date().getFullYear(), new Date().getMonth() + 1).catch(() => ({ data: null })),
        ]);
        setTodayAttendance(todayRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <Header title="Dashboard" subtitle="Selamat datang di sistem pencatatan intern" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Status Hari Ini"
          value={todayAttendance?.status || 'Belum Absen'}
          icon={<StatusIcon />}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Check In"
          value={formatTime(todayAttendance?.checkIn || null)}
          icon={<CheckInIcon />}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Check Out"
          value={formatTime(todayAttendance?.checkOut || null)}
          icon={<CheckOutIcon />}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Hadir Bulan Ini"
          value={summary?.present?.toString() || '0'}
          icon={<CalendarIcon />}
          color="purple"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ringkasan Kehadiran Bulan Ini</h2>
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{summary?.present || 0}</p>
                <p className="text-sm text-green-700 dark:text-green-300">Hadir</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{summary?.absent || 0}</p>
                <p className="text-sm text-red-700 dark:text-red-300">Tidak Hadir</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary?.late || 0}</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Terlambat</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary?.leave || 0}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Izin/Cuti</p>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Profil</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-gray-500 dark:text-slate-400">Nama</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-gray-500 dark:text-slate-400">Email</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-gray-500 dark:text-slate-400">Role</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-slate-400">Department</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.department || '-'}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 lg:mt-8">
        <TimeAnalytics />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
  loading?: boolean;
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <Card className="!p-3 lg:!p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
        <div className={`p-2 lg:p-3 rounded-lg ${colors[color]} w-fit`}>
          {icon}
        </div>
        <div>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-slate-400">{title}</p>
          {loading ? (
            <div className="h-5 lg:h-7 w-12 lg:w-16 bg-gray-200 dark:bg-slate-700 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-base lg:text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function StatusIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckInIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );
}

function CheckOutIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
