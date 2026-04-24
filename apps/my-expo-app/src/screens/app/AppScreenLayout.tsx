import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

type AppScreenLayoutProps = {
  children?: ReactNode;
  description: string;
  title: string;
};

export function AppScreenLayout({ children, description, title }: AppScreenLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-6">
        <View className="gap-2">
          <Text
            className="text-foreground"
            style={{ fontSize: 32, lineHeight: 36, fontWeight: '700' }}
          >
            {title}
          </Text>
          <Text className="text-base leading-6 text-muted-foreground">{description}</Text>
        </View>
        <View className="flex-1 pt-8">{children}</View>
      </View>
    </SafeAreaView>
  );
}
