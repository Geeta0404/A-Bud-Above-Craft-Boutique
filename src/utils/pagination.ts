export function parsePagination(searchParams: URLSearchParams): { page: number; limit: number } {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  return { page, limit };
}
