import { pool } from "../../server.js";

export const PaymentMethod = {

  async create({ name, provider }) {
    const result = await pool.query(
      `
      INSERT INTO payment_methods (name, provider, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
      `,
      [name, provider]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      `SELECT * FROM payment_methods ORDER BY created_at DESC`
    );

    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM payment_methods WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  },

  async update(id, { name, provider, is_active }) {
    const result = await pool.query(
      `
      UPDATE payment_methods
      SET name = $1,
          provider = $2,
          is_active = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [name, provider, is_active, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query(
      `DELETE FROM payment_methods WHERE id = $1`,
      [id]
    );
  },
};