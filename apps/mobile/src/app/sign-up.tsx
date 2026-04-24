import { Redirect, useRouter } from "expo-router";

import { AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/sign-up-form";
import { useCurrentUserQuery, useSessionQuery } from "@/hooks/use-auth";

export default function SignUpRoute() {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  if (currentUserQuery.data?.user) {
    return <Redirect href="/home" />;
  }

  return (
    <AuthShell
      eyebrow="Create Account"
      subtitle="Set up your Mini Shop profile and we will take care of the session state, token refresh, and protected routing."
      title="Join Mini Shop">
      <SignUpForm onLoginPress={() => router.replace("/sign-in")} />
    </AuthShell>
  );
}
