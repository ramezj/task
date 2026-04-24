import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

type LoginScreenProps = {
  onSignUpPress: () => void;
};

export function LoginScreen({ onSignUpPress }: LoginScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <View className="gap-4">
          <Text
            className="text-center text-black"
            style={{ fontSize: 40, lineHeight: 40, fontWeight: '700' }}
          >
            Login
          </Text>
          <View className="gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              className="h-12 border-zinc-300 bg-white text-black"
            />
            <Input
              placeholder="Password"
              secureTextEntry
              className="h-12 border-zinc-300 bg-white text-black"
            />
            <Button className="h-12 bg-black">
              <Text className="text-white">Login</Text>
            </Button>
            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-zinc-600">New user?</Text>
              <Pressable onPress={onSignUpPress}>
                <Text className="text-sm text-black underline">Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
