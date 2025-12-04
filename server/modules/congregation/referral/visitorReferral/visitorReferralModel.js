import { pool } from "../../server.js";

const VisitorReferral = {
  async add(visitor_id, referral_id) {
    const result = await pool.query(
      `INSERT INTO visitor_referral (visitor_id, referral_id) VALUES ($1, $2) RETURNING *`,
      [visitor_id, referral_id]
    );
    return result.rows[0];
  },

  async remove(visitor_id, referral_id) {
    const result = await pool.query(
      `DELETE FROM visitor_referral WHERE visitor_id=$1 AND referral_id=$2 RETURNING *`,
      [visitor_id, referral_id]
    );
    return result.rows[0];
  },

  async getReferralsByVisitor(visitor_id) {
    const result = await pool.query(
      `SELECT r.* FROM referrals r
       JOIN visitor_referral vr ON r.id = vr.referral_id
       WHERE vr.visitor_id = $1`,
      [visitor_id]
    );
    return result.rows;
  }
};

export default VisitorReferral;
