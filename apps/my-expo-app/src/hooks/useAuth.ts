import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import type { LoginRequestData, RegisterRequestData } from '@task/types/auth.js';

import { fetchCurrentUser, login, register } from '@/lib/api';
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

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        return;
      }

      queryClient.setQueryData(authKeys.session, data.session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(authKeys.session, session ?? null);
      queryClient.invalidateQueries({ queryKey: authKeys.meRoot });
    });

    return () => {
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
      queryClient.setQueryData(authKeys.session, null);
      await queryClient.cancelQueries({ queryKey: authKeys.meRoot });
      queryClient.removeQueries({ queryKey: authKeys.meRoot });
    },
  });
}
