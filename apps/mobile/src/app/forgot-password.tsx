import { useState } from "react";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator } from "react-native";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

type FormData = {
  email: string;
};

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSuccessMessage("Password reset link sent to your email.");
  }

  if (successMessage) {
    return (
      <AuthShell eyebrow="Mini Shop" title="Check your email">
        <ThemedText style={{ color: theme.text }}>
          {successMessage}
        </ThemedText>
        <Button
          className="h-14 rounded-[18px]"
          onPress={() => router.replace("/sign-in")}
          size="lg">
          <Text className="text-base font-bold">Back to Sign In</Text>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Mini Shop"
      title="Forgot Password">
      <ThemedText themeColor="textSecondary">
        Enter your email and we'll send you a link to reset your password.
      </ThemedText>

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
            className="h-14 rounded-[18px] px-4"
            invalid={!!errors.email}
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="m@example.com"
            returnKeyType="done"
            value={value}
          />
        )}
      />
      {errors.email ? (
        <ThemedText style={{ color: theme.destructive }}>{errors.email.message}</ThemedText>
      ) : null}

      <Button
        className="h-14 rounded-[18px]"
        disabled={isLoading}
        onPress={handleSubmit(onSubmit)}
        size="lg">
        {isLoading ? (
          <ActivityIndicator color={theme.primaryForeground} size="small" />
        ) : (
          <Text className="text-base font-bold">Send Reset Link</Text>
        )}
      </Button>

      <Button
        className="h-14 rounded-[18px]"
        onPress={() => router.push("/sign-in")}
        size="lg">
        <Text className="text-base font-bold">Back to Sign In</Text>
      </Button>
    </AuthShell>
  );
}