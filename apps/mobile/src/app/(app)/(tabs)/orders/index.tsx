import { router } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";

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
  const skeletonItems = Array.from({ length: 3 }, (_, i) => `skeleton-${i}`);

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
        <View style={styles.header}>
          <ThemedText type="smallBold" style={{ color: theme.textSecondary, textTransform: "uppercase" }}>
            Orders
          </ThemedText>
          <ThemedText type="subtitle">Your Order History</ThemedText>
        </View>

        {!sessionQuery.data ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">Please sign in</ThemedText>
            <ThemedText themeColor="textSecondary">
              Sign in to view your orders.
            </ThemedText>
          </View>
        ) : ordersQuery.isLoading && !ordersQuery.data ? (
          <View style={styles.skeletonContainer}>
            {skeletonItems.map((key) => (
              <OrderCardSkeleton key={key} />
            ))}
          </View>
        ) : ordersQuery.isError ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">Could not load your orders</ThemedText>
            <ThemedText themeColor="textSecondary">{ordersQuery.error.message}</ThemedText>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">No orders yet</ThemedText>
            <ThemedText themeColor="textSecondary">
              Your placed orders will appear here.
            </ThemedText>
          </View>
        ) : (
          orders.map((order, index) => (
            <Animated.View key={order.id} entering={FadeIn.delay(index * 100).duration(300)}>
              <OrderHistoryCard
                onPress={() => router.push(`/(app)/(tabs)/orders/${order.id}`)}
                order={order}
              />
            </Animated.View>
          ))
        )}
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
    paddingBottom: 100,
  },
  header: {
    gap: Spacing.three,
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
