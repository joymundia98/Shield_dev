// modules/role_permissions/role_permissions.model.js
import { pool } from "../../server.js";

const RolePermissionsModel = {
  // ===============================
  // ASSIGN PERMISSION TO ROLE
  // ===============================
  async assignPermission(role_id, permission_id, organization_id) {
    const result = await pool.query(
      `
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, $2
      FROM roles r
      WHERE r.id = $1 AND r.organization_id = $3
      ON CONFLICT DO NOTHING
      RETURNING *
      `,
      [role_id, permission_id, organization_id]
    );

    return result.rows[0] || null;
  },

  // ===============================
  // REMOVE PERMISSION FROM ROLE
  // ===============================
  async removePermission(role_id, permission_id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM role_permissions rp
      USING roles r
      WHERE rp.role_id = r.id
        AND r.id = $1
        AND rp.permission_id = $2
        AND r.organization_id = $3
      RETURNING rp.*
      `,
      [role_id, permission_id, organization_id]
    );

    return result.rows[0] || null;
  },

  // ===============================
  // GET PERMISSIONS BY ROLE (ORG SAFE)
  // ===============================
  async getPermissionsByRole(role_id, organization_id) {
    const result = await pool.query(
      `
      SELECT p.*
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN roles r ON r.id = rp.role_id
      WHERE r.id = $1
        AND r.organization_id = $2
      ORDER BY p.id
      `,
      [role_id, organization_id]
    );

    return result.rows;
  },

  // ===============================
  // GET ROLES BY PERMISSION (ORG SAFE)
  // ===============================
  async getRolesByPermission(permission_id, organization_id) {
    const result = await pool.query(
      `
      SELECT r.*
      FROM roles r
      JOIN role_permissions rp ON r.id = rp.role_id
      WHERE rp.permission_id = $1
        AND r.organization_id = $2
      ORDER BY r.id
      `,
      [permission_id, organization_id]
    );

    return result.rows;
  },

  // ===============================
  // GET USER ROLE DETAILS (ORG SAFE)
  // ===============================
  async getUserRoleDetails(user_id, organization_id) {
    const result = await pool.query(
      `
      SELECT
        u.id AS user_id,
        u.first_name,
        u.last_name,
        r.id AS role_id,
        r.name AS role_name,
        r.description AS role_description
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1
        AND u.organization_id = $2
        AND r.organization_id = $2
      LIMIT 1
      `,
      [user_id, organization_id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    return {
      id: row.user_id,
      first_name: row.first_name,
      last_name: row.last_name,
      role: row.role_id
        ? {
            id: row.role_id,
            name: row.role_name,
            description: row.role_description
          }
        : null
    };
  },

  // ===============================
  // GET USER ROLE + PERMISSIONS (ORG SAFE)
  // ===============================
  async getUserRoleAndPermissions(user_id, organization_id) {
    const result = await pool.query(
      `
      SELECT
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.status AS user_status,

        r.id AS role_id,
        r.name AS role_name,
        r.description AS role_description,

        p.id AS permission_id,
        p.name AS permission_name,
        p.path AS permission_path,
        p.method AS permission_method,
        p.description AS permission_description

      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      LEFT JOIN role_permissions rp ON rp.role_id = r.id
      LEFT JOIN permissions p ON p.id = rp.permission_id

      WHERE u.id = $1
        AND u.organization_id = $2
        AND r.organization_id = $2
      ORDER BY p.id
      `,
      [user_id, organization_id]
    );

    return result.rows;
  },

  // ===============================
  // GET ROLE WITH PERMISSIONS (ORG SAFE)
  // ===============================
  async getRoleWithPermissions(role_id, organization_id) {
    const result = await pool.query(
      `
      SELECT 
        r.id AS role_id,
        r.name AS role_name,
        r.description AS role_description,

        p.id AS permission_id,
        p.name AS permission_name,
        p.method AS permission_method,
        p.path AS permission_path,
        p.description AS permission_description

      FROM roles r
      LEFT JOIN role_permissions rp ON rp.role_id = r.id
      LEFT JOIN permissions p ON p.id = rp.permission_id
      WHERE r.id = $1
        AND r.organization_id = $2
      ORDER BY p.id
      `,
      [role_id, organization_id]
    );

    if (result.rows.length === 0) return null;

    const role = {
      id: result.rows[0].role_id,
      name: result.rows[0].role_name,
      description: result.rows[0].role_description,
      permissions: []
    };

    result.rows.forEach(row => {
      if (row.permission_id) {
        role.permissions.push({
          id: row.permission_id,
          name: row.permission_name,
          method: row.permission_method,
          path: row.permission_path,
          description: row.permission_description
        });
      }
    });

    return role;
  }
};

export default RolePermissionsModel;
