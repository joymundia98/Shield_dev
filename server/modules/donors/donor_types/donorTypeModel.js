import { pool } from "../../../server.js";

const DonorType = {
  async getAll() {
    const result = await pool.query(
      `SELECT id, name FROM donor_types ORDER BY id ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, name FROM donor_types WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { name } = data;
    const result = await pool.query(
      `INSERT INTO donor_types (name) VALUES ($1) RETURNING id, name`,
      [name]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name } = data;
    const result = await pool.query(
      `UPDATE donor_types SET name = $1 WHERE id = $2 RETURNING id, name`,
      [name, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM donor_types WHERE id = $1 RETURNING id, name`,
      [id]
    );
    return result.rows[0];
  }
};

export default DonorType;
