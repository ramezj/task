import { router, useLocalSearchParams } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useSessionQuery } from "@/hooks/use-auth";
import { useMyOrdersQuery } from "@/hooks/use-orders";
import { useTheme } from "@/hooks/use-theme";

function formatOrderStatus(status: string) {
  if (status.length === 0) {
    return status;
  }

  return `${status[0].toUpperCase()}${status.slice(1)}`;
}

export default function OrderDetailsScreen() {
  const theme = useTheme();
  const sessionQuery = useSessionQuery();
  const ordersQuery = useMyOrdersQuery(sessionQuery.data?.access_token);
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
  const order = ordersQuery.data?.orders.find((entry) => entry.id === orderId);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={ordersQuery.refetch}
            refreshing={ordersQuery.isRefetching}
            tintColor={theme.text}
          />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.backButtonContainer}>
          <Button onPress={() => router.back()} variant="outline" size="sm">
            <Text>Back to Orders</Text>
          </Button>
        </View>

        <View style={styles.header}>
          <ThemedText type="smallBold" style={styles.eyebrow}>
            Orders
          </ThemedText>
          <ThemedText type="subtitle">Your order details.</ThemedText>
        </View>

        {ordersQuery.isLoading && !ordersQuery.data ? (
          <View style={styles.stateContainer}>
            <ThemedText themeColor="textSecondary">Loading order details...</ThemedText>
          </View>
        ) : null}

        {!ordersQuery.isLoading && ordersQuery.isError ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">Could not load order details</ThemedText>
            <ThemedText themeColor="textSecondary">{ordersQuery.error.message}</ThemedText>
          </View>
        ) : null}

        {!ordersQuery.isLoading && !ordersQuery.isError && !order ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">Order not found</ThemedText>
            <ThemedText themeColor="textSecondary">
              This order may not exist or no longer be available.
            </ThemedText>
          </View>
        ) : null}

        {order ? (
          <View style={[styles.card, { borderColor: theme.backgroundElement }]}>
            <View style={styles.headerRow}>
              <ThemedText type="smallBold">Order #{order.id.slice(0, 8)}</ThemedText>
              <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small">{formatOrderStatus(order.status)}</ThemedText>
              </View>
            </View>
            <ThemedText themeColor="textSecondary" type="small">
              {new Date(order.createdAt).toLocaleString()}
            </ThemedText>

            <View style={styles.summaryRow}>
              <ThemedText themeColor="textSecondary">Items</ThemedText>
              <ThemedText>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText themeColor="textSecondary">Total</ThemedText>
              <ThemedText type="smallBold">${order.totalAmount.toFixed(2)}</ThemedText>
            </View>

            <View style={styles.itemsContainer}>
              {order.items.map((item) => (
                <View key={item.id} style={[styles.itemCard, { borderColor: theme.backgroundElement }]}>
                  <View style={styles.itemRow}>
                    <ThemedText numberOfLines={1} style={styles.itemName} type="smallBold">
                      {item.productName ?? "Product"}
                    </ThemedText>
                    <ThemedText>${(item.quantity * item.unitPrice).toFixed(2)}</ThemedText>
                  </View>
                  <ThemedText themeColor="textSecondary" type="small">
                    Quantity: {item.quantity} x ${item.unitPrice.toFixed(2)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  backButtonContainer: {
    alignItems: "flex-start",
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.six,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemsContainer: {
    marginTop: Spacing.one,
    gap: Spacing.one,
  },
  itemCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.two,
    gap: Spacing.half,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },
  itemName: {
    flex: 1,
  },
  header: {
    gap: Spacing.three,
  },
  eyebrow: {
    color: "#000000",
    textTransform: "uppercase",
  },
});
