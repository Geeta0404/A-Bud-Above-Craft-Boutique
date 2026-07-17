import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/utils/errors";
import { fail } from "@/utils/apiResponse";
import { logger } from "@/utils/logger";

// Wraps a Route Handler so every thrown AppError/ZodError/DB error maps to a
// consistent { success: false, error } JSON body instead of an unhandled 500.
export function withErrorHandler<Args extends unknown[]>(
  handler: (request: Request, ...args: Args) => Promise<NextResponse>
) {
  return async (request: Request, ...args: Args): Promise<NextResponse> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      if (error instanceof AppError) {
        return fail(error.message, error.status, error.code, error.details);
      }

      if (error instanceof ZodError) {
        return fail("Validation failed", 400, "VALIDATION_ERROR", error.flatten());
      }

      const pgError = error as { code?: string; constraint?: string };
      if (pgError?.code === "23505") {
        return fail("A record with this value already exists", 409, "CONFLICT", { constraint: pgError.constraint });
      }
      if (pgError?.code === "23503") {
        return fail("Related record not found", 400, "FOREIGN_KEY_VIOLATION", { constraint: pgError.constraint });
      }

      logger.error("Unhandled API error", { error: error instanceof Error ? error.message : String(error) });
      return fail("Internal server error", 500, "INTERNAL_ERROR");
    }
  };
}
