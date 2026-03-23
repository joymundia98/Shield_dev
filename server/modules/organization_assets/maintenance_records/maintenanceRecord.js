import { pool } from "../../../server.js";

export const MaintenanceRecord = {

  // ✅ CREATE (with organization_id)
  async create(data) {
    const {
      asset_id,
      category_id,
      last_service,
      next_service,
      status,
      organization_id
    } = data;

    const result = await pool.query(
      `
      INSERT INTO maintenance_records
      (asset_id, category_id, last_service, next_service, status, organization_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        asset_id,
        category_id,
        last_service,
        next_service,
        status,
        organization_id
      ]
    );

    return result.rows[0];
  },

  // ✅ GET ALL (scoped to organization)
  async getAll(organization_id) {
    const result = await pool.query(
      `
      SELECT * 
      FROM maintenance_records 
      WHERE organization_id = $1
      ORDER BY id ASC
      `,
      [organization_id]
    );

    return result.rows;
  },

  // ✅ GET BY ID (already correct)
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM maintenance_records WHERE id=$1 AND organization_id=$2`,
      [id, organization_id]
    );
    return result.rows[0];
  },

  // ✅ UPDATE (safe + scoped)
  async update(id, organization_id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    const allowedFields = [
      "asset_id",
      "category_id",
      "last_service",
      "next_service",
      "status"
    ];

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (!fields.length) return null;

    values.push(id, organization_id);

    const result = await pool.query(
      `
      UPDATE maintenance_records
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i} AND organization_id = $${i + 1}
      RETURNING *
      `,
      values
    );

    return result.rows[0] || null;
  },

  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM maintenance_records WHERE id=$1 AND organization_id=$2 RETURNING *`,
      [id, organization_id]
    );

    return result.rows[0];
  }
};