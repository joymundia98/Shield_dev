import { pool } from "../../../../server.js";

const VisitorReferral = {
  // Add a referral to a visitor
  async add(visitor_id, referral_id, organization_id) {
    const result = await pool.query(
      `
      INSERT INTO visitor_referral (visitor_id, referral_id, organization_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [visitor_id, referral_id, organization_id]
    );
    return result.rows[0];
  },

  // Remove a referral from a visitor
  async remove(visitor_id, referral_id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM visitor_referral
      WHERE visitor_id = $1
        AND referral_id = $2
        AND organization_id = $3
      RETURNING *
      `,
      [visitor_id, referral_id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Get all referrals for a visitor within the organization
  async getReferralsByVisitor(visitor_id, organization_id) {
    const result = await pool.query(
      `
      SELECT r.*
      FROM referrals r
      JOIN visitor_referral vr ON r.id = vr.referral_id
      WHERE vr.visitor_id = $1
        AND vr.organization_id = $2
      ORDER BY r.name ASC
      `,
      [visitor_id, organization_id]
    );
    return result.rows;
  },

  // Find a specific visitor-referral record
  async find(visitor_id, referral_id, organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM visitor_referral
      WHERE visitor_id = $1
        AND referral_id = $2
        AND organization_id = $3
      LIMIT 1
      `,
      [visitor_id, referral_id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Update a visitor-referral record (optional notes or status column can be added)
  async update(visitor_id, referral_id, organization_id, data) {
    const { notes, status } = data;
    const result = await pool.query(
      `
      UPDATE visitor_referral
      SET notes = COALESCE($4, notes),
          status = COALESCE($5, status),
          updated_at = NOW()
      WHERE visitor_id = $1
        AND referral_id = $2
        AND organization_id = $3
      RETURNING *
      `,
      [visitor_id, referral_id, organization_id, notes, status]
    );
    return result.rows[0] || null;
  },

  // Get all visitors for a specific referral
  async getVisitorsByReferral(referral_id, organization_id) {
    const result = await pool.query(
      `
      SELECT v.*
      FROM visitors v
      JOIN visitor_referral vr ON v.id = vr.visitor_id
      WHERE vr.referral_id = $1
        AND vr.organization_id = $2
      ORDER BY v.name ASC
      `,
      [referral_id, organization_id]
    );
    return result.rows;
  }
};

export default VisitorReferral;
