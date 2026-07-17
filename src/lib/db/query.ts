import "server-only";
import type { QueryResultRow } from "pg";
import { pool } from "@/lib/db/pool";

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[db] ${Date.now() - start}ms rows=${result.rowCount} ${text}`);
    }
    return result.rows;
  } catch (error) {
    console.error(`[db] query failed: ${text}`, error);
    throw error;
  }
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export async function withTransaction<T>(
  fn: (client: import("pg").PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
