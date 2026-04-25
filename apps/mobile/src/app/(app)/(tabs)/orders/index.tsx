import { router } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OrderHistoryCard } from "@/components/order-history-card";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useMyOrdersQuery } from "@/hooks/use-orders";
import { useSessionQuery } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

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
              <OrderHistoryCard
                key={order.id}
                onPress={() => router.push(`/(app)/(tabs)/orders/${order.id}`)}
                order={order}
              />
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
});
