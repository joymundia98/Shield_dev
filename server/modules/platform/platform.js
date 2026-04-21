import { pool } from "../../server.js";

export const PlatformAdmin = {
  async create(data) {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      role_id,
      status = "active",
      is_super_admin = false,
    } = data;

    const result = await pool.query(
      `
      INSERT INTO platform_admins
      (first_name, last_name, email, password, phone, role_id, status, is_super_admin)
      VALUES ($1,$2,$3,$4,$5,$6,$7, $8)
      RETURNING *
      `,
      [
        first_name,
        last_name,
        email,
        password,
        phone,
        role_id,
        status,
        is_super_admin,
      ]
    );

    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM platform_admins WHERE email=$1`,
      [email]
    );
    return result.rows[0];
  },

    async getRoleNameById(role_id) {
    const result = await pool.query(
      `SELECT * FROM roles WHERE id = $1 or id = NULL`,
      [role_id]
    );
    return result.rows[0] || null;
  },

  async getAll() {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, phone, role_id, status, is_super_admin, created_at FROM platform_admins ORDER BY id DESC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM platform_admins WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of [
      "first_name",
      "last_name",
      "phone",
      "role_id",
      "status",
      "is_super_admin",
    ]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (!fields.length) return null;

    values.push(id);

    const result = await pool.query(
      `
      UPDATE platform_admins
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *
      `,
      values
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM platform_admins WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },
};