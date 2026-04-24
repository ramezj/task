import * as SecureStore from "expo-secure-store";
import type { Session } from "@supabase/supabase-js";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const ACCESS_TOKEN_EXPIRY_KEY = "auth.accessTokenExpiry";

export async function storeSessionAccessToken(session: Session | null) {
  if (!session?.access_token || !session.expires_at) {
    await clearStoredSessionAccessToken();
    return;
  }

  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.access_token),
    SecureStore.setItemAsync(ACCESS_TOKEN_EXPIRY_KEY, String(session.expires_at)),
  ]);
}

export async function clearStoredSessionAccessToken() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRY_KEY),
  ]);
}

export async function getStoredSessionAccessToken() {
  const [accessToken, expiresAt] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(ACCESS_TOKEN_EXPIRY_KEY),
  ]);

  return {
    accessToken,
    expiresAt: expiresAt ? Number(expiresAt) : null,
  };
}
