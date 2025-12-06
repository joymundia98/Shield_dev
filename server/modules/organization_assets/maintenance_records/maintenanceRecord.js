import { pool } from "../../../server.js";

export const MaintenanceRecord = {
  async create(data) {
    const { asset_id, category_id, last_service, next_service, status } = data;

    const result = await pool.query(
      `
      INSERT INTO maintenance_records
      (asset_id, category_id, last_service, next_service, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [asset_id, category_id, last_service, next_service, status]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(`SELECT * FROM maintenance_records ORDER BY id ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`SELECT * FROM maintenance_records WHERE id=$1`, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setQuery = fields.map((field, i) => `${field}=$${i + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE maintenance_records SET ${setQuery} WHERE id=$${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM maintenance_records WHERE id=$1 RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
};
