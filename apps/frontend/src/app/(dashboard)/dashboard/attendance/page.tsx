'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';
import AttendanceCheckIn from '@/components/attendance/AttendanceCheckIn';
import { attendanceApi } from '@/lib/api';

interface TodayAttendance {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  checkInAddress?: string;
  checkOutAddress?: string;
}

interface AttendanceHistory {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
}

export default function AttendancePage() {
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance | null>(null);
  const [history, setHistory] = useState<AttendanceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'check-in' | 'check-out' | 'history'>('check-in');

  const fetchData = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        attendanceApi.getToday().catch(() => ({ data: null })),
        attendanceApi.getHistory(1, 10).catch(() => ({ data: { data: [] } })),
      ]);
      setTodayAttendance(todayRes.data);
      setHistory(historyRes.data?.data || []);
      
      if (todayRes.data?.checkIn && !todayRes.data?.checkOut) {
        setActiveTab('check-out');
      }
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSuccess = () => {
    fetchData();
    if (activeTab === 'check-in') {
      setActiveTab('check-out');
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PRESENT: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      ABSENT: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      LATE: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      LEAVE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  return (
    <div>
      <Header title="Absensi" subtitle="Kelola kehadiran harian Anda" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="border-b border-gray-200 dark:border-slate-700">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('check-in')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'check-in'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                  disabled={!!todayAttendance?.checkIn}
                >
                  Check In
                </button>
                <button
                  onClick={() => setActiveTab('check-out')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'check-out'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                  disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut}
                >
                  Check Out
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                >
                  Riwayat
                </button>
              </nav>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : activeTab === 'history' ? (
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-slate-400 py-8">Belum ada riwayat absensi</p>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{formatDate(item.date)}</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {formatTime(item.checkIn)} - {formatTime(item.checkOut)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ) : todayAttendance?.checkIn && activeTab === 'check-in' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Anda sudah Check In</p>
                  <p className="text-gray-500 dark:text-slate-400">Pukul {formatTime(todayAttendance.checkIn)}</p>
                </div>
              ) : todayAttendance?.checkOut && activeTab === 'check-out' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Anda sudah Check Out</p>
                  <p className="text-gray-500 dark:text-slate-400">Pukul {formatTime(todayAttendance.checkOut)}</p>
                </div>
              ) : (
                <AttendanceCheckIn type={activeTab as 'check-in' | 'check-out'} onSuccess={handleSuccess} />
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Hari Ini</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-slate-700 animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(todayAttendance?.status || 'ABSENT')}`}>
                    {todayAttendance?.status || 'Belum Absen'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400">Check In</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatTime(todayAttendance?.checkIn || null)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400">Check Out</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatTime(todayAttendance?.checkOut || null)}</span>
                </div>
                {todayAttendance?.checkInAddress && (
                  <div className="pt-2">
                    <span className="text-sm text-gray-500 dark:text-slate-400">Lokasi Check In:</span>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">{todayAttendance.checkInAddress}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
