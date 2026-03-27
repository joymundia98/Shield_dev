import { pool } from "../../server.js";

export const Plan = {
  async create({ name, price, billing_cycle }) {
    const result = await pool.query(
      `
      INSERT INTO plans (
        name,
        price,
        billing_cycle,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
      `,
      [name, price, billing_cycle]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      `
      SELECT *
      FROM plans
      ORDER BY price ASC
      `
    );

    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `
      SELECT *
      FROM plans
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    return result.rows[0];
  },

  async update(id, { name, price, billing_cycle }) {
    const result = await pool.query(
      `
      UPDATE plans
      SET name = $1,
          price = $2,
          billing_cycle = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [name, price, billing_cycle, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `
      DELETE FROM plans
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },
};