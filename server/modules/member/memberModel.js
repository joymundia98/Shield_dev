// models/memberModel.js
import { pool } from "../../server.js";

const Member = {
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM members ORDER BY member_id ASC`
    );
    return result.rows;
  },

  async getById(member_id) {
    const result = await pool.query(
      `SELECT * FROM members WHERE member_id = $1`,
      [member_id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      full_name,
      email,
      phone,
      gender,
      date_of_birth,
      date_joined,
      user_id
    } = data;

    const result = await pool.query(
      `
      INSERT INTO members (
        full_name,
        email,
        phone,
        gender,
        date_of_birth,
        date_joined,
        user_id,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
      `,
      [
        full_name,
        email,
        phone,
        gender,
        date_of_birth,
        date_joined || new Date(),
        user_id
      ]
    );

    return result.rows[0];
  },

  async update(member_id, data) {
    const {
      full_name,
      email,
      phone,
      gender,
      date_of_birth,
      date_joined,
      user_id
    } = data;

    const result = await pool.query(
      `
      UPDATE members
      SET 
        full_name = $1,
        email = $2,
        phone = $3,
        gender = $4,
        date_of_birth = $5,
        date_joined = $6,
        user_id = $7,
        updated_at = NOW()
      WHERE member_id = $8
      RETURNING *
      `,
      [
        full_name,
        email,
        phone,
        gender,
        date_of_birth,
        date_joined,
        user_id,
        member_id
      ]
    );

    return result.rows[0];
  },

  async delete(member_id) {
    const result = await pool.query(
      `DELETE FROM members WHERE member_id = $1 RETURNING *`,
      [member_id]
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
      `SELECT * FROM members WHERE organization_id = $1 ORDER BY member_id ASC`,
      [orgId]
    );
    return result.rows;
  }
};

export default Member;
