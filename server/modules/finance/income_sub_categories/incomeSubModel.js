import { pool } from "../../../server.js";

const IncomeSubcategory = {
  // Get all subcategories for a specific org
  async getAll(orgId) {
    const result = await pool.query(`
      SELECT id, name, category_id, organization_id
      FROM income_subcategories
      WHERE organization_id = $1
      ORDER BY id ASC
    `, [orgId]);
    return result.rows;
  },

  // Get a specific subcategory by ID (must belong to org)
  async getById(orgId, id) {
    const result = await pool.query(`
      SELECT id, name, category_id, organization_id
      FROM income_subcategories
      WHERE id = $1 AND organization_id = $2
    `, [id, orgId]);
    return result.rows[0] || null;
  },

  // Create a new subcategory for an org
  async create({ name, category_id, organization_id }) {
    const result = await pool.query(`
      INSERT INTO income_subcategories (category_id, name, organization_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, category_id, organization_id
    `, [category_id, name, organization_id]);
    return result.rows[0];
  },

  // Update a subcategory (must belong to org)
  async update(orgId, id, { name, category_id }) {
    const result = await pool.query(`
      UPDATE income_subcategories
      SET category_id = $1, name = $2
      WHERE id = $3 AND organization_id = $4
      RETURNING id, name, category_id, organization_id
    `, [category_id, name, id, orgId]);
    return result.rows[0];
  },

  // Delete a subcategory (must belong to org)
  async delete(orgId, id) {
    const result = await pool.query(`
      DELETE FROM income_subcategories
      WHERE id = $1 AND organization_id = $2
      RETURNING id, name, category_id, organization_id
    `, [id, orgId]);
    return result.rows[0];
  }
};

export default IncomeSubcategory;
