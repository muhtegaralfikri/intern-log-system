'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', isDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
    
    // Listen for system theme changes when in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  // Subscribe to store changes for immediate updates
  useEffect(() => {
    const unsubscribe = useThemeStore.subscribe((state) => {
      applyTheme(state.theme);
    });
    return unsubscribe;
  }, []);

  return <>{children}</>;
}
