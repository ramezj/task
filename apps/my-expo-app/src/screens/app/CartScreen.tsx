import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { AppScreenLayout } from '@/screens/app/AppScreenLayout';

export function CartScreen() {
  return (
    <AppScreenLayout
      title="Cart"
      description="Items added to the cart will appear here."
    >
      <View className="rounded-2xl border border-border bg-card p-5">
        <Text className="text-base text-muted-foreground">Your cart is empty.</Text>
      </View>
    </AppScreenLayout>
  );
}
