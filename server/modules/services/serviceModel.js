import { pool } from "../../server.js";

const Service = {
  async getAll() {
    const result = await pool.query(`SELECT * FROM services ORDER BY id ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`SELECT * FROM services WHERE id=$1`, [id]);
    return result.rows[0] || null;
  },

  async create(name) {
    const result = await pool.query(
      `INSERT INTO services (name) VALUES ($1) RETURNING *`,
      [name]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM services WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Service;
