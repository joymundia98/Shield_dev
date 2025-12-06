import { pool } from "../../../server.js"; // your pg pool

export const AssetLocation = {
  async create(data) {
    const { name, description } = data;
    const result = await pool.query(
      `INSERT INTO asset_locations (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(`SELECT * FROM asset_locations ORDER BY location_id ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM asset_locations WHERE location_id=$1`,
      [id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name, description } = data;
    const result = await pool.query(
      `UPDATE asset_locations SET name=$1, description=$2 WHERE location_id=$3 RETURNING *`,
      [name, description, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM asset_locations WHERE location_id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};
