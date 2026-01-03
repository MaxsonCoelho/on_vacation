import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { SyncWorker } from './queue/SyncWorker';
import { supabase } from '../services/supabase';

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 1. Initial check (if session exists)
    SyncWorker.processQueue();

    // 2. Listen for network changes
    const unsubscribeNet = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        SyncWorker.processQueue();
      }
    });

    // 3. Listen for Auth changes (Process queue when user signs in)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            SyncWorker.processQueue();
        }
    });

    return () => {
      unsubscribeNet();
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
