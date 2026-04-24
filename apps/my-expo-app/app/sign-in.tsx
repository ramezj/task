import { Redirect, useRouter } from 'expo-router';

import { useCurrentUserQuery, useSessionQuery } from '@/hooks/useAuth';
import { LoginScreen } from '@/screens/LoginScreen';

export default function SignInRoute() {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  if (currentUserQuery.data?.user) {
    return <Redirect href="/(tabs)/products" />;
  }

  return <LoginScreen onSignUpPress={() => router.push('/sign-up')} />;
}
