import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Fonts, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";

type AuthShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}>;

export function AuthShell({ children, eyebrow, footer, subtitle, title }: AuthShellProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: theme.background }}>

        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.eyebrow}>{eyebrow}</ThemedText>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </ThemedText>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}>
            {children}
          </View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  content: {
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.two,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: "#000000",
    fontFamily: Fonts.mono,
  },
  title: {
    maxWidth: 420,
  },
  subtitle: {
    maxWidth: 420,
  },
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: Spacing.four,
  },
  footer: {
    paddingTop: Spacing.one,
  },
});
