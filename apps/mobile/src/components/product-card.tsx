import { Image } from "expo-image";
import type { Product } from "@task/types/product.js";
import { Pressable, StyleSheet, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { ThemedText } from "@/components/themed-text";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ProductCardProps = {
  product: Product;
  width: number;
  onPress?: () => void;
};

export function ProductCard({ product, width, onPress }: ProductCardProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={{ width }}>
      <View
        style={[
          styles.card,
          {
            borderColor: theme.backgroundElement,
            backgroundColor: theme.background,
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
              <Badge variant="default">
                <Text>{product.category.name}</Text>
              </Badge>
            ) : null}
          </View>

          <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
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
    padding: Spacing.four,
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
  price: {
    fontSize: 18,
    fontWeight: "800",
  },
});
