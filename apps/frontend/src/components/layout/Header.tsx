'use client';

import { useAuthStore } from '@/stores/authStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const user = useAuthStore((state) => state.user);
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm lg:text-base mt-1">{subtitle}</p>}
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs lg:text-sm text-gray-500">{today}</p>
          <p className="text-xs lg:text-sm font-medium text-gray-700">
            Halo, {user?.name?.split(' ')[0]}!
          </p>
        </div>
      </div>
    </header>
  );
}
