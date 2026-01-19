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
  async create(data, organization_id) {
    const { source, description } = data; // Include description if your table has it
    const result = await pool.query(
      `
      INSERT INTO referrals (source, description, organization_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
      `,
      [source, description || null, organization_id]
    );
    return result.rows[0];
  },

  // Update a referral scoped to the organization
  async update(id, data, organization_id) {
    const { source, description } = data;
    const result = await pool.query(
      `
      UPDATE referrals 
      SET source = COALESCE($1, source),
          description = COALESCE($2, description),
          updated_at = NOW()
      WHERE id = $3 AND organization_id = $4
      RETURNING *
      `,
      [source, description, id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Delete a referral scoped to the organization
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM referrals WHERE id = $1 AND organization_id = $2 RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0];
  },
};

export default Referral;
