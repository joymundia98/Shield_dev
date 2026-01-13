import { pool } from '../../../server.js'; // adjust path as needed

const SpecialServices = {
  async getAll(organization_id) {
    const result = await pool.query('SELECT * FROM special_services ORDER BY special_service_id ASC', [organization_id]);
    return result.rows;
  },

  async getById(id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM special_services WHERE special_service_id = $1 AND organization_id = $2',
      [id, organization_id]
    );
    return result.rows[0];
  },

  async getByChurchId(church_id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM special_services WHERE church_id = $1 AND organization_id ORDER BY special_service_id ASC',
      [church_id, organization_id]
    );
    return result.rows;
  },

  async create(data) {
    const { church_id, service_name } = data;
    const result = await pool.query(
      'INSERT INTO special_services (church_id, service_name) VALUES ($1, $2) RETURNING *',
      [church_id, service_name]
    );
    return result.rows[0];
  },

  async update(id, data) {
    // 1️⃣ Fetch existing special services to ensure it exists
    const existing = await pool.query(
      `SELECT * FROM special_services WHERE church_id = $1 AND organization_id = $2`,
      [id, organization_id]
    );

    if (!existing.rows[0]) {
      return null;
    }

    const { church_id, service_name } = data;
    const result = await pool.query(
      'UPDATE special_services SET church_id = $1, service_name = $2 WHERE special_service_id = $3 RETURNING *',
      [church_id, service_name, id]
    );
    return result.rows[0];
  },

  async delete(id, organization_id) {
    const result = await pool.query(
      'DELETE FROM special_services WHERE special_service_id = $1 AND organization_id = $2 RETURNING *',
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default SpecialServices;
