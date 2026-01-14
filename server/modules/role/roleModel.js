// modules/roles/roles.model.js
import { pool } from "../../server.js";

const RolesModel = {
  /**
   * Create a role (org-specific or global)
   * @param {Object} data
   */
  async create(data) {
    const { name, description, organization_id = null, department_id = null } = data;

    const result = await pool.query(
      `
      INSERT INTO roles (name, description, organization_id, department_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, description, organization_id, department_id]
    );

    return result.rows[0];
  },

  /**
   * Fetch all roles available to an organization
   * Returns both global roles (organization_id IS NULL) and org-specific roles
   */
  async findAll(organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM roles
      WHERE organization_id IS NULL OR organization_id = $1
      ORDER BY id DESC
      `,
      [organization_id]
    );

    return result.rows;
  },

  /**
   * Fetch all roles (admin-level, no org scoping)
   */
  async getAllOrgRoles() {
    const result = await pool.query(`SELECT * FROM roles ORDER BY id DESC`);
    return result.rows;
  },

  /**
   * Find a role by ID scoped to an organization (includes global)
   */
  async findById(id, organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM roles
      WHERE id = $1 AND (organization_id IS NULL OR organization_id = $2)
      `,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  /**
   * Update role
   */
  async update(id, organization_id, data) {
    const { name, description, department_id = null } = data;

    const result = await pool.query(
      `
      UPDATE roles
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        department_id = COALESCE($3, department_id)
      WHERE id = $4
        AND (organization_id IS NULL OR organization_id = $5)
      RETURNING *
      `,
      [name, description, department_id, id, organization_id]
    );

    return result.rows[0] || null;
  },

  /**
   * Delete a role (org-specific only)
   */
  async delete(id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM roles
      WHERE id = $1
        AND organization_id = $2
      RETURNING *
      `,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },
};

export default RolesModel;
