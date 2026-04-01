import { pool } from "../../server.js";

export const Subscription = {
  async create({
    user_id,
    plan_id,
    organization_id,
    headquarters_id,
    status = "active",
    trial_days = 7,
    remarks
  }) {
    const result = await pool.query(
      `
      INSERT INTO subscriptions (
        user_id,
        plan_id,
        organization_id,
        headquarters_id,
        status,
        remarks,
        trial_end,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '${trial_days} days', NOW(), NOW())
      RETURNING *
      `,
      [user_id, plan_id, organization_id, headquarters_id, status, remarks]
    );

    return result.rows[0];
  },

  async getByUser(user_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM subscriptions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user_id]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      `
      SELECT *
      FROM subscriptions
      ORDER BY created_at DESC
      `
    );

    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `
      SELECT *
      FROM subscriptions
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    return result.rows[0];
  },

  async activate(id) {
    const result = await pool.query(
      `
      UPDATE subscriptions
      SET status = 'active',
          start_date = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },

  async cancel(id) {
    const result = await pool.query(
      `
      UPDATE subscriptions
      SET status = 'canceled',
          end_date = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },

  async expire(id) {
    const result = await pool.query(
      `
      UPDATE subscriptions
      SET status = 'expired',
          end_date = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },

  async updatePlan(id, plan_id) {
    const result = await pool.query(
      `
      UPDATE subscriptions
      SET plan_id = $1,
          status = 'pending',
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [plan_id, id]
    );

    return result.rows[0];
  },
};