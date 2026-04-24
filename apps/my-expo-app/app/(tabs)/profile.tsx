import { Redirect } from 'expo-router';

import { useCurrentUserQuery, useLogoutMutation, useSessionQuery } from '@/hooks/useAuth';
import { ProfileScreen } from '@/screens/app/ProfileScreen';

export default function ProfileRoute() {
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);
  const logoutMutation = useLogoutMutation();

  if (!currentUserQuery.data?.user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <ProfileScreen
      isLoggingOut={logoutMutation.isPending}
      onLogout={() => logoutMutation.mutate()}
      user={currentUserQuery.data.user}
    />
  );
}
