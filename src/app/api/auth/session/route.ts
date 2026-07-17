import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyIdToken } from "@/lib/firebase/verifyIdToken";
import { SESSION_COOKIE } from "@/lib/firebase/session";

// Matches a Firebase ID token's own lifetime; the client re-POSTs on every
// onIdTokenChanged refresh (roughly hourly) to keep this current.
const MAX_AGE_SECONDS = 60 * 60;

const bodySchema = z.object({ idToken: z.string().min(1) });

export async function POST(request: Request) {
  const { idToken } = bodySchema.parse(await request.json());

  try {
    await verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ success: false, error: { message: "Invalid ID token" } }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
