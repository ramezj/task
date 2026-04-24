import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { config } from '@/lib/config';

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export function bindSupabaseAutoRefresh() {
  const handleAppStateChange = (state: string) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
      return;
    }

    supabase.auth.stopAutoRefresh();
  };

  handleAppStateChange(AppState.currentState);

  const subscription = AppState.addEventListener('change', handleAppStateChange);

  return () => {
    subscription.remove();
    supabase.auth.stopAutoRefresh();
  };
}
