import { pool } from "../../../server.js";

const Income = {
  // Get all incomes for a specific organization
  async getAll(orgId) {
    const result = await pool.query(`
      SELECT id, organization_id, subcategory_id, user_id, donor_id,
             date, giver, description, amount, status, created_at
      FROM incomes
      WHERE organization_id = $1
      ORDER BY id ASC
    `, [orgId]);

    return result.rows;
  },

  // Get income by ID and organization
  async getById(id, orgId) {
    const result = await pool.query(
      `SELECT * FROM incomes WHERE id = $1 AND organization_id = $2`,
      [id, orgId]
    );
    return result.rows[0] || null;
  },

  // Create a new income with organization_id
  async create(data) {
    const {
      organization_id,
      subcategory_id,
      user_id,
      donor_id,
      date,
      giver,
      description,
      amount,
      status
    } = data;

    const result = await pool.query(
      `INSERT INTO incomes (
        organization_id, subcategory_id, user_id, donor_id, date,
        giver, description, amount, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        organization_id,
        subcategory_id,
        user_id,
        donor_id,
        date,
        giver,
        description,
        amount,
        status || "Pending"
      ]
    );

    return result.rows[0];
  },

  // Update an income (org-scoped)
  async update(id, orgId, data) {
    const {
      subcategory_id,
      user_id,
      donor_id,
      date,
      giver,
      description,
      amount,
      status
    } = data;

    const result = await pool.query(
      `UPDATE incomes SET
        subcategory_id=$1,
        user_id=$2,
        donor_id=$3,
        date=$4,
        giver=$5,
        description=$6,
        amount=$7,
        status=$8
      WHERE id=$9 AND organization_id=$10
      RETURNING *`,
      [
        subcategory_id,
        user_id,
        donor_id,
        date,
        giver,
        description,
        amount,
        status,
        id,
        orgId
      ]
    );

    return result.rows[0];
  },

  // Update only the status (org-scoped)
  async updateStatus(id, orgId, status) {
    const result = await pool.query(
      `UPDATE incomes
       SET status = $1
       WHERE id = $2 AND organization_id = $3
       RETURNING *`,
      [status, id, orgId]
    );

    return result.rows[0];
  },

  // Delete an income (org-scoped)
  async delete(id, orgId) {
    const result = await pool.query(
      `DELETE FROM incomes WHERE id=$1 AND organization_id=$2 RETURNING *`,
      [id, orgId]
    );
    return result.rows[0];
  }
};

export default Income;
