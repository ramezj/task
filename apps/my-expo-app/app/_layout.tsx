import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Text } from '@/components/ui/text';
import { ApiClientError } from '@/lib/api';
import { queryClient } from '@/lib/query-client';
import {
  useAuthBootstrap,
  useCurrentUserQuery,
  useLogoutMutation,
  useSessionQuery,
} from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

function RootNavigation() {
  useAuthBootstrap();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const sessionQuery = useSessionQuery();
  const logoutMutation = useLogoutMutation();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  useEffect(() => {
    if (!(currentUserQuery.error instanceof ApiClientError)) {
      return;
    }

    if (currentUserQuery.error.statusCode !== 401) {
      return;
    }

    logoutMutation.mutate();
  }, [currentUserQuery.error, logoutMutation]);

  if (sessionQuery.isLoading || (sessionQuery.data && currentUserQuery.isLoading)) {
    return (
      <View
        className={cn(
          'flex-1 items-center justify-center bg-background',
          theme === 'dark' && 'dark'
        )}
      >
        <ActivityIndicator size="large" color={theme === 'light' ? '#111827' : '#fafafa'} />
      </View>
    );
  }

  if (sessionQuery.data && currentUserQuery.isError) {
    return (
      <View className={cn('flex-1 justify-center bg-background px-6', theme === 'dark' && 'dark')}>
        <View className="gap-4 rounded-2xl border border-border bg-card p-5">
          <Text className="text-lg font-semibold text-foreground">Could not refresh your session.</Text>
          <Text className="text-sm text-muted-foreground">{currentUserQuery.error.message}</Text>
          <Button className="h-12 bg-primary" onPress={() => currentUserQuery.refetch()}>
            <Text className="text-primary-foreground">Try Again</Text>
          </Button>
          <Button className="h-12 bg-secondary" onPress={() => logoutMutation.mutate()}>
            <Text className="text-secondary-foreground">Logout</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className={cn('flex-1 bg-background', theme === 'dark' && 'dark')}>
      <View className="absolute right-6 top-16 z-10">
        <ThemeToggle
          isDark={theme === 'dark'}
          onToggle={(value) => setTheme(value ? 'dark' : 'light')}
        />
      </View>
      <Slot />
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigation />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
