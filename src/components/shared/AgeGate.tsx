"use client";

import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const LOCAL_KEY = "aba-age-verified";
const SESSION_KEY = "aba-age-verified-session";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

type GateState = "checking" | "hidden" | "visible" | "rejected";

export function AgeGate() {
  const [state, setState] = useState<GateState>("checking");
  const [remember, setRemember] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const verified =
      localStorage.getItem(LOCAL_KEY) === "true" || sessionStorage.getItem(SESSION_KEY) === "true";
    setState(verified ? "hidden" : "visible");
  }, []);

  useEffect(() => {
    if (state === "visible" || state === "rejected") {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [state]);

  // Trap keyboard focus inside the dialog while it's open, so Tab can't
  // reach the rest of the site before the visitor answers the prompt.
  useEffect(() => {
    if (state !== "visible" && state !== "rejected") return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const first = getFocusable()[0];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      } else if (!dialog.contains(document.activeElement)) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state]);

  if (state === "checking" || state === "hidden") return null;

  const handleYes = () => {
    if (remember) localStorage.setItem(LOCAL_KEY, "true");
    else sessionStorage.setItem(SESSION_KEY, "true");
    setState("hidden");
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary p-4"
    >
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 text-center shadow-2xl sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <span className="font-logo text-2xl font-bold italic">Ab</span>
        </div>
        <p className="mt-3 font-logo text-2xl font-bold italic tracking-wide">A Bud Above</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Craft Boutique
        </p>

        {state === "rejected" ? (
          <>
            <p className="mt-6 text-sm text-muted-foreground">
              Sorry, you must be 19 years of age or older to visit this site.
            </p>
            <a
              href="https://www.google.com"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-muted px-6 text-sm font-semibold transition-colors hover:bg-muted/80"
            >
              Leave Site
            </a>
          </>
        ) : (
          <>
            <p className="mt-6 text-base font-medium">Are you over 19 years of age?</p>
            <div className="mt-6 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={handleYes}
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full border-2 border-foreground/10",
                  "bg-primary text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md",
                  "transition-transform hover:scale-105 active:scale-95"
                )}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setState("rejected")}
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full border-2 border-foreground/10",
                  "bg-primary text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md",
                  "transition-transform hover:scale-105 active:scale-95"
                )}
              >
                No
              </button>
            </div>
            <label className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
              Remember me
            </label>
          </>
        )}
      </div>
    </div>
  );
}
