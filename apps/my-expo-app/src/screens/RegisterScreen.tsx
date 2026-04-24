import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

type RegisterScreenProps = {
  onLoginPress: () => void;
};

export function RegisterScreen({ onLoginPress }: RegisterScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <View className="gap-4">
          <Text
            className="text-center text-black"
            style={{ fontSize: 40, lineHeight: 40, fontWeight: '700' }}
          >
            Sign Up
          </Text>
          <View className="gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
            <Input
              autoCapitalize="none"
              placeholder="Name"
              className="h-12 border-zinc-300 bg-white text-black"
            />
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
              <Text className="text-white">Sign Up</Text>
            </Button>
            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-zinc-600">Already have an account?</Text>
              <Pressable onPress={onLoginPress}>
                <Text className="text-sm text-black underline">Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
