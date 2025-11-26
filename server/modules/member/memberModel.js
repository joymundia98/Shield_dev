// models/memberModel.js
import { pool } from "../../server.js";

const Member = {
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM members ORDER BY id ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM members WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
  const {
    first_name,
    last_name,
    email,
    phone,
    gender,
    date_of_birth,
    organization_id,
    user_id,
    membership_status,
    address
  } = data;

  const result = await pool.query(
    `
    INSERT INTO members (
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      organization_id,
      user_id,
      membership_status,
      address
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
    `,
    [
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      organization_id,
      user_id,
      membership_status,
      address
    ]
  );

  return result.rows[0];
},

async update(id, data) {
  const {
    first_name,
    last_name,
    email,
    phone,
    gender,
    date_of_birth,
    organization_id,
    user_id,
    membership_status,
    address
  } = data;

  const result = await pool.query(
    `
    UPDATE members
    SET 
      first_name = $1,
      last_name = $2,
      email = $3,
      phone = $4,
      gender = $5,
      date_of_birth = $6,
      organization_id = $7,
      user_id = $8,
      membership_status = $9,
      address = $10
    WHERE id = $11
    RETURNING *
    `,
    [
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      organization_id,
      user_id,
      membership_status,
      address,
      id
    ]
  );

  return result.rows[0];
},

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM members WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM members WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  },

  async findByOrganization(orgId) {
    const result = await pool.query(
      `SELECT * FROM members WHERE organization_id = $1 ORDER BY id ASC`,
      [orgId]
    );
    return result.rows;
  }
};

export default Member;
