import { router } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, LinearTransition } from "react-native-reanimated";

import { OrderHistoryCard } from "@/components/order-history-card";
import { OrderCardSkeleton } from "@/components/order-card-skeleton";
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
  const refreshKey = ordersQuery.isRefetching ? Date.now() : 0;
  const skeletonItems = Array.from({ length: 3 }, (_, i) => `skeleton-${i}`);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <Animated.ScrollView
        layout={LinearTransition.duration(300)}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={ordersQuery.refetch}
            refreshing={ordersQuery.isRefetching}
            tintColor={theme.text}
          />
        }
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <ThemedText type="smallBold" style={styles.eyebrow}>
            Orders
          </ThemedText>
          <ThemedText type="subtitle">Your Order History</ThemedText>
        </Animated.View>

        {ordersQuery.isLoading && !ordersQuery.data ? (
          <View style={styles.skeletonContainer}>
            {skeletonItems.map((key, index) => (
              <Animated.View
                key={key}
                entering={FadeIn.delay(index * 100).duration(300)}
              >
                <OrderCardSkeleton />
              </Animated.View>
            ))}
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
          ? orders.map((order, index) => (
              <Animated.View
                key={`${order.id}-${refreshKey}`}
                entering={FadeIn.delay(index * 100).duration(300)}
              >
                <OrderHistoryCard
                  onPress={() => router.push(`/(app)/(tabs)/orders/${order.id}`)}
                  order={order}
                />
              </Animated.View>
            ))
          : null}
      </Animated.ScrollView>
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
    paddingBottom: 100,
  },
  header: {
    gap: Spacing.three,
  },
  eyebrow: {
    color: "#000000",
    textTransform: "uppercase",
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.six,
  },
  skeletonContainer: {
    gap: Spacing.two,
  },
});
