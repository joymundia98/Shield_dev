import { pool } from "../../../server.js";

export const AssetCategory = {
  async create(data) {
    const { name, description } = data;
    const result = await pool.query(
      `
      INSERT INTO asset_categories (name, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, description]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(`SELECT * FROM asset_categories ORDER BY category_id ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM asset_categories WHERE category_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name, description } = data;
    const result = await pool.query(
      `
      UPDATE asset_categories
      SET name=$1, description=$2
      WHERE category_id=$3
      RETURNING *
      `,
      [name, description, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM asset_categories WHERE category_id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};
