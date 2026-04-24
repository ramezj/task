import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <ThemedText type="smallBold" style={styles.eyebrow}>
          Profile
        </ThemedText>
        <ThemedText type="subtitle">Manage your account.</ThemedText>
        <ThemedText themeColor="textSecondary">
          Sign-out is still wired into Supabase session state and clears the auth queries.
        </ThemedText>

        <View style={[styles.card, { borderColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">Signed in as</ThemedText>
          <ThemedText>{currentUserQuery.data?.user.name ?? "Unnamed user"}</ThemedText>
          <ThemedText themeColor="textSecondary">
            {currentUserQuery.data?.user.email ?? "No email available"}
          </ThemedText>
        </View>

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
  },
  eyebrow: {
    color: "#f59e0b",
    textTransform: "uppercase",
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.one,
  },
});
