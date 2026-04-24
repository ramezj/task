import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { AppScreenLayout } from '@/screens/app/AppScreenLayout';

export function OrdersScreen() {
  return (
    <AppScreenLayout
      title="Orders"
      description="Order history and status updates will appear here."
    >
      <View className="rounded-2xl border border-border bg-card p-5">
        <Text className="text-base text-muted-foreground">No orders yet.</Text>
      </View>
    </AppScreenLayout>
  );
}
