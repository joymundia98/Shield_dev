// models/memberModel.js
import { pool } from "../../server.js";

const Member = {

  // GET ALL members for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM members
       WHERE organization_id = $1
       ORDER BY member_id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // GET member by ID (organization scoped)
  async getById(member_id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM members
       WHERE member_id = $1 AND organization_id = $2`,
      [member_id, organization_id]
    );
    return result.rows[0] || null;
  },

  // CREATE member (organization scoped)
  async create(data) {
    const {
      full_name,
      email,
      phone,
      gender,
      date_of_birth,
      date_joined,
      user_id,
      age = null,
      disabled = false,
      orphan = false,
      widowed = false,
      nrc = null,
      guardian_name = null,
      guardian_phone = null,
      status = "Active",
      organization_id
    } = data;

    const result = await pool.query(
      `
      INSERT INTO members (
        full_name, email, phone, gender, date_of_birth, date_joined,
        user_id, age, disabled, orphan, widowed, nrc,
        guardian_name, guardian_phone, status, organization_id,
        created_at, updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,
        NOW(), NOW()
      )
      RETURNING *
      `,
      [
        full_name,
        email,
        phone,
        gender,
        date_of_birth,
        date_joined || new Date(),
        user_id,
        age,
        disabled,
        orphan,
        widowed,
        nrc,
        guardian_name,
        guardian_phone,
        status,
        organization_id
      ]
    );

    return result.rows[0];
  },

  // UPDATE member (organization scoped)
  async update(member_id, organization_id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of [
      "full_name", "email", "phone", "gender", "date_of_birth",
      "date_joined", "user_id", "age", "disabled", "orphan",
      "widowed", "nrc", "guardian_name", "guardian_phone", "status"
    ]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (!fields.length) return null;

    values.push(member_id, organization_id);

    const result = await pool.query(
      `
      UPDATE members
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE member_id = $${i} AND organization_id = $${i + 1}
      RETURNING *
      `,
      values
    );

    return result.rows[0] || null;
  },

  // DELETE member (organization scoped)
  async delete(member_id, organization_id) {
    const result = await pool.query(
      `DELETE FROM members
       WHERE member_id = $1 AND organization_id = $2
       RETURNING *`,
      [member_id, organization_id]
    );
    return result.rows[0] || null;
  },

  // FIND member by email (organization scoped)
  async findByEmail(email, organization_id) {
    const result = await pool.query(
      `SELECT * FROM members
       WHERE email = $1 AND organization_id = $2`,
      [email, organization_id]
    );
    return result.rows[0] || null;
  }
};

export default Member;
