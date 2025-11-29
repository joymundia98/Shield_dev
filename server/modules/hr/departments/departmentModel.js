// models/departmentsModel.js
import { pool } from "../../../server.js";

const Department = {
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM departments ORDER BY id ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM departments WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { name, description, category } = data;

    const result = await pool.query(
      `
      INSERT INTO departments (name, description, category)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, description, category]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const { name, description, category } = data;

    const result = await pool.query(
      `
      UPDATE departments
      SET 
        name = $1,
        description = $2,
        category = $3
      WHERE id = $4
      RETURNING *
      `,
      [name, description, category, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM departments WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Department;
