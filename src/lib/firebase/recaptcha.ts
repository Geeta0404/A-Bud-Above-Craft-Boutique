"use client";

import { RecaptchaVerifier } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase/client";

let verifier: RecaptchaVerifier | null = null;

// Firebase phone auth requires one invisible reCAPTCHA bound to a container
// element; reused across sign-in attempts instead of recreated each time.
export function getRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(getFirebaseClientAuth(), containerId, { size: "invisible" });
  }
  return verifier;
}
