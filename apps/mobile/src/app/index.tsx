import { Redirect } from "expo-router";

import { useCurrentUserQuery, useSessionQuery } from "@/hooks/use-auth";

export default function IndexRoute() {
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  if (currentUserQuery.data?.user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/sign-in" />;
}
