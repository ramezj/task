import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/screens/AuthShell';

export function RegisterScreen() {
  return (
    <AuthShell
      eyebrow="New Account"
      title="Create your profile in one clean pass."
      subtitle="A compact onboarding screen designed to feel calm, direct, and ready for real product wiring later."
      footer={
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-sm text-zinc-400">Already registered?</Text>
          <Text className="text-sm font-semibold text-white">Sign in</Text>
        </View>
      }
    >
      <View className="gap-5">
        <View className="gap-1.5">
          <Text className="text-sm font-medium text-zinc-300">Full name</Text>
          <Input
            editable={false}
            placeholder="Ramez Joseph"
            placeholderTextColor="#71717a"
            value=""
            className="h-14 rounded-2xl border-white/12 bg-white/6 px-4 text-base text-white"
          />
        </View>

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
          <Text className="text-sm font-medium text-zinc-300">Password</Text>
          <Input
            editable={false}
            placeholder="Create a strong password"
            placeholderTextColor="#71717a"
            secureTextEntry
            value=""
            className="h-14 rounded-2xl border-white/12 bg-white/6 px-4 text-base text-white"
          />
        </View>

        <View className="gap-3 pt-2">
          <Button size="lg" className="h-14 rounded-2xl bg-white">
            <Text className="text-base font-semibold text-zinc-950">Create Account</Text>
          </Button>

          <Text className="px-2 text-center text-sm leading-6 text-zinc-400">
            By continuing, you agree to the terms, privacy policy, and the product updates you
            choose to receive later.
          </Text>
        </View>
      </View>
    </AuthShell>
  );
}
