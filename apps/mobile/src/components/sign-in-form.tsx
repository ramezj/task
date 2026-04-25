import * as React from "react";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";

import type { LoginRequestData } from "@task/types/auth.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useLoginMutation } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";

type SignInFormProps = {
  onSignUpPress?: () => void;
};

export function SignInForm({ onSignUpPress }: SignInFormProps) {
  const router = useRouter();
  const theme = useTheme();
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
            <Input
              autoCapitalize="none"
              autoComplete="email"
              className="rounded-[18px] px-4"
              invalid={!!errors.email}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={onEmailSubmitEditing}
              placeholder="m@example.com"
              returnKeyType="next"
              value={value}
            />
          )}
        />
        {errors.email ? (
          <ThemedText style={{ color: theme.destructive }}>{errors.email.message}</ThemedText>
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
            <Input
              ref={passwordInputRef}
              className="rounded-[18px] px-4"
              invalid={!!errors.password}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholder="************"
              returnKeyType="send"
              secureTextEntry
              value={value}
            />
          )}
        />
        {errors.password ? (
          <ThemedText style={{ color: theme.destructive }}>{errors.password.message}</ThemedText>
        ) : null}
      </View>

      {loginMutation.error ? (
        <ThemedText style={{ color: theme.destructive }}>{loginMutation.error.message}</ThemedText>
      ) : null}

<Button
          className="h-14 rounded-[18px]"
          disabled={loginMutation.isPending}
          onPress={handleSubmit(onSubmit)}
          size="lg">
          {loginMutation.isPending ? (
            <ActivityIndicator color={theme.primaryForeground} size="small" />
          ) : (
            <Text className="text-base font-bold">
              Sign In
            </Text>
          )}
        </Button>

        <Pressable onPress={() => router.push("/forgot-password")}>
          <ThemedText style={{ color: theme.text }} type="small">
            Forgot password?
          </ThemedText>
        </Pressable>

        <View style={styles.footerRow}>
          <ThemedText themeColor="textSecondary" type="small">
            Don't have an account?
          </ThemedText>
          <Pressable onPress={onSignUpPress}>
            <ThemedText style={{ color: theme.text }} type="smallBold">
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
  errorText: {
    color: "#000000",
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
    color: "#000000",
  },
});
