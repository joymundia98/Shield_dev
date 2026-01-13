import { pool } from '../../../server.js';

const WorshipTimes = {
  async getAll(organization_id) {
    const result = await pool.query('SELECT * FROM worship_times WHERE organization_id = $1 ORDER BY worship_time_id ASC', [organization_id]);
    return result.rows;
  },

  async getById(id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM worship_times WHERE worship_time_id = $1 AND organization_id=$2',
      [id, organization_id]
    );
    return result.rows[0];
  },

  async getByChurchId(church_id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM worship_times WHERE church_id = $1 and organization_id = $2 ORDER BY worship_time_id ASC',
      [church_id]
    );
    return result.rows;
  },

  async create(data) {
    const { church_id, day, time } = data;
    const result = await pool.query(
      'INSERT INTO worship_times (church_id, day, time) VALUES ($1, $2, $3) RETURNING *',
      [church_id, day, time]
    );
    return result.rows[0];
  },

  async update(id, data) {
  // 1️⃣ Fetch existing worship to ensure it exists
    const existing = await pool.query(
      `SELECT * FROM worship_times WHERE worship_time_id = $1 AND organization_id = $2`,
      [id, organization_id]
    );

    if (!existing.rows[0]) {
      return null;
    }
  

    const { church_id, day, time } = data;
    const result = await pool.query(
      'UPDATE worship_times SET church_id = $1, day = $2, time = $3 WHERE worship_time_id = $4 RETURNING *',
      [church_id, day, time, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM worship_times WHERE worship_time_id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

export default WorshipTimes;
