"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import type { User as FirebaseUser } from "firebase/auth";
import { signOut } from "firebase/auth";
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
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

function firstNameOf(user: FirebaseUser): string {
  const fromDisplayName = user.displayName?.split(" ")[0];
  if (fromDisplayName) return fromDisplayName;
  if (user.email) return user.email.split("@")[0];
  if (user.phoneNumber) return user.phoneNumber;
  return "there";
}

export function UserMenu() {
  const { user, loaded } = useFirebaseUser();
  // Keyed by uid so a stale check from a previous account never leaks
  // through — no synchronous reset needed when `user` goes null.
  const [adminCheck, setAdminCheck] = useState<{ uid: string; isAdmin: boolean } | null>(null);
  const router = useRouter();
  const hasGreeted = useRef(false);
  const previousUid = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      if (previousUid.current) hasGreeted.current = false;
      previousUid.current = null;
      return;
    }

    if (previousUid.current !== user.uid && !hasGreeted.current) {
      hasGreeted.current = true;
      toast.success(`Logged in successfully! Welcome, ${firstNameOf(user)}.`);
    }
    previousUid.current = user.uid;

    const uid = user.uid;
    user.getIdToken().then((idToken) =>
      fetch("/api/users/me", { headers: { Authorization: `Bearer ${idToken}` } })
        .then((res) => (res.ok ? res.json() : null))
        .then((body) => setAdminCheck({ uid, isAdmin: body?.data?.role === "admin" }))
        .catch(() => setAdminCheck({ uid, isAdmin: false }))
    );
  }, [user]);

  const isAdmin = adminCheck?.uid === user?.uid && (adminCheck?.isAdmin ?? false);

  const handleSignOut = async () => {
    await signOut(getFirebaseClientAuth());
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
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
