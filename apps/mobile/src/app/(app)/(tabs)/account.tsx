import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import {
  useCurrentUserQuery,
  useLogoutMutation,
  useSessionQuery,
} from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function AccountScreen() {
  const theme = useTheme();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);
  const logoutMutation = useLogoutMutation();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <ThemedText type="subtitle">Account</ThemedText>
        <ThemedText themeColor="textSecondary">
          Sign-out is hooked into the shared Supabase session state and clears the auth queries.
        </ThemedText>

        <View style={[styles.card, { borderColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">Signed in as</ThemedText>
          <ThemedText>{currentUserQuery.data?.user.name ?? "Unnamed user"}</ThemedText>
          <ThemedText themeColor="textSecondary">
            {currentUserQuery.data?.user.email ?? "No email available"}
          </ThemedText>
        </View>

        <Pressable
          disabled={logoutMutation.isPending}
          onPress={() => logoutMutation.mutate()}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed || logoutMutation.isPending ? 0.82 : 1 },
          ]}>
          <ThemedText style={styles.buttonText}>
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </ThemedText>
        </Pressable>
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
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
