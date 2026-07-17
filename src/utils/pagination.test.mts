import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePagination } from "./pagination.ts";

test("defaults to page 1, limit 20 when unset", () => {
  assert.deepEqual(parsePagination(new URLSearchParams()), { page: 1, limit: 20 });
});

test("parses provided page and limit", () => {
  assert.deepEqual(parsePagination(new URLSearchParams("page=3&limit=50")), { page: 3, limit: 50 });
});

test("clamps limit to 100", () => {
  assert.equal(parsePagination(new URLSearchParams("limit=500")).limit, 100);
});

test("floors page and limit at 1 for zero/negative/non-numeric input", () => {
  assert.deepEqual(parsePagination(new URLSearchParams("page=0&limit=-5")), { page: 1, limit: 1 });
  assert.deepEqual(parsePagination(new URLSearchParams("page=abc")), { page: 1, limit: 20 });
});
