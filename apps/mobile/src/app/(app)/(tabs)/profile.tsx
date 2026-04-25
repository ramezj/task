import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import {
  useCurrentUserQuery,
  useLogoutMutation,
  useSessionQuery,
} from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function ProfileScreen() {
  const theme = useTheme();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);
  const logoutMutation = useLogoutMutation();

  if (!sessionQuery.data) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <ThemedText type="smallBold" style={{ color: theme.textSecondary, textTransform: "uppercase" }}>
            Profile
          </ThemedText>
          <ThemedText type="subtitle">Manage your account</ThemedText>
          <Card className="p-4">
            <ThemedText>Please sign in to view your profile.</ThemedText>
          </Card>
          <Button
            className="h-14 rounded-[18px]"
            onPress={() => router.push("/sign-in")}
            size="lg">
            <Text className="text-base font-bold">Sign in</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (currentUserQuery.isLoading && !currentUserQuery.data) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <ThemedText type="smallBold" style={{ color: theme.textSecondary, textTransform: "uppercase" }}>
            Profile
          </ThemedText>
          <Card className="p-4">
            <ActivityIndicator color={theme.text} size="large" />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary, textTransform: "uppercase" }}>
          Profile
        </ThemedText>
        <ThemedText type="subtitle">Manage your account</ThemedText>
        <ThemedText themeColor="textSecondary">
          Sign-out is still wired into Supabase session state and clears the auth queries.
        </ThemedText>

        <Card className="p-4">
          <ThemedText type="smallBold">Signed in as</ThemedText>
          <ThemedText>{currentUserQuery.data?.user.name ?? "Unnamed user"}</ThemedText>
          <ThemedText themeColor="textSecondary">
            {currentUserQuery.data?.user.email ?? "No email available"}
          </ThemedText>
        </Card>

        <Button
          className="h-14 rounded-[18px]"
          disabled={logoutMutation.isPending}
          onPress={() => logoutMutation.mutate()}
          size="lg">
          {logoutMutation.isPending ? (
            <ActivityIndicator color={theme.primaryForeground} size="small" />
          ) : null}
          <Text className="text-base font-bold">
            Sign out
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: 100,
  },
});
