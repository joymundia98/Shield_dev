// modules/services/serviceModel.js
import { pool } from "../../server.js";

const Service = {
  // Get all services for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM services WHERE organization_id = $1 ORDER BY id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // Get a single service by ID (organization-scoped)
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM services WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Create a new service for an organization
  async create(data, organization_id) {
    const { name, description } = data;
    const result = await pool.query(
      `INSERT INTO services (name, description, organization_id, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [name, description || null, organization_id]
    );
    return result.rows[0];
  },

  // Update an existing service (organization-scoped)
  async update(id, data, organization_id) {
    const { name, description } = data;
    const result = await pool.query(
      `
      UPDATE services
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          updated_at = NOW()
      WHERE id = $3 AND organization_id = $4
      RETURNING *
      `,
      [name, description, id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Delete a service by ID (organization-scoped)
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM services WHERE id = $1 AND organization_id = $2 RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  }
};

export default Service;
