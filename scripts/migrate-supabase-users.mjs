// One-time migration: Supabase (GoTrue) auth.users -> Firebase Authentication.
//
// Supabase hashes passwords with bcrypt, which Firebase's importUsers() accepts
// natively (hash.algorithm: 'BCRYPT'), so password logins migrate without a
// forced reset. Google-only accounts (no password) import as email/uid only —
// Firebase links their Google sign-in to the same account by email afterwards.
//
// NOT run automatically. Usage:
//   node --env-file=.env.local scripts/migrate-supabase-users.mjs --dry-run
//   node --env-file=.env.local scripts/migrate-supabase-users.mjs --limit=5
//   node --env-file=.env.local scripts/migrate-supabase-users.mjs
//
// Requires SUPABASE_DB_URL (Supabase Dashboard > Project Settings > Database >
// Connection string) and the Firebase Admin env vars already used elsewhere
// in this project (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY).

import pg from "pg";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const { Pool } = pg;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. Check .env.local.`);
  return value;
}

function getFirebaseAuth() {
  const projectId = requireEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requireEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return getAuth(app);
}

async function fetchSupabaseUsers(pool, limit) {
  const { rows: users } = await pool.query(
    `SELECT id, email, encrypted_password, email_confirmed_at, phone, phone_confirmed_at, raw_user_meta_data
     FROM auth.users
     ORDER BY created_at ASC
     ${limit ? `LIMIT ${Number(limit)}` : ""}`
  );

  const { rows: identities } = await pool.query(
    `SELECT user_id, provider FROM auth.identities WHERE user_id = ANY($1)`,
    [users.map((u) => u.id)]
  );
  const providersByUser = new Map();
  for (const row of identities) {
    const list = providersByUser.get(row.user_id) ?? [];
    list.push(row.provider);
    providersByUser.set(row.user_id, list);
  }

  return users.map((u) => ({ ...u, providers: providersByUser.get(u.id) ?? [] }));
}

function toImportRecord(user) {
  const meta = user.raw_user_meta_data ?? {};
  const displayName =
    meta.first_name || meta.last_name
      ? [meta.first_name, meta.last_name].filter(Boolean).join(" ")
      : meta.full_name || meta.name || undefined;

  const record = {
    uid: user.id,
    email: user.email ?? undefined,
    emailVerified: Boolean(user.email_confirmed_at),
    displayName,
  };

  if (user.phone) {
    record.phoneNumber = user.phone.startsWith("+") ? user.phone : `+${user.phone}`;
  }

  // BCRYPT needs no separate salt/rounds — the hash string carries both.
  if (user.encrypted_password && user.encrypted_password.startsWith("$2")) {
    record.passwordHash = Buffer.from(user.encrypted_password, "utf8");
  }

  return record;
}

async function main() {
  const supabasePool = new Pool({ connectionString: requireEnv("SUPABASE_DB_URL") });

  let users;
  try {
    users = await fetchSupabaseUsers(supabasePool, limit);
  } finally {
    await supabasePool.end();
  }

  console.log(`Found ${users.length} Supabase user(s)${limit ? ` (limited to ${limit})` : ""}.`);

  const records = users.map(toImportRecord);
  const withPassword = records.filter((r) => r.passwordHash).length;
  console.log(`  - ${withPassword} with a password hash to import`);
  console.log(`  - ${records.length - withPassword} without a password (Google-only, etc.)`);

  if (dryRun) {
    console.log("\n--dry-run: no changes made. Sample records:");
    console.log(
      JSON.stringify(
        records.slice(0, 5).map((r) => ({ ...r, passwordHash: r.passwordHash ? "<bcrypt hash present>" : undefined })),
        null,
        2
      )
    );
    return;
  }

  const auth = getFirebaseAuth();
  const BATCH_SIZE = 1000;
  let totalSuccess = 0;
  let totalFailure = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const result = await auth.importUsers(batch, { hash: { algorithm: "BCRYPT" } });
    totalSuccess += result.successCount;
    totalFailure += result.failureCount;

    for (const failure of result.errors) {
      const failed = batch[failure.index];
      console.error(`  FAILED: ${failed.email ?? failed.uid} — ${failure.error.message}`);
    }
  }

  console.log(`\nDone. Imported ${totalSuccess} user(s), ${totalFailure} failure(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
