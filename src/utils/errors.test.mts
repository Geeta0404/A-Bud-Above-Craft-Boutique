import { test } from "node:test";
import assert from "node:assert/strict";
import { AppError, NotFoundError, ValidationError, ConflictError, UnauthorizedError, ForbiddenError } from "./errors.ts";

test("NotFoundError sets a 404 status and NOT_FOUND code", () => {
  const error = new NotFoundError("Product");
  assert.equal(error.status, 404);
  assert.equal(error.code, "NOT_FOUND");
  assert.equal(error.message, "Product not found");
  assert.ok(error instanceof AppError);
});

test("ValidationError carries optional details", () => {
  const error = new ValidationError("Bad input", { field: "email" });
  assert.equal(error.status, 400);
  assert.equal(error.code, "VALIDATION_ERROR");
  assert.deepEqual(error.details, { field: "email" });
});

test("ConflictError sets a 409 status", () => {
  assert.equal(new ConflictError("duplicate").status, 409);
});

test("UnauthorizedError defaults to a generic message", () => {
  const error = new UnauthorizedError();
  assert.equal(error.status, 401);
  assert.equal(error.message, "Authentication required");
});

test("ForbiddenError defaults to a generic message", () => {
  const error = new ForbiddenError();
  assert.equal(error.status, 403);
  assert.equal(error.message, "You do not have permission to perform this action");
});
