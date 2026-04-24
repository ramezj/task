import { Redirect, useRouter } from "expo-router";

import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/sign-in-form";
import { useCurrentUserQuery, useSessionQuery } from "@/hooks/use-auth";

export default function SignInRoute() {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  if (currentUserQuery.data?.user) {
    return <Redirect href="/home" />;
  }

  return (
    <AuthShell
      eyebrow="Mini Shop"
      subtitle="Welcome back. Sign in to keep shopping, track your orders, and manage your account."
      title="Sign in to your account">
      <SignInForm onSignUpPress={() => router.push("/sign-up")} />
    </AuthShell>
  );
}
