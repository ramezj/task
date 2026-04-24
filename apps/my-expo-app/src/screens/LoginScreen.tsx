import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/screens/AuthShell';

export function LoginScreen() {
  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign in and pick up where you left off."
      subtitle="A quiet, focused entry point for your mobile workspace. No extra chrome, just the essentials."
      footer={
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-sm text-zinc-400">Need an account?</Text>
          <Text className="text-sm font-semibold text-white">Create one</Text>
        </View>
      }
    >
      <View className="gap-5">
        <View className="gap-1.5">
          <Text className="text-sm font-medium text-zinc-300">Email</Text>
          <Input
            autoCapitalize="none"
            editable={false}
            keyboardType="email-address"
            placeholder="name@example.com"
            placeholderTextColor="#71717a"
            value=""
            className="h-14 rounded-2xl border-white/12 bg-white/6 px-4 text-base text-white"
          />
        </View>

        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-zinc-300">Password</Text>
            <Text className="text-sm text-zinc-400">Forgot?</Text>
          </View>
          <Input
            editable={false}
            placeholder="Enter your password"
            placeholderTextColor="#71717a"
            secureTextEntry
            value=""
            className="h-14 rounded-2xl border-white/12 bg-white/6 px-4 text-base text-white"
          />
        </View>

        <View className="gap-3 pt-2">
          <Button size="lg" className="h-14 rounded-2xl bg-amber-400">
            <Text className="text-base font-semibold text-zinc-950">Sign In</Text>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-14 rounded-2xl border-white/12 bg-transparent"
          >
            <Text className="text-base font-semibold text-white">Continue with Google</Text>
          </Button>
        </View>
      </View>
    </AuthShell>
  );
}
