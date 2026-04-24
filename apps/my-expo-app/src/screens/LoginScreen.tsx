import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SignInForm } from '@/components/sign-in-form';

type LoginScreenProps = {
  errorMessage?: string;
  isPending?: boolean;
  onSignUpPress?: () => void;
  onSubmit?: (payload: { email: string; password: string }) => void;
};

export function LoginScreen(_props: LoginScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <SignInForm onSignUpPress={_props.onSignUpPress} />
      </View>
    </SafeAreaView>
  );
}
