import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { CheckIcon } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useSessionQuery } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { usePlaceOrderMutation } from "@/hooks/use-orders";
import { useTheme } from "@/hooks/use-theme";

function ConfirmOrderContent() {
  const theme = useTheme();
  const cart = useCart();
  const sessionQuery = useSessionQuery();
  const placeOrderMutation = usePlaceOrderMutation(sessionQuery.data?.access_token);
  const [isSuccess, setIsSuccess] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const totalItems = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items],
  );

  async function handleConfirmOrder() {
    if (placeOrderMutation.isPending || cart.items.length === 0) {
      return;
    }

    if (!sessionQuery.data?.access_token) {
      Alert.alert("Session missing", "Please sign in again to complete your checkout.");
      return;
    }

    try {
      await placeOrderMutation.mutateAsync({
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      scaleAnim.setValue(0.7);
      fadeAnim.setValue(0);
      setIsSuccess(true);
      cart.clearCart();

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 10,
          stiffness: 140,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not place order.";
      Alert.alert("Checkout failed", message);
    }
  }

  if (isSuccess) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.successContainer}>
          <Animated.View
            style={[
              styles.successBadge,
              {
                backgroundColor: theme.backgroundElement,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}>
            <CheckIcon color="#22c55e" size={62} strokeWidth={2.75} />
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim }}>
            <ThemedText style={styles.successTitle} type="subtitle">
              Order Placed Successfully!
            </ThemedText>
            <ThemedText style={styles.successCopy} themeColor="textSecondary">
              Your order is now being processed and will appear in your orders history.
            </ThemedText>
          </Animated.View>
          <Button className="h-14 rounded-[18px]" onPress={() => router.replace("/orders")} size="lg">
            <Text className="text-base font-bold">View My Orders</Text>
          </Button>
          <Button
            className="h-14 rounded-[18px]"
            onPress={() => router.replace("/shop")}
            size="lg"
            variant="outline">
            <Text className="text-base font-bold">Continue Shopping</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (cart.items.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.successContainer}>
          <ThemedText type="subtitle">Your cart is empty.</ThemedText>
          <ThemedText style={styles.successCopy} themeColor="textSecondary">
            Add products to continue checkout.
          </ThemedText>
          <Button className="h-14 rounded-[18px]" onPress={() => router.replace("/cart")} size="lg">
            <Text className="text-base font-bold">Back to Cart</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <FlatList
        contentContainerStyle={[styles.content, { paddingBottom: 140 }]}
        data={cart.items}
        keyExtractor={(item) => item.productId}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="smallBold" style={{ color: theme.textSecondary, textTransform: "uppercase" }}>
              Confirm Order
            </ThemedText>
            <ThemedText type="subtitle">Review & Checkout</ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.itemCard, { borderColor: theme.backgroundElement }]}>
            {item.imageUrl ? (
              <Image contentFit="cover" source={{ uri: item.imageUrl }} style={styles.itemImage} />
            ) : (
              <View style={[styles.itemImage, { backgroundColor: theme.backgroundElement }]} />
            )}
            <View style={styles.itemBody}>
              <ThemedText numberOfLines={2} type="smallBold">
                {item.name}
              </ThemedText>
              <ThemedText themeColor="textSecondary">
                {item.quantity} x ${item.price.toFixed(2)}
              </ThemedText>
              <ThemedText type="smallBold">${(item.quantity * item.price).toFixed(2)}</ThemedText>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
      <View style={[styles.checkoutContainer, { backgroundColor: theme.background }]}>
        <View style={styles.checkoutRow}>
          <ThemedText themeColor="textSecondary">Items ({totalItems})</ThemedText>
          <ThemedText type="smallBold">${cart.subtotal.toFixed(2)}</ThemedText>
        </View>
        <Button
          className="rounded-[18px] h-14"
          disabled={placeOrderMutation.isPending}
          onPress={handleConfirmOrder}
          size="lg"
          style={{ backgroundColor: "#22c55e" }}>
          {placeOrderMutation.isPending ? (
            <ActivityIndicator color={theme.primaryForeground} size="small" />
          ) : (
            <Text className="text-base font-bold" style={{ color: "#ffffff" }}>Confirm Order</Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}

export default function ConfirmOrderScreen() {
  const params = useLocalSearchParams<{ checkoutId?: string | string[] }>();
  const checkoutId = Array.isArray(params.checkoutId) ? params.checkoutId[0] : params.checkoutId;

  return <ConfirmOrderContent key={checkoutId ?? "confirm-order-default"} />;
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
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  itemCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.two,
    flexDirection: "row",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  itemImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
  },
  itemBody: {
    flex: 1,
    gap: Spacing.one,
  },
  checkoutContainer: {
    position: "absolute",
    bottom: 95,
    left: Spacing.four,
    right: Spacing.four,
    gap: Spacing.two,
    zIndex: 100,
  },
  checkoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  successCopy: {
    textAlign: "center",
    maxWidth: 280,
  },
});
