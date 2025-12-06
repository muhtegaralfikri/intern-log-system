'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = useThemeStore.subscribe((state) => {
      applyTheme(state.theme);
    });
    return unsubscribe;
  }, []);

  return <>{children}</>;
}
