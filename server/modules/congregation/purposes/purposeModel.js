import { pool } from "../../../server.js";

const Purpose = {
  // Get all purposes for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at
       FROM purposes
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // Get purpose by ID (organization-scoped)
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at
       FROM purposes
       WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Create a new purpose
  async create(data, organization_id) {
    const { name } = data;
    const result = await pool.query(
      `INSERT INTO purposes (name, organization_id)
       VALUES ($1, $2)
       RETURNING id, name, created_at, updated_at`,
      [name, organization_id]
    );
    return result.rows[0];
  },

  // Update a purpose (organization-scoped)
  async update(id, data, organization_id) {
    const { name } = data;
    const result = await pool.query(
      `UPDATE purposes
       SET name = $1, updated_at = NOW()
       WHERE id = $2 AND organization_id = $3
       RETURNING id, name, created_at, updated_at`,
      [name, id, organization_id]
    );
    return result.rows[0];
  },

  // Delete a purpose (organization-scoped)
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM purposes
       WHERE id = $1 AND organization_id = $2
       RETURNING id, name`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default Purpose;
