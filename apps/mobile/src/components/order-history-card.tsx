import type { Order } from "@task/types/order.js";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type OrderHistoryCardProps = {
  order: Order;
  onPress?: () => void;
};

function formatOrderStatus(status: string) {
  if (status.length === 0) {
    return status;
  }

  return `${status[0].toUpperCase()}${status.slice(1)}`;
}

export function OrderHistoryCard({ order, onPress }: OrderHistoryCardProps) {
  const theme = useTheme();
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.orderCard, { borderColor: theme.backgroundElement }]}>
      <View style={styles.orderRow}>
        <ThemedText type="smallBold">Order #{order.id.slice(0, 8)}</ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="small">{formatOrderStatus(order.status)}</ThemedText>
        </View>
      </View>

      <ThemedText themeColor="textSecondary" type="small">
        {new Date(order.createdAt).toLocaleString()}
      </ThemedText>

      <View style={styles.orderSummary}>
        <ThemedText themeColor="textSecondary">Items</ThemedText>
        <ThemedText>{itemCount}</ThemedText>
      </View>
      <View style={styles.orderSummary}>
        <ThemedText themeColor="textSecondary">Total</ThemedText>
        <ThemedText type="smallBold">${order.totalAmount.toFixed(2)}</ThemedText>
      </View>

      <View style={styles.itemList}>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <ThemedText numberOfLines={1} style={styles.itemName}>
              {item.productName ?? "Product"}
            </ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              {item.quantity} x ${item.unitPrice.toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemList: {
    marginTop: Spacing.one,
    gap: Spacing.one,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  itemName: {
    flex: 1,
  },
});
