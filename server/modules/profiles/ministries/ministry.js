import { pool } from '../../../server.js'; // adjust the path

const Ministries = {
  async getAll(organization_id) {
    const result = await pool.query(
      'SELECT * FROM ministries WHERE organization_id = $1 ORDER BY ministry_id ASC',
      [organization_id]
    );
    return result.rows;
  },

  async getById(id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM ministries WHERE ministry_id = $1 AND organization_id = $2',
      [id, organization_id]
    );
    return result.rows[0];
  },

  async getByChurchId(church_id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM ministries WHERE church_id = $1 AND organization_id = $2 ORDER BY ministry_id ASC',
      [church_id, organization_id]
    );
    return result.rows;
  },

  async create(data) {
    const { church_id, name, description, organization_id } = data;
    const result = await pool.query(
      `INSERT INTO ministries (church_id, name, description, organization_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [church_id, name, description, organization_id]
    );
    return result.rows[0];
  },

  async update(id, organization_id, data) {
    // 1️⃣ Fetch existing program to ensure it exists
    const existing = await pool.query(
      `SELECT * FROM ministriea WHERE church_id = $1 AND organization_id = $2`,
      [id, organization_id]
    );

    if (!existing.rows[0]) {
      return null;
    }
    
    const { church_id, name, description } = data;
    const result = await pool.query(
      `UPDATE ministries SET church_id = $1, name = $2, description = $3, organization_id = $4
       WHERE ministry_id = $5
       RETURNING *`,
      [church_id, name, description, organization_id, id]
    );
    return result.rows[0];
  },

  async delete(id, organization_id) {
    const result = await pool.query(
      'DELETE FROM ministries WHERE ministry_id = $1 AND organization_id = $2 RETURNING *',
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default Ministries;
