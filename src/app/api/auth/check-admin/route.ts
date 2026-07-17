import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAuth } from "@/lib/firebase/firebase-admin";
import { AdminRepository } from "@/repositories/AdminRepository";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { isAdmin: false },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = await getFirebaseAuth().verifyIdToken(token);

    const admin = await AdminRepository.findByUid(decoded.uid);

    return NextResponse.json({
      isAdmin: !!admin,
    });
  } catch {
    return NextResponse.json(
      { isAdmin: false },
      { status: 401 }
    );
  }
}