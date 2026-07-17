"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { getFirebaseClientAuth } from "@/lib/firebase/client";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(getFirebaseClientAuth());
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    router.push("/login");
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
