import { Redirect, useRouter } from "expo-router";

import { AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/sign-up-form";
import { useCurrentUserQuery, useSessionQuery } from "@/hooks/use-auth";

export default function SignUpRoute() {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const currentUserQuery = useCurrentUserQuery(sessionQuery.data);

  if (currentUserQuery.data?.user) {
    return <Redirect href="/shop" />;
  }

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Sign Up">
      <SignUpForm onLoginPress={() => router.replace("/sign-in")} />
    </AuthShell>
  );
}
