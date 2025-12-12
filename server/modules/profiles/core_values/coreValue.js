import { pool } from '../../../server.js'; // adjust path to your pool

const CoreValue = {
  async getAll() {
    const result = await pool.query('SELECT * FROM core_values ORDER BY core_value_id ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM core_values WHERE core_value_id = $1', [id]);
    return result.rows[0];
  },

  async getByChurchId(church_id) {
    const result = await pool.query('SELECT * FROM core_values WHERE church_id = $1 ORDER BY core_value_id ASC', [church_id]);
    return result.rows;
  },

  async create(data) {
    const { church_id, value } = data;
    const result = await pool.query(
      `INSERT INTO core_values (church_id, value) VALUES ($1, $2) RETURNING *`,
      [church_id, value]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { church_id, value } = data;
    const result = await pool.query(
      `UPDATE core_values SET church_id = $1, value = $2 WHERE core_value_id = $3 RETURNING *`,
      [church_id, value, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM core_values WHERE core_value_id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default CoreValue;
