"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

function firstNameOf(user: SupabaseUser): string {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const fromMeta =
    (meta?.first_name as string | undefined) ||
    (meta?.full_name as string | undefined)?.split(" ")[0] ||
    (meta?.name as string | undefined)?.split(" ")[0];
  if (fromMeta) return fromMeta;
  if (user.email) return user.email.split("@")[0];
  if (user.phone) return user.phone;
  return "there";
}

export function UserMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoaded(true);
      return;
    }
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoaded(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user && !hasGreeted.current) {
        hasGreeted.current = true;
        toast.success(`Logged in successfully! Welcome, ${firstNameOf(session.user)}.`);
      }

      if (event === "SIGNED_OUT") {
        hasGreeted.current = false;
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!loaded || !user) {
    return (
      <Button variant="ghost" size="icon" className="h-11 w-11" asChild aria-label="Login">
        <Link href="/login">
          <User className="size-6" />
        </Link>
      </Button>
    );
  }

  const isAdmin = user.app_metadata?.role === "admin";
  const name = firstNameOf(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-11 w-11" aria-label={`Account: ${name}`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {name.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Hi, {name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/products">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
