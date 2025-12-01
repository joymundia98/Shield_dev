import { pool } from "../../../server.js";

const ExtraField = {
  async create({ expense_id, income_id, key, value }) {
    const result = await pool.query(
      `INSERT INTO extra_fields (expense_id, income_id, key, value)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [expense_id, income_id, key, value]
    );
    return result.rows[0];
  },

  async getByExpense(expense_id) {
    const result = await pool.query(
      `SELECT * FROM extra_fields WHERE expense_id=$1`,
      [expense_id]
    );
    return result.rows;
  },

  async getByIncome(income_id) {
    const result = await pool.query(
      `SELECT * FROM extra_fields WHERE income_id=$1`,
      [income_id]
    );
    return result.rows;
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM extra_fields WHERE field_id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default ExtraField;
