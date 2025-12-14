// modules/roles/roles.model.js
import { pool } from "../../server.js";

const RolesModel = {
  async create(data) {
    const { name, description } = data;

    const result = await pool.query(
      `
      INSERT INTO roles (name, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, description]
    );

    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`SELECT * FROM roles ORDER BY id DESC`);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM roles WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name, description } = data;

    const result = await pool.query(
      `
      UPDATE roles
      SET 
        name = $1,
        description = $2
      WHERE id = $3
      RETURNING *
      `,
      [name, description, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM roles WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default RolesModel;
