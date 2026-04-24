import { Image } from "expo-image";
import type { Product } from "@task/types/product.js";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ProductCardProps = {
  product: Product;
  width: number;
};

export function ProductCard({ product, width }: ProductCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.backgroundElement,
          backgroundColor: theme.background,
          width,
        },
      ]}>
      {product.imageUrl ? (
        <Image
          contentFit="cover"
          source={{ uri: product.imageUrl }}
          style={styles.image}
        />
      ) : (
        <View
          style={[
            styles.imageFallback,
            { backgroundColor: theme.backgroundElement },
          ]}>
          <ThemedText themeColor="textSecondary" type="smallBold">
            No image
          </ThemedText>
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <ThemedText numberOfLines={2} style={styles.productName}>
            {product.name}
          </ThemedText>
          {product.category ? (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: theme.backgroundElement },
              ]}>
              <ThemedText type="small">{product.category.name}</ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  imageFallback: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    gap: Spacing.one,
  },
  productName: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
  },
});
