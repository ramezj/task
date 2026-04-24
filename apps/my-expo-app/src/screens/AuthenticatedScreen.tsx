import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import type { AuthenticatedUser } from '@/lib/api';
import { CartScreen } from '@/screens/app/CartScreen';
import { OrdersScreen } from '@/screens/app/OrdersScreen';
import { ProductsScreen } from '@/screens/app/ProductsScreen';
import { ProfileScreen } from '@/screens/app/ProfileScreen';
import { cn } from '@/lib/utils';

type AuthenticatedScreenProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
  user: AuthenticatedUser;
};

type AppTab = 'products' | 'cart' | 'orders' | 'profile';

const APP_TABS: { key: AppTab; label: string }[] = [
  { key: 'products', label: 'Products' },
  { key: 'cart', label: 'Cart' },
  { key: 'orders', label: 'Orders' },
  { key: 'profile', label: 'Profile' },
];

export function AuthenticatedScreen({
  isLoggingOut,
  onLogout,
  user,
}: AuthenticatedScreenProps) {
  const [activeTab, setActiveTab] = useState<AppTab>('products');

  const renderTab = () => {
    switch (activeTab) {
      case 'cart':
        return <CartScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'profile':
        return <ProfileScreen isLoggingOut={isLoggingOut} onLogout={onLogout} user={user} />;
      case 'products':
      default:
        return <ProductsScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-1">{renderTab()}</View>
        <View className="border-t border-border bg-card px-3 pb-4 pt-3">
          <View className="flex-row items-center justify-between gap-2">
            {APP_TABS.map((tab) => {
              const isActive = tab.key === activeTab;

              return (
                <Pressable
                  key={tab.key}
                  className={cn(
                    'flex-1 items-center rounded-2xl px-2 py-3',
                    isActive && 'bg-secondary'
                  )}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text
                    className={cn(
                      'text-xs font-medium text-muted-foreground',
                      isActive && 'text-secondary-foreground'
                    )}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
