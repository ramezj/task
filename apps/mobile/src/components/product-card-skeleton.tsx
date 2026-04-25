import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ProductCardSkeletonProps = {
  width: number;
};

export function ProductCardSkeleton({ width }: ProductCardSkeletonProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          width,
          borderColor: theme.border,
          backgroundColor: theme.card,
        },
      ]}>
      <View style={[styles.image, { backgroundColor: theme.backgroundElement }]} />
      <View style={styles.body}>
        <View style={[styles.lineLg, { backgroundColor: theme.backgroundElement }]} />
        <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]} />
        <View style={[styles.lineSm, { backgroundColor: theme.backgroundElement }]} />
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
  body: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  lineLg: {
    height: 18,
    width: "82%",
    borderRadius: 999,
  },
  badge: {
    height: 24,
    width: "44%",
    borderRadius: 999,
  },
  lineSm: {
    height: 18,
    width: "36%",
    borderRadius: 999,
  },
});
