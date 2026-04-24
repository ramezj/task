import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import type { LoginRequestData } from "@task/types/auth.js";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useLoginMutation } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";

type SignInFormProps = {
  onSignUpPress?: () => void;
};

export function SignInForm({ onSignUpPress }: SignInFormProps) {
  const theme = useTheme();
  const isDark = useColorScheme() !== "light";
  const passwordInputRef = React.useRef<TextInput>(null);
  const loginMutation = useLoginMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit(values: LoginRequestData) {
    loginMutation.mutate({
      email: values.email.trim(),
      password: values.password,
    });
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
            8+ characters
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

      {loginMutation.error ? (
        <ThemedText style={styles.errorText}>{loginMutation.error.message}</ThemedText>
      ) : null}

      <Button
        className="h-14 rounded-[18px]"
        disabled={loginMutation.isPending}
        onPress={handleSubmit(onSubmit)}
        size="lg">
        {loginMutation.isPending ? (
          <ActivityIndicator color={theme.primaryForeground} size="small" />
        ) : null}
        <Text className="text-base font-bold">
          Sign In
        </Text>
      </Button>

      <View style={styles.footerRow}>
        <ThemedText themeColor="textSecondary" type="small">
          Don't have an account?
        </ThemedText>
        <Pressable onPress={onSignUpPress}>
          <ThemedText style={styles.linkText} type="smallBold">
            Sign up
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
