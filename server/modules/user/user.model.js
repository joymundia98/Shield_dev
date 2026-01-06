// models/userModel.js
import { pool } from "../../server.js";

const User = {

  async getAllByOrg(organization_id) {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE organization_id = $1
       ORDER BY id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  async getActiveUsers(organization_id) {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE organization_id = $1
       AND LOWER(status) = 'active'
       ORDER BY id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  async getInactiveUsers(organization_id) {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE organization_id = $1
       AND LOWER(status) != 'active'
       ORDER BY id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  async findByEmail(email, organization_id) {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE email = $1 AND organization_id = $2`,
      [email, organization_id]
    );
    return result.rows[0] || null;
  },

  // =====================================
  // CREATE
  // =====================================

  async create(data) {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      position,
      role_id,
      organization_id,
      status,
    } = data;

    const result = await pool.query(
      `INSERT INTO users (
        first_name,
        last_name,
        email,
        password,
        phone,
        position,
        role_id,
        organization_id,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        first_name,
        last_name,
        email,
        password,
        phone,
        position,
        role_id,
        organization_id,
        status,
      ]
    );

    return result.rows[0];
  },

  // =====================================
  // UPDATE
  // =====================================

  async update(id, organization_id, data) {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      position,
      role_id,
    } = data;

    const result = await pool.query(
      `
      UPDATE users
      SET
        first_name = $1,
        last_name  = $2,
        email      = $3,
        password   = $4,
        phone      = $5,
        position   = $6,
        role_id    = $7
      WHERE id = $8
      AND organization_id = $9
      RETURNING *
      `,
      [
        first_name,
        last_name,
        email,
        password,
        phone,
        position,
        role_id,
        id,
        organization_id,
      ]
    );

    return result.rows[0] || null;
  },

  async updateStatus(id, organization_id, status) {
    const validStatuses = ["active", "inactive", "pending"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status value");
    }

    const result = await pool.query(
      `
      UPDATE users
      SET status = $1
      WHERE id = $2
      AND organization_id = $3
      RETURNING *
      `,
      [status, id, organization_id]
    );

    return result.rows[0] || null;
  },

  // =====================================
  // DELETE
  // =====================================

  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1 AND organization_id = $2
       RETURNING *`,
      [id, organization_id]
    );

    return result.rows[0] || null;
  },

  // =====================================
  // ROLES & PERMISSIONS
  // =====================================

  async getRoleNameById(role_id) {
    const result = await pool.query(
      `SELECT name FROM roles WHERE id = $1 LIMIT 1`,
      [role_id]
    );
    return result.rows[0]?.name || null;
  },

  async getUserPermissions(userId, organization_id) {
    const result = await pool.query(
      `
      SELECT DISTINCT p.name
      FROM permissions p
      JOIN role_permissions rp ON rp.permission_id = p.id
      JOIN user_roles ur ON ur.role_id = rp.role_id
      JOIN users u ON u.id = ur.user_id
      WHERE u.id = $1
      AND u.organization_id = $2
      `,
      [userId, organization_id]
    );

    return result.rows.map((r) => r.name);
  },

  async assignRole(user_id, role_id, organization_id) {
    // safety check: ensure user belongs to org
    const user = await this.getById(user_id, organization_id);
    if (!user) throw new Error("User not found in organization");

    await pool.query(
      `
      INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, role_id) DO NOTHING
      `,
      [user_id, role_id]
    );

    return true;
  },
};

export default User;
