import { pool } from "../../../server.js";

const Purpose = {
  async getAll() {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at FROM purposes ORDER BY name ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at FROM purposes WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { name } = data;
    const result = await pool.query(
      `INSERT INTO purposes (name)
       VALUES ($1)
       RETURNING id, name, created_at, updated_at`,
      [name]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name } = data;
    const result = await pool.query(
      `UPDATE purposes SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, created_at, updated_at`,
      [name, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM purposes WHERE id = $1 RETURNING id, name`,
      [id]
    );
    return result.rows[0];
  }
};

export default Purpose;
