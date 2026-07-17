import { NextResponse } from "next/server";
import { getFirebaseStorageBucket } from "@/lib/firebase/firebase-admin";
import { requireAdmin } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `products/${crypto.randomUUID()}.${ext}`;

  const bucket = getFirebaseStorageBucket();
  const storageFile = bucket.file(path);

  try {
    await storageFile.save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      resumable: false,
    });
    await storageFile.makePublic();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ url: `https://storage.googleapis.com/${bucket.name}/${path}` });
}
