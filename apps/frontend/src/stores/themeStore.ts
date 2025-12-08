import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  _hasHydrated: boolean;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      _hasHydrated: false,
      setTheme: (theme) => {
        set({ theme });
        // Apply theme immediately when changed
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
          // Apply theme after hydration
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', state.theme === 'dark');
          }
        }
      },
    }
  )
);
