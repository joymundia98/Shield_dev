import { pool } from "../../../server.js";

const Budget = {
  async getAll() {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        income_subcategory_id,
        created_at
      FROM budgets
      ORDER BY id ASC
    `);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        income_subcategory_id,
        created_at
      FROM budgets
      WHERE id = $1
    `, [id]);
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      title = "Untitled",
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id,
      income_subcategory_id,
    } = data;

    if (!year || !month || !amount) {
      throw new Error("year, month, and amount are required");
    }

    const result = await pool.query(`
      INSERT INTO budgets 
        (title, amount, year, month, category_id, expense_subcategory_id, income_subcategory_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        income_subcategory_id,
        created_at
    `, [
      title,
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id || null,
      income_subcategory_id || null,
    ]);

    return result.rows[0];
  },

  async update(id, data) {
    const {
      title,
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id,
      income_subcategory_id,
    } = data;

    const result = await pool.query(`
      UPDATE budgets
      SET
        title = $1,
        amount = $2,
        year = $3,
        month = $4,
        category_id = $5,
        expense_subcategory_id = $6,
        income_subcategory_id = $7
      WHERE id = $8
      RETURNING 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        income_subcategory_id,
        created_at
    `, [
      title,
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id || null,
      income_subcategory_id || null,
      id,
    ]);

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(`
      DELETE FROM budgets 
      WHERE id = $1
      RETURNING id, title, amount, year, month
    `, [id]);

    return result.rows[0];
  },
};

export default Budget;
