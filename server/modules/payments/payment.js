import { pool } from "../../server.js";

export const Payment = {
  async create({
    user_id,
    organization_id,
    headquarters_id,
    amount,
    currency = "USD",
    payment_provider,
    provider_payment_id,
    reference_type,
    reference_id,
    metadata = {},
  }) {
    const result = await pool.raw(
      `
      INSERT INTO payments (
        user_id,
        organization_id,
        headquarters_id,
        amount,
        currency,
        payment_provider,
        provider_payment_id,
        reference_type,
        reference_id,
        metadata,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
      RETURNING *
      `,
      [
        user_id,
        organization_id,
        headquarters_id,
        amount,
        currency,
        payment_provider,
        provider_payment_id || null,
        reference_type,     // e.g. 'subscription', 'invoice', 'order'
        reference_id,       // ID of the linked record
        JSON.stringify(metadata),
      ]
    );

    return result.rows[0];
  },

  async markCompleted(provider_payment_id) {
    const result = await pool.raw(
      `
      UPDATE payments
      SET status = 'completed',
          updated_at = NOW()
      WHERE provider_payment_id = ?
        AND status != 'completed'
      RETURNING *
      `,
      [provider_payment_id]
    );

    return result.rows[0];
  },

  async markFailed(provider_payment_id) {
    const result = await pool.raw(
      `
      UPDATE payments
      SET status = 'failed',
          updated_at = NOW()
      WHERE provider_payment_id = ?
        AND status != 'failed'
      RETURNING *
      `,
      [provider_payment_id]
    );

    return result.rows[0];
  },

  async getByUser(user_id) {
    const result = await pool.raw(
      `
      SELECT *
      FROM payments
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [user_id]
    );

    return result.rows;
  },

  async getById(id) {
    const result = await pool.raw(
      `
      SELECT *
      FROM payments
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return result.rows[0];
  },

  async getByReference(reference_type, reference_id) {
    const result = await pool.raw(
      `
      SELECT *
      FROM payments
      WHERE reference_type = ?
        AND reference_id = ?
      ORDER BY created_at DESC
      `,
      [reference_type, reference_id]
    );

    return result.rows;
  },
};