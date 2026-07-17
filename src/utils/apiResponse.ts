import { NextResponse } from "next/server";
import type { ApiFailure, ApiSuccess, PaginationMeta } from "@/types/api";

export function ok<T>(data: T, status = 200, meta?: PaginationMeta): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) }, { status });
}

export function created<T>(data: T): NextResponse<ApiSuccess<T>> {
  return ok(data, 201);
}

export function fail(message: string, status: number, code: string, details?: unknown): NextResponse<ApiFailure> {
  return NextResponse.json({ success: false, error: { message, code, details } }, { status });
}
