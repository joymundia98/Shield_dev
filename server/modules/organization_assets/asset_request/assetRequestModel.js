import { pool } from "../../../server.js";

export const AssetRequest = {
  async create(data) {
    const { asset_id, requested_by, request_type, request_date, status, notes } = data;

    const result = await pool.query(
      `
      INSERT INTO asset_requests (
        asset_id, requested_by, request_type, request_date, status, notes
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [asset_id, requested_by, request_type, request_date, status, notes]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(`SELECT * FROM asset_requests ORDER BY request_id ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`SELECT * FROM asset_requests WHERE request_id=$1`, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setQuery = fields.map((field, i) => `${field}=$${i + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE asset_requests SET ${setQuery} WHERE request_id=$${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM asset_requests WHERE request_id=$1 RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
};
