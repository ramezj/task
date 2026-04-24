import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import type { RegisterRequestData } from "@task/types/auth.js";

import { Spacing } from "@/constants/theme";
import { useRegisterMutation } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";

type SignUpFormProps = {
  onLoginPress?: () => void;
};

export function SignUpForm({ onLoginPress }: SignUpFormProps) {
  const theme = useTheme();
  const isDark = useColorScheme() !== "light";
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const registerMutation = useRegisterMutation();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequestData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit(values: RegisterRequestData) {
    setSuccessMessage(null);

    const result = await registerMutation.mutateAsync({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
    });

    if (result.requiresEmailConfirmation) {
      setSuccessMessage(result.message);
    }
  }

  const inputStyle = [
    styles.input,
    {
      color: theme.text,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#f8fafc",
      borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.1)",
    },
  ];

  const placeholderTextColor = isDark ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.38)";

  return (
    <View style={styles.container}>
      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold">Name</ThemedText>
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Name is required.",
            maxLength: {
              value: 80,
              message: "Name must be 80 characters or less.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={onNameSubmitEditing}
              placeholder="John Doe"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              style={inputStyle}
              value={value}
            />
          )}
        />
        {errors.name ? <ThemedText style={styles.errorText}>{errors.name.message}</ThemedText> : null}
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold">Email</ThemedText>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required.",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Enter a valid email address.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              ref={emailInputRef}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={onEmailSubmitEditing}
              placeholder="m@example.com"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              style={inputStyle}
              value={value}
            />
          )}
        />
        {errors.email ? (
          <ThemedText style={styles.errorText}>{errors.email.message}</ThemedText>
        ) : null}
      </View>

      <View style={styles.fieldGroup}>
        <View style={styles.inlineLabel}>
          <ThemedText type="smallBold">Password</ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            8-72 characters
          </ThemedText>
        </View>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters.",
            },
            maxLength: {
              value: 72,
              message: "Password must be 72 characters or less.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              ref={passwordInputRef}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholder="************"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="send"
              secureTextEntry
              style={inputStyle}
              value={value}
            />
          )}
        />
        {errors.password ? (
          <ThemedText style={styles.errorText}>{errors.password.message}</ThemedText>
        ) : null}
      </View>

      {successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null}

      {registerMutation.error ? (
        <ThemedText style={styles.errorText}>{registerMutation.error.message}</ThemedText>
      ) : null}

      <Pressable
        disabled={registerMutation.isPending}
        onPress={handleSubmit(onSubmit)}
        style={({ pressed }) => [
          styles.primaryButton,
          { opacity: pressed || registerMutation.isPending ? 0.82 : 1 },
        ]}>
        <ThemedText style={styles.primaryButtonText}>
          {registerMutation.isPending ? "Creating account..." : "Continue"}
        </ThemedText>
      </Pressable>

      <View style={styles.footerRow}>
        <ThemedText themeColor="textSecondary" type="small">
          Already have an account?
        </ThemedText>
        <Pressable onPress={onLoginPress}>
          <ThemedText style={styles.linkText} type="smallBold">
            Sign in
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  inlineLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    lineHeight: 20,
  },
  successText: {
    color: "#16a34a",
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#111827",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
  },
  linkText: {
    color: "#f59e0b",
  },
});
