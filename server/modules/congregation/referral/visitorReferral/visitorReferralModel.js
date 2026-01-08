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
    return result.rows[0];
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
      `,
      [visitor_id, organization_id]
    );
    return result.rows;
  }
};

export default VisitorReferral;
