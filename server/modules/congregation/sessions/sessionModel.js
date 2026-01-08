import { pool } from "../../../server.js";

const Session = {
  // Get all sessions for the current organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT id, name, date, description, created_at 
       FROM sessions
       WHERE organization_id = $1
       ORDER BY date DESC`,
      [organization_id]
    );
    return result.rows;
  },

  // Get a session by ID within the organization
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT id, name, date, description, created_at 
       FROM sessions
       WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Create a new session for the organization
  async create(data, organization_id) {
    const { name, date, description } = data;
    const result = await pool.query(
      `INSERT INTO sessions (name, date, description, organization_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, date, description, created_at`,
      [name, date, description, organization_id]
    );
    return result.rows[0];
  },

  // Update a session by ID within the organization
  async update(id, data, organization_id) {
    const { name, date, description } = data;
    const result = await pool.query(
      `UPDATE sessions
       SET name = $1, date = $2, description = $3
       WHERE id = $4 AND organization_id = $5
       RETURNING id, name, date, description, created_at`,
      [name, date, description, id, organization_id]
    );
    return result.rows[0];
  },

  // Delete a session by ID within the organization
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM sessions 
       WHERE id = $1 AND organization_id = $2
       RETURNING id, name, date, description, created_at`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default Session;
