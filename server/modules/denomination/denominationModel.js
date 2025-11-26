import { pool } from "../../server.js";

const DenominationModel = {

  async create(name, description) {
    const result = await pool.query(
      `
      INSERT INTO denominations (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at
      `,
      [name, description]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`
      SELECT id, name, description, created_at
      FROM denominations
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT id, name, description FROM denominations WHERE id = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query(`DELETE FROM denominations WHERE id = $1`, [id]);
    return true;
  }
};

export default DenominationModel;
