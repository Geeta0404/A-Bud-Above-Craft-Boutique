import "server-only";
import { DBSQLClient } from "@databricks/sql";

const table = `${process.env.DATABRICKS_CATALOG}.${process.env.DATABRICKS_SCHEMA}.products`;

export { table as productsTable };

export async function runQuery<T = Record<string, unknown>>(
  statement: string
): Promise<T[]> {
  const client = new DBSQLClient();

  await client.connect({
    host: process.env.DATABRICKS_SERVER_HOSTNAME!,
    path: process.env.DATABRICKS_HTTP_PATH!,
    token: process.env.DATABRICKS_TOKEN!,
  });

  try {
    const session = await client.openSession();
    const operation = await session.executeStatement(statement, {
      runAsync: true,
    });
    const result = (await operation.fetchAll()) as T[];
    await operation.close();
    await session.close();
    return result;
  } finally {
    await client.close();
  }
}

export function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}
