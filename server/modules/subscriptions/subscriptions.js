import { pool } from "../../server.js";

export const Subscription = {
  async create({
    user_id,
    plan_id,
    organization_id,
    headquarters_id,
    status = "trialing",
    trial_days = 7,
  }) {
    const result = await pool.raw(
      `
      INSERT INTO subscriptions (
        user_id,
        plan_id,
        organization_id,
        headquarters_id,
        status,
        trial_end,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, NOW() + INTERVAL '${trial_days} days', NOW(), NOW())
      RETURNING *
      `,
      [user_id, plan_id, organization_id, headquarters_id, status]
    );

    return result.rows[0];
  },

  async getByUser(user_id) {
    const result = await pool.raw(
      `
      SELECT *
      FROM subscriptions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user_id]
    );

    return result.rows[0];
  },

  async getById(id) {
    const result = await pool.raw(
      `
      SELECT *
      FROM subscriptions
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return result.rows[0];
  },

  async activate(id) {
    const result = await pool.raw(
      `
      UPDATE subscriptions
      SET status = 'active',
          start_date = NOW(),
          updated_at = NOW()
      WHERE id = ?
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },

  async cancel(id) {
    const result = await pool.raw(
      `
      UPDATE subscriptions
      SET status = 'canceled',
          end_date = NOW(),
          updated_at = NOW()
      WHERE id = ?
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },

  async expire(id) {
    const result = await pool.raw(
      `
      UPDATE subscriptions
      SET status = 'expired',
          end_date = NOW(),
          updated_at = NOW()
      WHERE id = ?
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },

  async updatePlan(id, plan_id) {
    const result = await pool.raw(
      `
      UPDATE subscriptions
      SET plan_id = ?,
          status = 'pending',
          updated_at = NOW()
      WHERE id = ?
      RETURNING *
      `,
      [plan_id, id]
    );

    return result.rows[0];
  },
};