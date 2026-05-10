import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    role: string;
    email: string;
  } | null;
  login: (credentials: { username: string; rememberMe?: boolean }) => void;
  logout: () => void;
  lastActive: number;
  updateActivity: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      lastActive: Date.now(),
      login: ({ username, rememberMe }) => {
        set({
          isAuthenticated: true,
          user: {
            name: username === 'admin' ? 'Administrator' : 'Admin Vinh',
            role: 'admin',
            email: `${username}@xapps.com`,
          },
          lastActive: Date.now(),
        });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      updateActivity: () => {
        set({ lastActive: Date.now() });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
