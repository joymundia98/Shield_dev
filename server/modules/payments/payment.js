import { pool } from "../../server.js";

export const Payment = {
  async create({
    user_id,
    organization_id,
    headquarters_id,
    amount,
    payment_provider,
    payment_method_id,
    reference_type,
    reference_id,
    subscription_id,
    remarks,
    date,
  }) {
    const result = await pool.query(
      `
      INSERT INTO payments (
        user_id,
        organization_id,
        headquarters_id,
        amount,
        payment_provider,
        payment_method_id,
        reference_type,
        reference_id,
        subscription_id,
        remarks,
        date,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'paid', NOW(), NOW())
      RETURNING *
      `,
      [
        user_id,
        organization_id,
        headquarters_id,
        amount,
        payment_provider,
        payment_method_id || null,
        reference_type,     // e.g. 'subscription', 'invoice', 'order'
        reference_id,       // ID of the linked record,
        subscription_id,
        remarks,
        date
      ]
    );

    return result.rows[0];
  },

  async markCompleted(provider_payment_id) {
    const result = await pool.query(
      `
      UPDATE payments
      SET status = 'completed',
          updated_at = NOW()
      WHERE provider_payment_id = $1
        AND status != 'completed'
      RETURNING *
      `,
      [provider_payment_id]
    );

    return result.rows[0];
  },

  async markFailed(provider_payment_id) {
    const result = await pool.query(
      `
      UPDATE payments
      SET status = 'failed',
          updated_at = NOW()
      WHERE provider_payment_id = $1
        AND status != 'failed'
      RETURNING *
      `,
      [provider_payment_id]
    );

    return result.rows[0];
  },

  async getByUser(user_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM payments
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [user_id]
    );

    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `
      SELECT *
      FROM payments
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    return result.rows[0];
  },

  async getByReference(reference_type, reference_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM payments
      WHERE reference_type = $1
        AND reference_id = $2
      ORDER BY created_at DESC
      `,
      [reference_type, reference_id]
    );

    return result.rows;
  },
};