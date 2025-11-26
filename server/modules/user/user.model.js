// models/userModel.js
import { pool } from '../../server.js';

const User = {
  async getAll() {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

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
    } = data;

    const result = await pool.query(
      `INSERT INTO users(first_name, last_name, email, password, phone, position, role_id, organization_id)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8)
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
      ]
    );

    return result.rows[0];
  },

async update(id, data) {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    position,
    role_id,
    organization_id
  } = data;

  const result = await pool.query(
    `
    UPDATE users
    SET 
      first_name = $1,
      last_name = $2,
      email = $3,
      password = $4,
      phone = $5,
      position = $6,
      role_id = $7,
      organization_id = $8
    WHERE id = $9
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
      organization_id,
      id
    ]
  );

  return result.rows[0];
},

  async delete(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },

  async getUserRoles(userId) {
    const result = await pool.query(
      `
      SELECT r.name
      FROM roles r
      JOIN user_roles ur ON ur.role_id = r.id
      WHERE ur.user_id = $1
      `,
      [userId]
    );
    return result.rows.map((r) => r.name);
  },

  async getRoleNameById(role_id) {
    const result = await pool.query(
        `SELECT name FROM roles WHERE id = $1 LIMIT 1`,
        [role_id]
    );
    return result.rows.length > 0 ? result.rows[0].name : null;
   },

  async getUserPermissions(userId) {
    const result = await pool.query(
      `
      SELECT DISTINCT p.name
      FROM permissions p
      JOIN role_permissions rp ON rp.permission_id = p.id
      JOIN user_roles ur ON ur.role_id = rp.role_id
      WHERE ur.user_id = $1
      `,
      [userId]
    );
    return result.rows.map((r) => r.name);
  },

    async assignRole(user_id, role_id) {
        try {
            await pool.query(
            `
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, role_id) DO NOTHING
            `,
            [user_id, role_id]
            );

            return true;
        } catch (err) {
            console.error("Error assigning role:", err);
            throw err;
        }
    }

};

export default User;
