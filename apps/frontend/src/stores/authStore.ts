import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'INTERN' | 'SUPERVISOR' | 'ADMIN';
  department?: string;
  avatarUrl?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      checkAuth: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true, token });
          } else {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
          }
        } catch {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
