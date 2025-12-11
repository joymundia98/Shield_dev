import { pool } from "../../../server.js";

export const AssetWarranty = {
  // Get all warranties
  async getAll() {
    const result = await pool.query(
      `SELECT warranty_id, asset_id, vendor, start_date, end_date, support_contact, created_at
       FROM asset_warranty
       ORDER BY start_date DESC`
    );
    return result.rows;
  },

  // Get warranty by ID
  async getById(warranty_id) {
    const result = await pool.query(
      `SELECT warranty_id, asset_id, vendor, start_date, end_date, support_contact, created_at
       FROM asset_warranty
       WHERE warranty_id = $1`,
      [warranty_id]
    );
    return result.rows[0] || null;
  },

  // Create a new warranty
  async create(data) {
    const { asset_id, vendor, start_date, end_date, support_contact } = data;
    const result = await pool.query(
      `INSERT INTO asset_warranty (asset_id, vendor, start_date, end_date, support_contact)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING warranty_id, asset_id, vendor, start_date, end_date, support_contact, created_at`,
      [asset_id, vendor, start_date, end_date, support_contact]
    );
    return result.rows[0];
  },

  // Update an existing warranty
  async update(warranty_id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of ["asset_id", "vendor", "start_date", "end_date", "support_contact"]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (fields.length === 0) return null; // Nothing to update

    values.push(warranty_id);

    const result = await pool.query(
      `UPDATE asset_warranty
       SET ${fields.join(", ")}
       WHERE warranty_id = $${i}
       RETURNING warranty_id, asset_id, vendor, start_date, end_date, support_contact, created_at`,
      values
    );

    return result.rows[0];
  },

  // Delete a warranty
  async delete(warranty_id) {
    const result = await pool.query(
      `DELETE FROM asset_warranty
       WHERE warranty_id = $1
       RETURNING warranty_id, asset_id, vendor, start_date, end_date, support_contact, created_at`,
      [warranty_id]
    );
    return result.rows[0];
  }
};
