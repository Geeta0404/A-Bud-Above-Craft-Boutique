"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function GoogleSignInButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        // Always show Google's account chooser instead of silently reusing the last session.
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      disabled={loading}
      onClick={handleClick}
      className="w-full justify-center gap-2"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.56-5.17 3.56-8.65z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.3v3.09C3.26 21.3 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.29 14.3A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.39-2.3V6.61H1.3A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.3 5.39l3.99-3.09z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.61l3.99 3.09C6.23 6.86 8.88 4.75 12 4.75z"
        />
      </svg>
      {loading ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}
