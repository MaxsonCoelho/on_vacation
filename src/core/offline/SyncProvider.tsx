import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { SyncWorker } from './queue/SyncWorker';
import { supabase } from '../services/supabase';

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 1. Initial check (if session exists)
    console.log('[SyncProvider] Initializing sync worker...');
    SyncWorker.processQueue();

    // 2. Listen for network changes
    const unsubscribeNet = NetInfo.addEventListener(state => {
      console.log('[SyncProvider] Network state changed:', state.isConnected ? 'Online' : 'Offline');
      
      if (state.isConnected) {
        console.log('[SyncProvider] Online detected. Triggering queue processing...');
        SyncWorker.processQueue();
      }
    });

    // 3. Listen for Auth changes (Process queue when user signs in)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('[SyncProvider] Auth state changed:', event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('[SyncProvider] User signed in/refreshed. Triggering queue processing...');
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
