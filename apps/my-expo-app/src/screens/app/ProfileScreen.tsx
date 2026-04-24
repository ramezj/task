import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { AuthenticatedUser } from '@/lib/api';
import { AppScreenLayout } from '@/screens/app/AppScreenLayout';

type ProfileScreenProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
  user: AuthenticatedUser;
};

export function ProfileScreen({ isLoggingOut, onLogout, user }: ProfileScreenProps) {
  return (
    <AppScreenLayout
      title="Profile"
      description="Account details and preferences will live here."
    >
      <View className="gap-4 rounded-2xl border border-border bg-card p-5">
        <View className="gap-2">
          <Text className="text-sm text-muted-foreground">Name</Text>
          <Text className="text-lg font-medium text-foreground">{user.name ?? 'No name set'}</Text>
        </View>
        <View className="gap-2">
          <Text className="text-sm text-muted-foreground">Email</Text>
          <Text className="text-lg font-medium text-foreground">
            {user.email ?? 'No email found'}
          </Text>
        </View>
        <Button className="mt-2 h-12 bg-primary" disabled={isLoggingOut} onPress={onLogout}>
          <Text className="text-primary-foreground">
            {isLoggingOut ? 'Signing Out...' : 'Logout'}
          </Text>
        </Button>
      </View>
    </AppScreenLayout>
  );
}
