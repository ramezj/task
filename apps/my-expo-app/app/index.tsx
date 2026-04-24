import { Redirect } from 'expo-router';

import { useCurrentUserQuery, useSessionQuery } from '@/hooks/useAuth';

export default function IndexRoute() {
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  if (currentUserQuery.data?.user) {
    return <Redirect href="/(tabs)/products" />;
  }

  return <Redirect href="/sign-in" />;
}
