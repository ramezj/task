import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useCart } from "@/hooks/use-cart";
import { useProductQuery } from "@/hooks/use-products";
import { useTheme } from "@/hooks/use-theme";

function ProductDetailsSkeleton() {
  const theme = useTheme();

  return (
    <View style={styles.skeletonContainer}>
      <View style={[styles.skeletonImage, { backgroundColor: theme.backgroundElement }]} />
      <View style={[styles.skeletonLineLg, { backgroundColor: theme.backgroundElement }]} />
      <View style={[styles.skeletonLineMd, { backgroundColor: theme.backgroundElement }]} />
      <View style={[styles.skeletonLineSm, { backgroundColor: theme.backgroundElement }]} />
      <View style={[styles.skeletonBlock, { backgroundColor: theme.backgroundElement }]} />
    </View>
  );
}

export default function ProductDetailsScreen() {
  const theme = useTheme();
  const cart = useCart();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const productQuery = useProductQuery(productId);
  const product = productQuery.data?.product;
  const existingCartItem = product ? cart.items.find((item) => item.productId === product.id) : null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={productQuery.refetch}
            refreshing={productQuery.isRefetching}
            tintColor={theme.text}
          />
        }
        showsVerticalScrollIndicator={false}>
        {productQuery.isLoading && !product ? <ProductDetailsSkeleton /> : null}

        {!productQuery.isLoading && productQuery.isError ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">Could not load product</ThemedText>
            <ThemedText themeColor="textSecondary">{productQuery.error.message}</ThemedText>
          </View>
        ) : null}

        {!productQuery.isLoading && !productQuery.isError && !product ? (
          <View style={styles.stateContainer}>
            <ThemedText type="smallBold">Product not found</ThemedText>
            <ThemedText themeColor="textSecondary">
              This product may have been removed or is unavailable.
            </ThemedText>
          </View>
        ) : null}

        {product ? (
          <View style={styles.productContainer}>
            {product.imageUrl ? (
              <Image contentFit="cover" source={{ uri: product.imageUrl }} style={styles.image} />
            ) : (
              <View style={[styles.imageFallback, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText themeColor="textSecondary" type="smallBold">
                  No image
                </ThemedText>
              </View>
            )}

            <View style={styles.productInfo}>
              <ThemedText type="subtitle">{product.name}</ThemedText>
              <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
              {product.category ? (
                <View style={[styles.categoryBadge, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="small">{product.category.name}</ThemedText>
                </View>
              ) : null}
              <ThemedText themeColor="textSecondary" style={styles.description}>
                {product.description?.trim() || "No description available for this product yet."}
              </ThemedText>

              <Button
                className="h-14 rounded-[18px]"
                onPress={() =>
                  cart.addItem({
                    productId: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    price: product.price,
                  })
                }
                size="lg">
                {!cart.isHydrated ? (
                  <ActivityIndicator color={theme.primaryForeground} size="small" />
                ) : null}
                <Text className="text-base font-bold">
                  {existingCartItem
                    ? `Add another (in cart: ${existingCartItem.quantity})`
                    : "Add to cart"}
                </Text>
              </Button>
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
  },
  stateContainer: {
    gap: Spacing.one,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
  },
  productContainer: {
    gap: Spacing.three,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 24,
  },
  imageFallback: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    gap: Spacing.two,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  description: {
    lineHeight: 22,
  },
  skeletonContainer: {
    gap: Spacing.three,
  },
  skeletonImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 24,
  },
  skeletonLineLg: {
    height: 24,
    width: "70%",
    borderRadius: 999,
  },
  skeletonLineMd: {
    height: 20,
    width: "32%",
    borderRadius: 999,
  },
  skeletonLineSm: {
    height: 28,
    width: "38%",
    borderRadius: 999,
  },
  skeletonBlock: {
    height: 120,
    width: "100%",
    borderRadius: 16,
  },
});
