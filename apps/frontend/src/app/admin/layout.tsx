'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminMobileNav } from '@/components/layout/AdminMobileNav';
import { Header } from '@/components/layout/Header';

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
      } else if (user?.role !== 'ADMIN') {
        // Only ADMIN can access admin panel
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <AdminSidebar />
      <AdminMobileNav />
      
      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 p-4 lg:p-8">
        <Header 
          title="Admin Panel" 
          subtitle="Kelola sistem dan monitor aktivitas"
        />
        {children}
      </main>
    </div>
  );
}
