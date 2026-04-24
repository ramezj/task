import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Text } from '@/components/ui/text';
import { AuthenticatedScreen } from '@/screens/AuthenticatedScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { queryClient } from '@/lib/query-client';
import {
  useAuthBootstrap,
  useCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useSessionQuery,
} from '@/hooks/useAuth';
import { ApiClientError } from '@/lib/api';
import { cn } from '@/lib/utils';

function AuthApp() {
  useAuthBootstrap();

  const [screen, setScreen] = useState<'login' | 'register'>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [registerNotice, setRegisterNotice] = useState<string | undefined>();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const scale = useSharedValue(1);
  const sessionQuery = useSessionQuery();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const switchScreen = (nextScreen: 'login' | 'register') => {
    if (isTransitioning || nextScreen === screen) {
      return;
    }

    loginMutation.reset();
    registerMutation.reset();
    setRegisterNotice(undefined);
    setIsTransitioning(true);
    scale.value = withTiming(
      0.985,
      {
        duration: 140,
        easing: Easing.inOut(Easing.ease),
      },
      (finished) => {
        if (!finished) {
          return;
        }

        runOnJS(setScreen)(nextScreen);
        scale.value = withTiming(1, {
          duration: 180,
          easing: Easing.inOut(Easing.ease),
        }, (expanded) => {
          if (expanded) {
            runOnJS(setIsTransitioning)(false);
          }
        });
      }
    );
  };

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
      <View className={cn('flex-1 items-center justify-center bg-background', theme === 'dark' && 'dark')}>
        <ActivityIndicator size="large" color={theme === 'light' ? '#111827' : '#fafafa'} />
      </View>
    );
  }

  if (currentUserQuery.data?.user) {
    return (
      <AuthenticatedScreen
        isLoggingOut={logoutMutation.isPending}
        onLogout={() => logoutMutation.mutate()}
        user={currentUserQuery.data.user}
      />
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
      <Animated.View className="flex-1" style={animatedStyle}>
        {screen === 'login' ? (
          <LoginScreen
            errorMessage={loginMutation.error?.message}
            isPending={loginMutation.isPending}
            onSignUpPress={() => switchScreen('register')}
            onSubmit={(payload) => {
              setRegisterNotice(undefined);
              loginMutation.mutate(payload);
            }}
          />
        ) : (
          <RegisterScreen
            errorMessage={registerMutation.error?.message}
            isPending={registerMutation.isPending}
            onLoginPress={() => switchScreen('login')}
            onSubmit={async (payload) => {
              const result = await registerMutation.mutateAsync(payload);

              if (result.requiresEmailConfirmation) {
                setRegisterNotice(result.message);
              }
            }}
            successMessage={registerNotice}
          />
        )}
      </Animated.View>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthApp />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
