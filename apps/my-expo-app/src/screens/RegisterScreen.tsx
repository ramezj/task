import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SignUpForm } from '@/components/sign-up-form';

type RegisterScreenProps = {
  errorMessage?: string;
  isPending?: boolean;
  onLoginPress?: () => void;
  onSubmit?: (payload: { email: string; name: string; password: string }) => void;
  successMessage?: string;
};

export function RegisterScreen(_props: RegisterScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <SignUpForm onLoginPress={_props.onLoginPress} />
      </View>
    </SafeAreaView>
  );
}
