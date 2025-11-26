import { pool } from "../../server.js";

const Permission = {
  // CREATE PERMISSION
  async create(data) {
    const { name, path, method, description } = data;

    const result = await pool.query(
      `
      INSERT INTO permissions (
        name, path, method, description
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, path, method, description]
    );

    return result.rows[0];
  },

  // GET ALL
  async getAll() {
    const result = await pool.query(`
      SELECT * FROM permissions ORDER BY id ASC
    `);
    return result.rows;
  },

  // GET BY ID
  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM permissions WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // UPDATE
  async update(id, data) {
    const { name, path, method, description } = data;

    const result = await pool.query(
      `
      UPDATE permissions
      SET 
        name = $1,
        path = $2,
        method = $3,
        description = $4
      WHERE id = $5
      RETURNING *
      `,
      [name, path, method, description, id]
    );

    return result.rows[0];
  },

  // DELETE
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM permissions WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Permission;
