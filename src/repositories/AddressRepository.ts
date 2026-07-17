import "server-only";
import { query, queryOne, withTransaction } from "@/lib/db/query";
import type { Address, AddressInput } from "@/types/user";

type AddressRow = {
  id: number;
  user_id: number;
  label: string | null;
  full_name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

function mapRow(row: AddressRow): Address {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.label,
    fullName: row.full_name,
    phone: row.phone,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    province: row.province,
    postalCode: row.postal_code,
    country: row.country,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const AddressRepository = {
  async listByUser(userId: number): Promise<Address[]> {
    const rows = await query<AddressRow>(
      "SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC",
      [userId]
    );
    return rows.map(mapRow);
  },

  async findById(id: number): Promise<Address | null> {
    const row = await queryOne<AddressRow>("SELECT * FROM addresses WHERE id = $1", [id]);
    return row ? mapRow(row) : null;
  },

  async create(userId: number, input: AddressInput): Promise<Address> {
    return withTransaction(async (client) => {
      if (input.isDefault) {
        await client.query("UPDATE addresses SET is_default = FALSE WHERE user_id = $1", [userId]);
      }
      const result = await client.query<AddressRow>(
        `INSERT INTO addresses
           (user_id, label, full_name, phone, line1, line2, city, province, postal_code, country, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, 'Canada'), COALESCE($11, FALSE))
         RETURNING *`,
        [
          userId,
          input.label ?? null,
          input.fullName,
          input.phone ?? null,
          input.line1,
          input.line2 ?? null,
          input.city,
          input.province,
          input.postalCode,
          input.country,
          input.isDefault,
        ]
      );
      return mapRow(result.rows[0]);
    });
  },

  async update(id: number, userId: number, input: Partial<AddressInput>): Promise<Address | null> {
    return withTransaction(async (client) => {
      if (input.isDefault) {
        await client.query("UPDATE addresses SET is_default = FALSE WHERE user_id = $1", [userId]);
      }
      const result = await client.query<AddressRow>(
        `UPDATE addresses SET
           label = COALESCE($3, label),
           full_name = COALESCE($4, full_name),
           phone = COALESCE($5, phone),
           line1 = COALESCE($6, line1),
           line2 = COALESCE($7, line2),
           city = COALESCE($8, city),
           province = COALESCE($9, province),
           postal_code = COALESCE($10, postal_code),
           country = COALESCE($11, country),
           is_default = COALESCE($12, is_default)
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [
          id,
          userId,
          input.label,
          input.fullName,
          input.phone,
          input.line1,
          input.line2,
          input.city,
          input.province,
          input.postalCode,
          input.country,
          input.isDefault,
        ]
      );
      return result.rows[0] ? mapRow(result.rows[0]) : null;
    });
  },

  async delete(id: number, userId: number): Promise<boolean> {
    const rows = await query("DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
    return rows.length > 0;
  },
};
