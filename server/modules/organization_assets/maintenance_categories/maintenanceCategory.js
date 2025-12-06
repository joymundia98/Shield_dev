import { pool } from "../../../server.js";

export const MaintenanceCategory = {
  async create(data) {
    const { name, description, total_records = 0 } = data;

    const result = await pool.query(
      `
      INSERT INTO maintenance_categories (name, description, total_records)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, description, total_records]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(`SELECT * FROM maintenance_categories ORDER BY id ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`SELECT * FROM maintenance_categories WHERE id=$1`, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const { name, description, total_records } = data;

    const result = await pool.query(
      `
      UPDATE maintenance_categories
      SET name=$1, description=$2, total_records=$3
      WHERE id=$4
      RETURNING *
      `,
      [name, description, total_records, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM maintenance_categories WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};
