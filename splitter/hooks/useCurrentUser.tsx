"use client";
import { useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useUserStore } from '@/lib/store/userStore';
import { User } from '@/app/types';

const useCurrentUser = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { currentUser, isLoading, error, setCurrentUser, setLoading, setError } = useUserStore();

  const fetchCurrentUser = useCallback(async () => {
    if (!clerkLoaded) {
      return;
    }
    if (!clerkUser) {
      setCurrentUser(null);
      return;
    }
    if (currentUser && currentUser.clerkId === clerkUser.id) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<User>('/api/user/currentuser');
      setCurrentUser(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      console.error('Error fetching current user:', err);
    } finally {
      setLoading(false);
    }
  }, [clerkUser, clerkLoaded, currentUser, setCurrentUser, setLoading, setError]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    currentUser,
    isLoading: isLoading || !clerkLoaded,
    error,
    isAuthenticated: !!clerkUser && !!currentUser,
  };
};

export default useCurrentUser;