import type { Order } from "@task/types/order.js";
import { Pressable, StyleSheet, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Text } from "./ui/text";

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
    <Pressable onPress={onPress}>
      <Card className="p-4" style={{ borderColor: theme.backgroundElement }}>
        <View style={styles.orderRow}>
          <ThemedText type="smallBold">Order #{order.id.slice(0, 8)}</ThemedText>
          <Badge variant="default">
            <Text>{formatOrderStatus(order.status)}</Text>
          </Badge>
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
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
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
