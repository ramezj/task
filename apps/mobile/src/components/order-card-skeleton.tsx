import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export function OrderCardSkeleton() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.border,
          backgroundColor: theme.card,
        },
      ]}>
      <View style={styles.header}>
        <View style={[styles.lineLg, { backgroundColor: theme.backgroundElement }]} />
        <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]} />
      </View>
      <View style={[styles.lineSm, { backgroundColor: theme.backgroundElement }]} />
      <View style={styles.summary}>
        <View style={[styles.lineSm, { backgroundColor: theme.backgroundElement }]} />
        <View style={[styles.lineSm, { backgroundColor: theme.backgroundElement }]} />
      </View>
      <View style={styles.items}>
        <View style={[styles.itemRow, { backgroundColor: theme.backgroundElement }]} />
        <View style={[styles.itemRow, { backgroundColor: theme.backgroundElement }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lineLg: {
    height: 18,
    width: 100,
    borderRadius: 999,
  },
  lineSm: {
    height: 14,
    width: 120,
    borderRadius: 999,
  },
  badge: {
    height: 24,
    width: 70,
    borderRadius: 999,
  },
  summary: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  items: {
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  itemRow: {
    height: 16,
    width: "100%",
    borderRadius: 999,
  },
});