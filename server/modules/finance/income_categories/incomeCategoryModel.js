import { pool } from "../../../server.js";

const IncomeCategory = {
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT id, name, organization_id
       FROM income_categories
       WHERE organization_id = $1
       ORDER BY id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  async getById(orgId, id) {
    const result = await pool.query(
      `SELECT id, name, organization_id
       FROM income_categories
       WHERE id = $1 AND organization_id = $2`,
      [id, orgId]
    );
    return result.rows[0] || null;
  },

  async create({ name, organization_id }) {
    const result = await pool.query(
      `INSERT INTO income_categories (name, organization_id)
       VALUES ($1, $2)
       RETURNING id, name, organization_id`,
      [name, organization_id]
    );
    return result.rows[0];
  },

  async update(orgId, id, { name }) {
    const result = await pool.query(
      `UPDATE income_categories
       SET name = $1
       WHERE id = $2 AND organization_id = $3
       RETURNING id, name, organization_id`,
      [name, id, orgId]
    );
    return result.rows[0];
  },

  async delete(orgId, id) {
    const result = await pool.query(
      `DELETE FROM income_categories
       WHERE id = $1 AND organization_id = $2
       RETURNING id, name, organization_id`,
      [id, orgId]
    );
    return result.rows[0];
  }
};

export default IncomeCategory;
