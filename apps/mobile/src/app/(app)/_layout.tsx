import { Redirect, Slot } from "expo-router";

import { useCurrentUserQuery, useSessionQuery } from "@/hooks/use-auth";

export default function ProtectedAppLayout() {
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  if (!sessionQuery.data || !currentUserQuery.data?.user) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
