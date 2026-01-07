import { pool } from "../../../server.js";

const Department = {
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT department_id AS id, name, description, category FROM departments WHERE organization_id=$1 ORDER BY department_id ASC`, [organization_id]
    );
    return result.rows;
  },

  async getById(id,organization_id) {
    const result = await pool.query(
      `SELECT department_id AS id, name, description, category FROM departments WHERE department_id = $1 AND organization_id=$2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { name, description, category } = data;

    const result = await pool.query(
      `
      INSERT INTO departments (name, description, category)
      VALUES ($1, $2, $3)
      RETURNING department_id AS id, name, description, category
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
      WHERE department_id = $4
      RETURNING department_id AS id, name, description, category
      `,
      [name, description, category, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM departments WHERE department_id = $1 RETURNING department_id AS id, name, description, category`,
      [id]
    );
    return result.rows[0];
  }
};

export default Department;
