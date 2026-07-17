import "server-only";
import { query, queryOne } from "@/lib/db/query";
import type { User, UserProfileInput, UserRole } from "@/types/user";
import type { PaginatedResult } from "@/types/api";

type UserRow = {
  id: number;
  firebase_uid: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: UserRole;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
};

function mapRow(row: UserRow): User {
  return {
    id: row.id,
    firebaseUid: row.firebase_uid,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    role: row.role,
    isEmailVerified: row.is_email_verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const UserRepository = {
  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const row = await queryOne<UserRow>("SELECT * FROM users WHERE firebase_uid = $1", [firebaseUid]);
    return row ? mapRow(row) : null;
  },

  async findById(id: number): Promise<User | null> {
    const row = await queryOne<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
    return row ? mapRow(row) : null;
  },

  async upsertFromFirebase(params: {
    firebaseUid: string;
    email: string;
    isEmailVerified: boolean;
    firstName?: string | null;
    lastName?: string | null;
  }): Promise<User> {
    const row = await queryOne<UserRow>(
      `INSERT INTO users (firebase_uid, email, first_name, last_name, is_email_verified)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (firebase_uid) DO UPDATE SET
         email = EXCLUDED.email,
         is_email_verified = EXCLUDED.is_email_verified
       RETURNING *`,
      [params.firebaseUid, params.email, params.firstName ?? null, params.lastName ?? null, params.isEmailVerified]
    );
    return mapRow(row!);
  },

  async updateProfile(id: number, input: UserProfileInput): Promise<User | null> {
    const row = await queryOne<UserRow>(
      `UPDATE users SET
         first_name = COALESCE($2, first_name),
         last_name = COALESCE($3, last_name),
         phone = COALESCE($4, phone)
       WHERE id = $1
       RETURNING *`,
      [id, input.firstName, input.lastName, input.phone]
    );
    return row ? mapRow(row) : null;
  },

  async updateRole(id: number, role: UserRole): Promise<User | null> {
    const row = await queryOne<UserRow>(
      "UPDATE users SET role = $2 WHERE id = $1 RETURNING *",
      [id, role]
    );
    return row ? mapRow(row) : null;
  },

  async list(page = 1, limit = 20): Promise<PaginatedResult<User>> {
    const offset = (page - 1) * limit;
    const [rows, countRow] = await Promise.all([
      query<UserRow>("SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]),
      queryOne<{ count: string }>("SELECT COUNT(*) AS count FROM users"),
    ]);
    const total = Number(countRow?.count ?? 0);
    return {
      items: rows.map(mapRow),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  },
};
