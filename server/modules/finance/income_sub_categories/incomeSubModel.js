import { pool } from "../../../server.js";

const IncomeSubcategory = {
  async getAll() {
    const result = await pool.query(`
      SELECT id, name, category_id
      FROM income_subcategories
      ORDER BY id ASC
    `);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, name, category_id
       FROM income_subcategories WHERE id=$1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create({ name, category_id }) {
    const result = await pool.query(
      `INSERT INTO income_subcategories (category_id, name)
       VALUES ($1, $2)
       RETURNING id, name, category_id`,
      [category_id, name]
    );
    return result.rows[0];
  },

  async update(id, { name, category_id }) {
    const result = await pool.query(
      `UPDATE income_subcategories
       SET category_id=$1, name=$2
       WHERE id=$3
       RETURNING id, name, category_id`,
      [category_id, name, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM income_subcategories WHERE id=$1
       RETURNING id, name, category_id`,
      [id]
    );
    return result.rows[0];
  }
};

export default IncomeSubcategory;
