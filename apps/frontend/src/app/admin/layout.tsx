'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setLoading(false);
    };
    init();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'ADMIN' && user?.role !== 'SUPERVISOR') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPERVISOR')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Admin Panel
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/interns"
                  className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Interns
                </Link>
                <Link
                  href="/admin/reports"
                  className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Reports
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin/users"
                    className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    Users
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
              >
                Kembali ke Dashboard
              </Link>
              <span className="text-sm text-gray-500 dark:text-slate-400">
                {user?.name} ({user?.role})
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
