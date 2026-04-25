import { Feather } from "@expo/vector-icons";
import * as React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange: (value: string | undefined) => void;
};

export function Select({
  onValueChange,
  options,
  placeholder = "Select an option",
  value,
}: SelectProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.value === value);

  function handleSelect(nextValue?: string) {
    onValueChange(nextValue);
    setOpen(false);
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}>
        <View style={styles.triggerText}>
          <ThemedText style={{ color: theme.text }}>
            {selectedOption?.label ?? placeholder}
          </ThemedText>
        </View>
        <Feather color={theme.text} name="chevron-down" size={18} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}>
            <View style={styles.sheetHeader}>
              <ThemedText type="smallBold">Filter by category</ThemedText>
              <Pressable onPress={() => setOpen(false)}>
                <ThemedText style={styles.closeText}>Close</ThemedText>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <SelectRow
                isSelected={value === undefined}
                label="All categories"
                onPress={() => handleSelect(undefined)}
              />
              {options.map((option) => (
                <SelectRow
                  key={option.value}
                  isSelected={option.value === value}
                  label={option.label}
                  onPress={() => handleSelect(option.value)}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

type SelectRowProps = {
  isSelected: boolean;
  label: string;
  onPress: () => void;
};

function SelectRow({ isSelected, label, onPress }: SelectRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: isSelected ? theme.backgroundElement : "transparent",
        },
      ]}>
      <ThemedText>{label}</ThemedText>
      {isSelected ? <Feather color={theme.text} name="check" size={16} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  triggerText: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
    padding: Spacing.three,
  },
  sheet: {
    borderWidth: 1,
    borderRadius: 14,
    maxHeight: "65%",
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  closeText: {
    color: "#000000",
  },
  row: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
});
