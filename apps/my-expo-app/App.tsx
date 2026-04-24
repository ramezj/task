import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ScrollView
        className="flex-1 bg-black"
        contentContainerClassName="gap-6 bg-black py-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <Text className="text-xs font-semibold uppercase tracking-[2.8px] text-zinc-500">
            Auth Preview
          </Text>
          <Text className="mt-3 max-w-[280px] text-3xl font-black tracking-[-1.2px] text-white">
            Static login and register screen designs.
          </Text>
        </View>

        <View className="mx-4 overflow-hidden rounded-[36px] border border-white/10">
          <LoginScreen />
        </View>

        <View className="mx-4 overflow-hidden rounded-[36px] border border-white/10">
          <RegisterScreen />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
