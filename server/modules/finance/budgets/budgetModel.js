import { pool } from "../../../server.js";

const Budget = {
  async getAll() {
    const result = await pool.query(
      `
      SELECT 
        budget_id AS id,
        title,
        amount,
        year,
        expense_subcategory_id,
        income_subcategory_id,
        created_at
      FROM budgets
      ORDER BY budget_id ASC
      `
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `
      SELECT 
        budget_id AS id,
        title,
        amount,
        year,
        expense_subcategory_id,
        income_subcategory_id,
        created_at
      FROM budgets
      WHERE budget_id = $1
      `,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      title,
      amount,
      year,
      expense_subcategory_id,
      income_subcategory_id,
    } = data;

    const result = await pool.query(
      `
      INSERT INTO budgets 
        (title, amount, year, expense_subcategory_id, income_subcategory_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        budget_id AS id,
        title,
        amount,
        year,
        expense_subcategory_id,
        income_subcategory_id,
        created_at
      `,
      [
        title,
        amount,
        year,
        expense_subcategory_id || null,
        income_subcategory_id || null,
      ]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      title,
      amount,
      year,
      expense_subcategory_id,
      income_subcategory_id,
    } = data;

    const result = await pool.query(
      `
      UPDATE budgets
      SET
        title = $1,
        amount = $2,
        year = $3,
        expense_subcategory_id = $4,
        income_subcategory_id = $5
      WHERE budget_id = $6
      RETURNING 
        budget_id AS id,
        title,
        amount,
        year,
        expense_subcategory_id,
        income_subcategory_id,
        created_at
      `,
      [
        title,
        amount,
        year,
        expense_subcategory_id || null,
        income_subcategory_id || null,
        id,
      ]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `
      DELETE FROM budgets 
      WHERE budget_id = $1
      RETURNING 
        budget_id AS id,
        title,
        amount,
        year
      `,
      [id]
    );

    return result.rows[0];
  },
};

export default Budget;
