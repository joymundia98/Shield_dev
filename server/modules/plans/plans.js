import { pool } from "../../server.js";

export const Plan = {
  async create({ name, price, billing_cycle }) {
    const result = await pool.raw(
      `
      INSERT INTO plans (
        name,
        price,
        billing_cycle,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, NOW(), NOW())
      RETURNING *
      `,
      [name, price, billing_cycle]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.raw(
      `
      SELECT *
      FROM plans
      ORDER BY price ASC
      `
    );

    return result.rows;
  },

  async getById(id) {
    const result = await pool.raw(
      `
      SELECT *
      FROM plans
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return result.rows[0];
  },

  async update(id, { name, price, billing_cycle }) {
    const result = await pool.raw(
      `
      UPDATE plans
      SET name = ?,
          price = ?,
          billing_cycle = ?,
          updated_at = NOW()
      WHERE id = ?
      RETURNING *
      `,
      [name, price, billing_cycle, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.raw(
      `
      DELETE FROM plans
      WHERE id = ?
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },
};