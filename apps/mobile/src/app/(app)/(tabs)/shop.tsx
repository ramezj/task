import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductCard } from "@/components/product-card";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useCurrentUserQuery, useSessionQuery } from "@/hooks/use-auth";
import { useProductsQuery } from "@/hooks/use-products";
import { useTheme } from "@/hooks/use-theme";

export default function ShopScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);
  const productsQuery = useProductsQuery();
  const user = currentUserQuery.data?.user;
  const products = productsQuery.data?.products ?? [];
  const cardWidth = Math.min(Math.max((width - Spacing.four * 2 - Spacing.two) / 2, 150), 240);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <FlatList
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.row}
        data={products}
        key={products.length > 0 ? "grid" : "empty"}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText type="smallBold" style={styles.emptyTitle}>
              {productsQuery.isLoading ? "Loading products..." : "No products yet"}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
              {productsQuery.isError
                ? productsQuery.error.message
                : "Once the API returns products, they will show up here in the catalog."}
            </ThemedText>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="smallBold" style={styles.eyebrow}>
              Shop
            </ThemedText>
            <ThemedText type="subtitle">
              Welcome back{user?.name ? `, ${user.name}` : ""}.
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.copy}>
              Browse the latest active products from your API catalog.
            </ThemedText>

            <View style={[styles.bannerCard, { borderColor: theme.backgroundElement }]}>
              <View style={styles.bannerText}>
                <ThemedText type="smallBold">Available now</ThemedText>
                <ThemedText themeColor="textSecondary">
                  {productsQuery.isLoading
                    ? "Syncing product catalog..."
                    : `${products.length} active product${products.length === 1 ? "" : "s"} loaded`}
                </ThemedText>
              </View>
              <ThemedText style={styles.bannerAccent}>
                {user?.email ?? "Signed in"}
              </ThemedText>
            </View>
          </View>
        }
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard product={item} width={cardWidth} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  eyebrow: {
    color: "#f59e0b",
    textTransform: "uppercase",
  },
  copy: {
    maxWidth: 480,
  },
  header: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  bannerCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  bannerText: {
    gap: Spacing.half,
  },
  bannerAccent: {
    fontSize: 13,
    color: "#f59e0b",
  },
  row: {
    justifyContent: "space-between",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  emptyState: {
    borderRadius: 24,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyCopy: {
    textAlign: "center",
    maxWidth: 320,
  },
});
