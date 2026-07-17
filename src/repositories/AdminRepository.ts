import { queryOne } from "@/lib/db/query";

export const AdminRepository = {
  async findByUid(uid: string) {
    return queryOne(
      `
      SELECT *
      FROM admins
      WHERE firebase_uid = $1
      AND is_active = true
      `,
      [uid]
    );
  },
};