import { pool } from "../../server.js";

export const Reference = {

  async create({ type }) {
    const result = await pool.query(
      `
      INSERT INTO payment_references (type, created_at, updated_at)
      VALUES ($1, NOW(), NOW())
      RETURNING *
      `,
      [type]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      `SELECT * FROM payment_references ORDER BY created_at DESC`
    );

    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM payment_references WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query(
      `DELETE FROM payment_references WHERE id = $1`,
      [id]
    );
  },
};