import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import type { LoginRequestData, RegisterRequestData } from '@task/types/auth.js';

import { fetchCurrentUser, login, register } from '@/lib/api';
import {
  clearStoredSessionAccessToken,
  storeSessionAccessToken,
} from '@/lib/secure-token';
import { bindSupabaseAutoRefresh, supabase } from '@/lib/supabase';

const authKeys = {
  session: ['auth', 'session'] as const,
  me: (accessToken: string | null) => ['auth', 'me', accessToken] as const,
  meRoot: ['auth', 'me'] as const,
};

export function useAuthBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unbindAutoRefresh = bindSupabaseAutoRefresh();
    let expiryTimeout: ReturnType<typeof setTimeout> | null = null;

    const clearExpiryTimeout = () => {
      if (!expiryTimeout) {
        return;
      }

      clearTimeout(expiryTimeout);
      expiryTimeout = null;
    };

    const expireSession = async () => {
      clearExpiryTimeout();
      await clearStoredSessionAccessToken();

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      queryClient.setQueryData(authKeys.session, null);
      await queryClient.cancelQueries({ queryKey: authKeys.meRoot });
      queryClient.removeQueries({ queryKey: authKeys.meRoot });
    };

    const syncSessionState = async (session: Session | null) => {
      queryClient.setQueryData(authKeys.session, session ?? null);
      await storeSessionAccessToken(session);
      clearExpiryTimeout();

      if (session?.expires_at) {
        const expiresAtMs = session.expires_at * 1000;
        const delay = expiresAtMs - Date.now();

        if (delay <= 0) {
          await expireSession();
          return;
        }

        expiryTimeout = setTimeout(() => {
          void expireSession();
        }, delay);
      }

      queryClient.invalidateQueries({ queryKey: authKeys.meRoot });
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        return;
      }

      void syncSessionState(data.session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncSessionState(session ?? null);
    });

    return () => {
      clearExpiryTimeout();
      subscription.unsubscribe();
      unbindAutoRefresh();
    };
  }, [queryClient]);
}

export function useSessionQuery() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data.session ?? null;
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
}

export function useCurrentUserQuery(session: Session | null | undefined) {
  return useQuery({
    queryKey: authKeys.me(session?.access_token ?? null),
    queryFn: () => fetchCurrentUser(session!.access_token),
    enabled: Boolean(session?.access_token),
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequestData) => login(payload),
    onSuccess: async (result) => {
      const { data, error } = await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });

      if (error) {
        throw error;
      }

      queryClient.setQueryData(authKeys.session, data.session ?? null);
      await queryClient.invalidateQueries({ queryKey: authKeys.meRoot });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequestData) => register(payload),
    onSuccess: async (result) => {
      if (result.requiresEmailConfirmation) {
        return;
      }

      const { data, error } = await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });

      if (error) {
        throw error;
      }

      queryClient.setQueryData(authKeys.session, data.session ?? null);
      await queryClient.invalidateQueries({ queryKey: authKeys.meRoot });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await clearStoredSessionAccessToken();
      queryClient.setQueryData(authKeys.session, null);
      await queryClient.cancelQueries({ queryKey: authKeys.meRoot });
      queryClient.removeQueries({ queryKey: authKeys.meRoot });
    },
  });
}
