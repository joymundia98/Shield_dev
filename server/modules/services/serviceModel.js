import { pool } from "../../server.js";

const Service = {
  async getAll(organization_id) {
    const result = await pool.query(`SELECT * FROM services WHERE organization_id=$1 ORDER BY id ASC`, [organization_id]);
    return result.rows;
  },

  async getById(id,organization_id) {
    const result = await pool.query(`SELECT * FROM services WHERE id=$1 AND organization_id=$2`, [id,organization_id]);
    return result.rows[0] || null;
  },

  async create(name) {
    const result = await pool.query(
      `INSERT INTO services (name) VALUES ($1) RETURNING *`,
      [name]
    );
    return result.rows[0];
  },

  async delete(organization_id) {
    const result = await pool.query(
      `DELETE FROM services WHERE organization_id=$1 RETURNING *`,
      [organization_id]
    );
    return result.rows[0];
  }
};

export default Service;
