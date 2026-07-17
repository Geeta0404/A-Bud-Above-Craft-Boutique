import { NextResponse, type NextRequest } from "next/server";
import { verifySessionCookie, SESSION_COOKIE } from "@/lib/firebase/session";
import { UserRepository } from "@/repositories/UserRepository";

// Runs on the Node.js runtime by default in Next.js 16, so verifying the
// Firebase session cookie here (via firebase-admin) works without a
// separate Edge-compatible path.
export async function proxy(request: NextRequest) {
  const decoded = await verifySessionCookie(request.cookies.get(SESSION_COOKIE)?.value);
  const user = decoded ? await UserRepository.findByFirebaseUid(decoded.uid) : null;

  if (!user || user.role !== "admin") {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
