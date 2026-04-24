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
import { useLoginMutation } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { LoginRequestData } from '@task/types/auth.js';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, type TextInput, View } from 'react-native';

type SignInFormProps = {
  onSignUpPress?: () => void;
};

export function SignInForm({ onSignUpPress }: SignInFormProps) {
  const passwordInputRef = React.useRef<TextInput>(null);
  const loginMutation = useLoginMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestData>({
    defaultValues: {
      email: '',
      password: '',
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
    <View className="gap-6">
      <Card className="border-border bg-card shadow-sm shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Sign in to your Mini Shop</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
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
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() => {
                    // TODO: Navigate to forgot password screen
                  }}>
                  <Text className="font-normal leading-4">Forgot your password?</Text>
                </Button>
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
            {loginMutation.error ? (
              <Text className="text-sm text-destructive">{loginMutation.error.message}</Text>
            ) : null}
            <Button
              className={cn('w-full', loginMutation.isPending && 'opacity-70')}
              disabled={loginMutation.isPending}
              onPress={handleSubmit(onSubmit)}
            >
              <Text>{loginMutation.isPending ? 'Signing in...' : 'Continue'}</Text>
            </Button>
          </View>
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-sm">Don&apos;t have an account?</Text>
            <Pressable onPress={onSignUpPress}>
              <Text className="text-sm underline underline-offset-4">Sign up</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
