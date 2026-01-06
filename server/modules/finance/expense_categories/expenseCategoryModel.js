import { pool } from "../../../server.js";

const ExpenseCategory = {
  // Get all categories for a specific organization
  async getAll(orgId) {
    const result = await pool.query(
      `SELECT id, name, organization_id
       FROM expense_categories
       WHERE organization_id = $1
       ORDER BY id ASC`,
      [orgId]
    );
    return result.rows;
  },

  // Get a single category by ID and organization
  async getById(id, orgId) {
    const result = await pool.query(
      `SELECT id, name, organization_id
       FROM expense_categories
       WHERE id = $1 AND organization_id = $2`,
      [id, orgId]
    );
    return result.rows[0] || null;
  },

  // Create a new category (requires organization_id)
  async create(data) {
    const { name, organization_id } = data;
    const result = await pool.query(
      `INSERT INTO expense_categories (name, organization_id)
       VALUES ($1, $2)
       RETURNING id, name, organization_id`,
      [name, organization_id]
    );
    return result.rows[0];
  },

  // Update a category (requires organization_id)
  async update(id, data) {
    const { name, organization_id } = data;
    const result = await pool.query(
      `UPDATE expense_categories
       SET name = $1
       WHERE id = $2 AND organization_id = $3
       RETURNING id, name, organization_id`,
      [name, id, organization_id]
    );
    return result.rows[0];
  },

  // Delete a category (requires organization_id)
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM expense_categories
       WHERE id = $1 AND organization_id = $2
       RETURNING id, name, organization_id`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default ExpenseCategory;
