import { pool } from "../../../server.js";

const ClassCategoryModel = {
  async create({ name, description }) {
    const result = await pool.query(
      `
      INSERT INTO class_categories (name, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, description]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`
      SELECT *
      FROM class_categories
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async findById(category_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM class_categories
      WHERE category_id = $1
      `,
      [category_id]
    );
    return result.rows[0];
  },

  async update(category_id, { name, description }) {
    const result = await pool.query(
      `
      UPDATE class_categories
      SET name = $1,
          description = $2,
          updated_at = NOW()
      WHERE category_id = $3
      RETURNING *
      `,
      [name, description, category_id]
    );
    return result.rows[0];
  },

  async delete(category_id) {
    await pool.query(
      `
      DELETE FROM class_categories
      WHERE category_id = $1
      `,
      [category_id]
    );
    return true;
  },
};

export default ClassCategoryModel;
