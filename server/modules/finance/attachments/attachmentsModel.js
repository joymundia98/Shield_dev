import { pool } from "../../../server.js";

const Attachment = {
  async create({ expense_id, income_id, url, file_type }) {
    const result = await pool.query(
      `INSERT INTO attachments (expense_id, income_id, url, file_type)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [expense_id, income_id, url, file_type]
    );
    return result.rows[0];
  },

  async getByExpense(expense_id) {
    const result = await pool.query(
      `SELECT * FROM attachments WHERE expense_id=$1`,
      [expense_id]
    );
    return result.rows;
  },

  async getByIncome(income_id) {
    const result = await pool.query(
      `SELECT * FROM attachments WHERE income_id=$1`,
      [income_id]
    );
    return result.rows;
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM attachments WHERE attachment_id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Attachment;
