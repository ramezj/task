import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { AuthenticatedUser } from '@/lib/api';

type AuthenticatedScreenProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
  user: AuthenticatedUser;
};

export function AuthenticatedScreen({
  isLoggingOut,
  onLogout,
  user,
}: AuthenticatedScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <View className="gap-4 rounded-2xl border border-border bg-card p-5">
          <Text
            className="text-center text-foreground"
            style={{ fontSize: 40, lineHeight: 40, fontWeight: '700' }}
          >
            Signed In
          </Text>
          <View className="gap-2">
            <Text className="text-base text-muted-foreground">Name</Text>
            <Text className="text-lg font-medium text-foreground">{user.name ?? 'No name set'}</Text>
          </View>
          <View className="gap-2">
            <Text className="text-base text-muted-foreground">Email</Text>
            <Text className="text-lg font-medium text-foreground">
              {user.email ?? 'No email found'}
            </Text>
          </View>
          <Button className="h-12 bg-primary" disabled={isLoggingOut} onPress={onLogout}>
            <Text className="text-primary-foreground">
              {isLoggingOut ? 'Signing Out...' : 'Logout'}
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
