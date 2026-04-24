import { Redirect, useRouter } from 'expo-router';

import { useCurrentUserQuery, useSessionQuery } from '@/hooks/useAuth';
import { RegisterScreen } from '@/screens/RegisterScreen';

export default function SignUpRoute() {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  if (currentUserQuery.data?.user) {
    return <Redirect href="/(tabs)/products" />;
  }

  return <RegisterScreen onLoginPress={() => router.replace('/sign-in')} />;
}
