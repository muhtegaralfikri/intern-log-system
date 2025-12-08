'use client';

import { useThemeStore } from '@/stores/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Subscribe to store to trigger re-renders, theme is applied in store actions
  useThemeStore((state) => state.theme);
  
  return <>{children}</>;
}
