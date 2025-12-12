import { pool } from '../../../server.js'; // adjust the path

const Ministries = {
  async getAll() {
    const result = await pool.query('SELECT * FROM ministries ORDER BY ministry_id ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM ministries WHERE ministry_id = $1', [id]);
    return result.rows[0];
  },

  async getByChurchId(church_id) {
    const result = await pool.query('SELECT * FROM ministries WHERE church_id = $1 ORDER BY ministry_id ASC', [church_id]);
    return result.rows;
  },

  async create(data) {
    const { church_id, name, description } = data;
    const result = await pool.query(
      `INSERT INTO ministries (church_id, name, description) VALUES ($1, $2, $3) RETURNING *`,
      [church_id, name, description]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { church_id, name, description } = data;
    const result = await pool.query(
      `UPDATE ministries SET church_id = $1, name = $2, description = $3 WHERE ministry_id = $4 RETURNING *`,
      [church_id, name, description, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM ministries WHERE ministry_id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Ministries;
