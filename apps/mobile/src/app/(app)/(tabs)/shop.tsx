import { useDeferredValue, useMemo, useState } from "react";
import { router } from "expo-router";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spacing } from "@/constants/theme";
import { useCurrentUserQuery, useSessionQuery } from "@/hooks/use-auth";
import { useProductsQuery } from "@/hooks/use-products";
import { useTheme } from "@/hooks/use-theme";

export default function ShopScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const deferredSearchInput = useDeferredValue(searchInput);
  const trimmedSearch = deferredSearchInput.trim();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);
  const categorySourceQuery = useProductsQuery();
  const productsQuery = useProductsQuery({
    category: selectedCategory,
    search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
  });
  const user = currentUserQuery.data?.user;
  const products = productsQuery.data?.products ?? [];
  const refreshKey = productsQuery.isRefetching ? Date.now() : 0;

  const categoryOptions = useMemo(() => {
    const categories = new Map<string, string>();

    for (const product of categorySourceQuery.data?.products ?? []) {
      if (product.category) {
        categories.set(product.category.slug, product.category.name);
      }
    }

    return Array.from(categories.entries())
      .map(([value, label]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [categorySourceQuery.data?.products]);
  const cardWidth = Math.min(Math.max((width - Spacing.four * 2 - Spacing.two) / 2, 150), 240);
  const isFiltering = Boolean(selectedCategory || trimmedSearch.length > 0);
  const isInitialLoading =
    (productsQuery.isLoading && !productsQuery.data) ||
    (categorySourceQuery.isLoading && !categorySourceQuery.data);
  const skeletonItems = Array.from({ length: 6 }, (_, index) => `skeleton-${index}`);

  async function handleRefresh() {
    await Promise.all([productsQuery.refetch(), categorySourceQuery.refetch()]);
  }

return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <Animated.FlatList
        layout={LinearTransition.duration(300)}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.row}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={isInitialLoading ? skeletonItems as any : products}
        key={`${isInitialLoading ? "skeleton" : products.length > 0 ? "grid" : "empty"}-${refreshKey}`}
        keyExtractor={(item) => (typeof item === "string" ? item : item.id)}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="smallBold" style={{ color: theme.textSecondary, textTransform: "uppercase" }}>
              Shop
            </ThemedText>
            <ThemedText type="subtitle">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </ThemedText>
            <View style={styles.filters}>
              <Input
                className="h-14 px-4"
                style={{
                  fontSize: 16,
                }}
                onChangeText={setSearchInput}
                placeholder="Search products"
                returnKeyType="search"
                value={searchInput}
              />
              <Select
                onValueChange={setSelectedCategory}
                options={categoryOptions}
                placeholder="All categories"
                value={selectedCategory}
              />
            </View>

            {isFiltering ? (
              <View style={styles.activeFilters}>
                <ThemedText themeColor="textSecondary" type="small">
                  {selectedCategory
                    ? categoryOptions.find((option) => option.value === selectedCategory)?.label
                    : "All categories"}
                  {trimmedSearch ? ` · "${trimmedSearch}"` : ""}
                </ThemedText>
                <Pressable
                  onPress={() => {
                    setSearchInput("");
                    setSelectedCategory(undefined);
                  }}>
                  <ThemedText style={{ color: theme.text }} type="smallBold">
                    Clear filters
                  </ThemedText>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText type="smallBold" style={styles.emptyTitle}>
              {productsQuery.isError
                ? "Could not load products"
                : isFiltering
                  ? "No products match these filters"
                  : "No products yet"}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
              {productsQuery.isError
                ? productsQuery.error.message
                : isFiltering
                  ? "Try a different category or clear the search term."
                  : "Once the API returns products, they will show up here in the catalog."}
            </ThemedText>
            {isFiltering && !productsQuery.isError ? (
              <Pressable
                onPress={() => {
                  setSearchInput("");
                  setSelectedCategory(undefined);
                }}
                style={[
                  styles.emptyButton,
                  { backgroundColor: theme.backgroundElement },
                ]}>
                <ThemedText type="smallBold">Reset filters</ThemedText>
              </Pressable>
            ) : null}
          </View>
        }
        numColumns={2}
        renderItem={({ item, index }) => (
          isInitialLoading ? (
            <ProductCardSkeleton width={cardWidth} />
          ) : (
            <Animated.View
              entering={FadeIn.delay(index * 100).duration(300)}
            >
              <ProductCard
                onPress={() => router.push(`/product/${(item as (typeof products)[number]).id}`)}
                product={item as (typeof products)[number]}
                width={cardWidth}
              />
            </Animated.View>
          )
        )}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefresh}
            refreshing={productsQuery.isRefetching || categorySourceQuery.isRefetching}
            tintColor={theme.text}
          />
        }
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
    paddingBottom: 100,
    gap: Spacing.three,
    flexGrow: 1,
  },
  header: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  bannerText: {
    gap: Spacing.half,
  },
  bannerAccent: {
    fontSize: 13,
  },
  filters: {
    gap: Spacing.two,
  },
  activeFilters: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
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
  emptyButton: {
    marginTop: Spacing.two,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
