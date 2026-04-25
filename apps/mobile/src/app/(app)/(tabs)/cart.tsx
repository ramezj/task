import { Image } from "expo-image";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useCart } from "@/hooks/use-cart";
import { useTheme } from "@/hooks/use-theme";

export default function CartScreen() {
  const theme = useTheme();
  const cart = useCart();

  function handleCheckout() {
    if (cart.items.length === 0) {
      return;
    }

    router.push({
      pathname: "/(app)/(tabs)/confirm-order",
      params: {
        checkoutId: Date.now().toString(),
      },
    });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <FlatList
        contentContainerStyle={[styles.content, { paddingBottom: 140 }]}
        data={cart.items}
        keyExtractor={(item) => item.productId}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText type="smallBold" style={{ fontSize: 18 }}>Your cart is empty</ThemedText>
            <ThemedText themeColor="textSecondary">
              Add products from the shop to get started
            </ThemedText>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="smallBold" style={{ color: theme.textSecondary, textTransform: "uppercase" }}>
              Cart
            </ThemedText>
            <ThemedText type="subtitle">Your Cart</ThemedText>
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
              <ThemedText themeColor="textSecondary">${item.price.toFixed(2)} each</ThemedText>
              <View style={styles.itemActions}>
                <View style={styles.qtyControls}>
                  <Pressable
                    onPress={() => cart.setQuantity(item.productId, item.quantity - 1)}
                    style={[styles.qtyButton, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="smallBold">-</ThemedText>
                  </Pressable>
                  <ThemedText>{item.quantity}</ThemedText>
                  <Pressable
                    onPress={() => cart.setQuantity(item.productId, item.quantity + 1)}
                    style={[styles.qtyButton, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="smallBold">+</ThemedText>
                  </Pressable>
                </View>
                <Pressable onPress={() => cart.removeItem(item.productId)}>
                  <ThemedText style={{ color: theme.text }} type="smallBold">
                    Remove
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
      {cart.items.length > 0 ? (
        <View style={[styles.checkoutContainer, { backgroundColor: theme.background }]}>
          <View style={styles.checkoutRow}>
            <ThemedText themeColor="textSecondary">Items ({cart.totalItems})</ThemedText>
            <ThemedText type="smallBold">${cart.subtotal.toFixed(2)}</ThemedText>
          </View>
          <Button
            className="rounded-[18px] h-14"
            disabled={!cart.isHydrated}
            onPress={handleCheckout}
            size="lg">
            <Text className="text-base font-bold">Checkout</Text>
          </Button>
        </View>
      ) : null}
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
    flexGrow: 1,
  },
  header: {
    gap: Spacing.three,
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
  itemImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
  },
  itemBody: {
    flex: 1,
    gap: Spacing.one,
  },
  itemActions: {
    marginTop: Spacing.one,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.one,
    minHeight: 300,
  },
});
