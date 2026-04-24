import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useCurrentUserQuery, useSessionQuery } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function ShopScreen() {
  const theme = useTheme();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);
  const user = currentUserQuery.data?.user;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <ThemedText type="smallBold" style={styles.eyebrow}>
          Shop
        </ThemedText>
        <ThemedText type="subtitle">Welcome back{user?.name ? `, ${user.name}` : ""}.</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.copy}>
          This is the signed-in landing tab. Your auth state, current-user query, and protected
          routing are all coming from the shared auth flow we ported over.
        </ThemedText>

        <View style={[styles.card, { borderColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">Signed in as</ThemedText>
          <ThemedText>{user?.email ?? "No email available"}</ThemedText>
        </View>
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
  copy: {
    maxWidth: 480,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.one,
  },
});
