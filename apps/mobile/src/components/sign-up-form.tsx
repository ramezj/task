import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import type { RegisterRequestData } from "@task/types/auth.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useRegisterMutation } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/themed-text";

type SignUpFormProps = {
  onLoginPress?: () => void;
};

export function SignUpForm({ onLoginPress }: SignUpFormProps) {
  const theme = useTheme();
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
            <Input
              autoCapitalize="words"
              className="h-14 rounded-[18px] px-4"
              invalid={!!errors.name}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={onNameSubmitEditing}
              placeholder="John Doe"
              returnKeyType="next"
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
            <Input
              ref={emailInputRef}
              autoCapitalize="none"
              autoComplete="email"
              className="h-14 rounded-[18px] px-4"
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
            <Input
              ref={passwordInputRef}
              className="h-14 rounded-[18px] px-4"
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
          <ThemedText style={styles.errorText}>{errors.password.message}</ThemedText>
        ) : null}
      </View>

      {successMessage ? <ThemedText style={styles.successText}>{successMessage}</ThemedText> : null}

      {registerMutation.error ? (
        <ThemedText style={styles.errorText}>{registerMutation.error.message}</ThemedText>
      ) : null}

      <Button
        className="h-14 rounded-[18px]"
        disabled={registerMutation.isPending}
        onPress={handleSubmit(onSubmit)}
        size="lg">
        {registerMutation.isPending ? (
          <ActivityIndicator color={theme.primaryForeground} size="small" />
        ) : null}
        <Text className="text-base font-bold">
          Sign Up
        </Text>
      </Button>

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
