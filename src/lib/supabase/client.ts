import { createBrowserClient } from "@supabase/ssr";

// Lets callers check before constructing a client, so a missing/misconfigured
// deployment degrades to "signed out" instead of throwing and crashing the page
// (createBrowserClient throws synchronously when the URL/key are unset).
export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
