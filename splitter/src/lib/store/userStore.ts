import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/app/types';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set: (partial: Partial<UserState> | ((state: UserState) => Partial<UserState>)) => void) => ({
      currentUser: null,
      isLoading: false,
      error: null,
      setCurrentUser: (user: User | null) => set({ currentUser: user, error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error, isLoading: false }),
      clearUser: () => set({ currentUser: null, error: null, isLoading: false }),
    }),
    {
      name: 'user-store',
      partialize: (state: UserState) => ({ currentUser: state.currentUser }), // Only persist user data
    }
  )
); 