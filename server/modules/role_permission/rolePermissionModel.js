// modules/role_permissions/role_permissions.model.js
import { pool } from "../../server.js";

const RolePermissionsModel = {
  async assignPermission(role_id, permission_id) {
    const result = await pool.query(
      `
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
      `,
      [role_id, permission_id]
    );

    return result.rows[0]; // null if already exists
  },

  async removePermission(role_id, permission_id) {
    const result = await pool.query(
      `
      DELETE FROM role_permissions
      WHERE role_id = $1 AND permission_id = $2
      RETURNING *
      `,
      [role_id, permission_id]
    );

    return result.rows[0];
  },

  async getPermissionsByRole(role_id) {
    const result = await pool.query(
      `
      SELECT p.*
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
      `,
      [role_id]
    );

    return result.rows;
  },

  async getRolesByPermission(permission_id) {
    const result = await pool.query(
      `
      SELECT r.*
      FROM roles r
      JOIN role_permissions rp ON r.id = rp.role_id
      WHERE rp.permission_id = $1
      `,
      [permission_id]
    );

    return result.rows;
  }
};

export default RolePermissionsModel;
