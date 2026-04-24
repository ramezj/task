import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { AppScreenLayout } from '@/screens/app/AppScreenLayout';

export function ProductsScreen() {
  return (
    <AppScreenLayout
      title="Products"
      description="Your product catalog will live here."
    >
      <View className="rounded-2xl border border-border bg-card p-5">
        <Text className="text-base text-muted-foreground">No products yet.</Text>
      </View>
    </AppScreenLayout>
  );
}
