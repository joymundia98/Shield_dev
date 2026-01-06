import { pool } from "../../server.js";

const CounsellorsModel = {
  // CREATE counsellor (org scoped)
  async create(data, organization_id) {
    const { full_name, specialty, contact_number, email } = data;

    const result = await pool.query(
      `
      INSERT INTO counsellors (
        full_name,
        specialty,
        contact_number,
        email,
        organization_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [full_name, specialty, contact_number, email, organization_id]
    );

    return result.rows[0];
  },

  // GET all counsellors (org scoped)
  async findAll(organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM counsellors
      WHERE organization_id = $1
      ORDER BY full_name ASC
      `,
      [organization_id]
    );

    return result.rows;
  },

  // GET counsellor by ID (org scoped)
  async findById(counsellor_id, organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM counsellors
      WHERE counsellor_id = $1
        AND organization_id = $2
      LIMIT 1
      `,
      [counsellor_id, organization_id]
    );

    return result.rows[0] || null;
  },

  // UPDATE counsellor (org scoped)
  async update(counsellor_id, data, organization_id) {
    const { full_name, specialty, contact_number, email } = data;

    const result = await pool.query(
      `
      UPDATE counsellors
      SET
        full_name = $1,
        specialty = $2,
        contact_number = $3,
        email = $4,
        updated_at = NOW()
      WHERE counsellor_id = $5
        AND organization_id = $6
      RETURNING *
      `,
      [full_name, specialty, contact_number, email, counsellor_id, organization_id]
    );

    return result.rows[0] || null;
  },

  // DELETE counsellor (org scoped)
  async delete(counsellor_id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM counsellors
      WHERE counsellor_id = $1
        AND organization_id = $2
      RETURNING counsellor_id
      `,
      [counsellor_id, organization_id]
    );

    return result.rowCount > 0;
  },
};

export default CounsellorsModel;
