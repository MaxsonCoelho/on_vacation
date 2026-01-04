import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { AppState } from 'react-native';
import { SupabaseStorageAdapter } from './SupabaseStorageAdapter';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing! Please check your app.json or .env files.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    storage: SupabaseStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

