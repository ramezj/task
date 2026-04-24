import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import {
  useAuthBootstrap,
  useCurrentUserQuery,
  useLogoutMutation,
  useSessionQuery,
} from "@/hooks/use-auth";
import { ApiClientError } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { useTheme } from "@/hooks/use-theme";

function RootNavigation() {
  useAuthBootstrap();

  const theme = useTheme();
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
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} size="large" />
      </View>
    );
  }

  if (sessionQuery.data && currentUserQuery.isError) {
    return (
      <View style={[styles.centered, styles.errorContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.errorCard, { borderColor: theme.backgroundElement }]}>
          <ThemedText type="subtitle">Could not refresh your session.</ThemedText>
          <ThemedText themeColor="textSecondary">{currentUserQuery.error.message}</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-in" options={{ animation: "fade" }} />
        <Stack.Screen name="sign-up" options={{ animation: "fade" }} />
        <Stack.Screen name="(app)" />
      </Stack>
      <StatusBar style="auto" />
    </>
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

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    padding: Spacing.four,
  },
  errorCard: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.two,
  },
});
