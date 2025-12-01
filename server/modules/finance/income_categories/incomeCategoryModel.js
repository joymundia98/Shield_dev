import { pool } from "../../../server.js";

const IncomeCategory = {
  async getAll() {
    const result = await pool.query(
      `SELECT id, name FROM income_categories ORDER BY id ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, name FROM income_categories WHERE id=$1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create({ name }) {
    const result = await pool.query(
      `INSERT INTO income_categories (name)
       VALUES ($1)
       RETURNING id, name`,
      [name]
    );
    return result.rows[0];
  },

  async update(id, { name }) {
    const result = await pool.query(
      `UPDATE income_categories SET name=$1
       WHERE id=$2
       RETURNING id, name`,
      [name, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM income_categories WHERE id=$1
       RETURNING id, name`,
      [id]
    );
    return result.rows[0];
  }
};

export default IncomeCategory;
