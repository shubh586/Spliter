"use client";
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserStore } from '@/lib/store/userStore';

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { setCurrentUser, setLoading, setError } = useUserStore();

  useEffect(() => {
    if (!clerkLoaded) return;

    if (!clerkUser) {
      setCurrentUser(null);
      return;
    }

    // The useCurrentUser hook will handle fetching the user data
    // This provider just ensures the store is initialized
  }, [clerkUser, clerkLoaded, setCurrentUser]);

  return <>{children}</>;
} 