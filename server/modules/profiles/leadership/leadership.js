import { pool } from '../../../server.js'; // adjust path to your pool

const Leadership = {
  async getAll() {
    const result = await pool.query('SELECT * FROM leadership ORDER BY leadership_id ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM leadership WHERE leadership_id = $1', [id]);
    return result.rows[0];
  },

  async getByChurchId(church_id) {
    const result = await pool.query('SELECT * FROM leadership WHERE church_id = $1 ORDER BY leadership_id ASC', [church_id]);
    return result.rows;
  },

  async create(data) {
    const { church_id, role, name, year_start, year_end } = data;
    const result = await pool.query(
      `INSERT INTO leadership (church_id, role, name, year_start, year_end) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [church_id, role, name, year_start, year_end]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { church_id, role, name, year_start, year_end } = data;
    const result = await pool.query(
      `UPDATE leadership SET church_id = $1, role = $2, name = $3, year_start = $4, year_end = $5 WHERE leadership_id = $6 RETURNING *`,
      [church_id, role, name, year_start, year_end, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM leadership WHERE leadership_id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Leadership;
