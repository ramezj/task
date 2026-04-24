function getRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config = {
  apiUrl: getRequiredEnv("EXPO_PUBLIC_API_URL", process.env.EXPO_PUBLIC_API_URL).replace(
    /\/+$/,
    ""
  ),
  supabaseUrl: getRequiredEnv("EXPO_PUBLIC_SUPABASE_URL", process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: getRequiredEnv(
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  ),
};
