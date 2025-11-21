// Zustand store for authentication
import { create } from 'zustand';
import { User, UserProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null, profile: UserProfile | null, token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  profile: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')!) : null,
  token: localStorage.getItem('authToken'),
  isLoading: false,
  error: null,
  setUser: (user, profile, token) => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('authToken', token);
    }
    set({ user, profile, token, error: null });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    localStorage.removeItem('authToken');
    set({ user: null, profile: null, token: null });
  },
}));
