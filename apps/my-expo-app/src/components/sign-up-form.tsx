import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useRegisterMutation } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { RegisterRequestData } from '@task/types/auth.js';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, TextInput, View } from 'react-native';

type SignUpFormProps = {
  onLoginPress?: () => void;
};

export function SignUpForm({ onLoginPress }: SignUpFormProps) {
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
      name: '',
      email: '',
      password: '',
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
    <View className="gap-6">
      <Card className="border-border bg-card shadow-sm shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: 'Name is required.',
                  maxLength: {
                    value: 80,
                    message: 'Name must be 80 characters or less.',
                  },
                }}
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    id="name"
                    autoCapitalize="words"
                    invalid={!!errors.name}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onNameSubmitEditing}
                    placeholder="John Doe"
                    returnKeyType="next"
                    submitBehavior="submit"
                    value={value}
                  />
                )}
              />
              {errors.name ? (
                <Text className="text-sm text-destructive">{errors.name.message}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required.',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Enter a valid email address.',
                  },
                }}
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    ref={emailInputRef}
                    id="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    invalid={!!errors.email}
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onEmailSubmitEditing}
                    placeholder="m@example.com"
                    returnKeyType="next"
                    submitBehavior="submit"
                    value={value}
                  />
                )}
              />
              {errors.email ? (
                <Text className="text-sm text-destructive">{errors.email.message}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
              </View>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required.',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters.',
                  },
                  maxLength: {
                    value: 72,
                    message: 'Password must be 72 characters or less.',
                  },
                }}
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    ref={passwordInputRef}
                    id="password"
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
                <Text className="text-sm text-destructive">{errors.password.message}</Text>
              ) : null}
            </View>
            {successMessage ? (
              <Text className="text-sm text-emerald-600">{successMessage}</Text>
            ) : null}
            {registerMutation.error ? (
              <Text className="text-sm text-destructive">{registerMutation.error.message}</Text>
            ) : null}
            <Button
              className={cn('w-full', registerMutation.isPending && 'opacity-70')}
              disabled={registerMutation.isPending}
              onPress={handleSubmit(onSubmit)}
            >
              <Text>{registerMutation.isPending ? 'Creating account...' : 'Continue'}</Text>
            </Button>
          </View>
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-sm">Already have an account?</Text>
            <Pressable onPress={onLoginPress}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
