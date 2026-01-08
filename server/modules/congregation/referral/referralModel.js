import { pool } from "../../../server.js";

const Referral = {
  // Get all referrals for the current organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM referrals WHERE organization_id = $1 ORDER BY id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // Get a referral by ID scoped to organization
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM referrals WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Create a new referral for the organization
  async create(source, organization_id) {
    const result = await pool.query(
      `INSERT INTO referrals (source, organization_id) VALUES ($1, $2) RETURNING *`,
      [source, organization_id]
    );
    return result.rows[0];
  },

  // Delete a referral scoped to the organization
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM referrals WHERE id = $1 AND organization_id = $2 RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default Referral;
