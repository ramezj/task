import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useMyOrdersQuery } from "@/hooks/use-orders";
import { useSessionQuery } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

function formatOrderStatus(status: string) {
  if (status.length === 0) {
    return status;
  }

  return `${status[0].toUpperCase()}${status.slice(1)}`;
}

export default function OrdersScreen() {
  const theme = useTheme();
  const sessionQuery = useSessionQuery();
  const ordersQuery = useMyOrdersQuery(sessionQuery.data?.access_token);
  const orders = ordersQuery.data?.orders ?? [];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
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
        <View style={styles.header}>
          <ThemedText type="smallBold" style={styles.eyebrow}>
            Orders
          </ThemedText>
          <ThemedText type="subtitle">Track what you’ve ordered.</ThemedText>
        </View>

        {ordersQuery.isLoading && !ordersQuery.data ? (
          <View style={styles.stateContainer}>
            <ThemedText themeColor="textSecondary">Loading your orders...</ThemedText>
          </View>
        ) : null}

        {!ordersQuery.isLoading && ordersQuery.isError ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">Could not load your orders</ThemedText>
            <ThemedText themeColor="textSecondary">{ordersQuery.error.message}</ThemedText>
          </View>
        ) : null}

        {!ordersQuery.isLoading && !ordersQuery.isError && orders.length === 0 ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">No orders yet</ThemedText>
            <ThemedText themeColor="textSecondary">
              Your placed orders will appear here.
            </ThemedText>
          </View>
        ) : null}

        {!ordersQuery.isLoading && !ordersQuery.isError
          ? orders.map((order) => (
              <View
                key={order.id}
                style={[styles.orderCard, { borderColor: theme.backgroundElement }]}>
                <View style={styles.orderRow}>
                  <ThemedText type="smallBold">Order #{order.id.slice(0, 8)}</ThemedText>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: theme.backgroundElement,
                      },
                    ]}>
                    <ThemedText type="small">{formatOrderStatus(order.status)}</ThemedText>
                  </View>
                </View>

                <ThemedText themeColor="textSecondary" type="small">
                  {new Date(order.createdAt).toLocaleString()}
                </ThemedText>

                <View style={styles.orderSummary}>
                  <ThemedText themeColor="textSecondary">Items</ThemedText>
                  <ThemedText>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</ThemedText>
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
              </View>
            ))
          : null}
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
  header: {
    gap: Spacing.three,
  },
  eyebrow: {
    color: "#f59e0b",
    textTransform: "uppercase",
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.six,
  },
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
