import { pool } from "../../../server.js";

const Budget = {
  // Get all budgets for an organization
  async getAll(orgId) {
    if (!orgId) throw new Error("Organization ID is required");

    const result = await pool.query(`
      SELECT 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        organization_id,
        created_at
      FROM budgets
      WHERE organization_id = $1
      ORDER BY id ASC
    `, [orgId]);

    return result.rows;
  },

  // Get a single budget by ID, scoped to org
  async getById(id, orgId) {
    if (!orgId) throw new Error("Organization ID is required");

    const result = await pool.query(`
      SELECT 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        organization_id,
        created_at
      FROM budgets
      WHERE id = $1 AND organization_id = $2
    `, [id, orgId]);

    return result.rows[0] || null;
  },

  // Create a new budget for an organization
  async create(data) {
    const {
      title = "Untitled",
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id,
      organization_id
    } = data;

    if (!organization_id) throw new Error("Organization ID is required");
    if (!year || !month || !amount) throw new Error("year, month, and amount are required");

    const result = await pool.query(`
      INSERT INTO budgets 
        (title, amount, year, month, category_id, expense_subcategory_id, organization_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        organization_id,
        created_at
    `, [
      title,
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id || null,
      organization_id
    ]);

    return result.rows[0];
  },

  // Update a budget (scoped to org)
  async update(id, data) {
    const {
      title,
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id,
      organization_id
    } = data;

    if (!organization_id) throw new Error("Organization ID is required");

    const result = await pool.query(`
      UPDATE budgets
      SET
        title = $1,
        amount = $2,
        year = $3,
        month = $4,
        category_id = $5,
        expense_subcategory_id = $6
      WHERE id = $7 AND organization_id = $8
      RETURNING 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        organization_id,
        created_at
    `, [
      title,
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id || null,
      id,
      organization_id
    ]);

    return result.rows[0];
  },

  // Delete a budget (scoped to org)
  async delete(id, orgId) {
    if (!orgId) throw new Error("Organization ID is required");

    const result = await pool.query(`
      DELETE FROM budgets 
      WHERE id = $1 AND organization_id = $2
      RETURNING id, title, amount, year, month, organization_id
    `, [id, orgId]);

    return result.rows[0];
  },
};

export default Budget;
