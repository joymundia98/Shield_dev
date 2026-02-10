import { pool } from "../../../server.js";

const Attendance = {
  // GET ALL (scoped to organization)
  async getAll(organization_id) {
    const result = await pool.query(
      `
      SELECT
        record_id,
        status,
        attendance_date,
        created_at,
        service_id,
        member_id,
        visitor_id
      FROM attendance_records
      WHERE organization_id = $1
      ORDER BY attendance_date DESC
      `,
      [organization_id]
    );

    return result.rows;
  },

  // GET BY ID (scoped to organization)
  async getById(record_id, organization_id) {
    const result = await pool.query(
      `
      SELECT
        record_id,
        status,
        attendance_date,
        created_at,
        service_id,
        member_id,
        visitor_id
      FROM attendance_records
      WHERE record_id = $1
        AND organization_id = $2
      `,
      [record_id, organization_id]
    );

    return result.rows[0] || null;
  },

// CREATE (organization_id enforced) — supports single or bulk
async create(data) {
  // Normalize input to array
  const records = Array.isArray(data) ? data : [data];

  const values = [];
  const placeholders = [];

  records.forEach((record, index) => {
    const {
      service_id,
      member_id,
      visitor_id,
      organization_id,
      status,
      attendance_date
    } = record;

    const baseIndex = index * 6;

    placeholders.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6})`
    );

    values.push(
      organization_id,
      status,
      attendance_date,
      service_id,
      member_id || null,
      visitor_id || null
    );
  });

  const query = `
    INSERT INTO attendance_records (
      organization_id,
      status,
      attendance_date,
      service_id,
      member_id,
      visitor_id
    )
    VALUES ${placeholders.join(", ")}
    RETURNING
      record_id,
      status,
      attendance_date,
      created_at,
      service_id,
      member_id,
      visitor_id
  `;

  const result = await pool.query(query, values);
  return Array.isArray(data) ? result.rows : result.rows[0];
},

  // UPDATE (organization-safe)
  async update(record_id, organization_id, data) {
    const { status } = data;

    const result = await pool.query(
      `
      UPDATE attendance_records
      SET status = $1
      WHERE record_id = $2
        AND organization_id = $3
      RETURNING
        record_id,
        status,
        attendance_date,
        created_at,
        service_id,
        member_id,
        visitor_id
      `,
      [status, record_id, organization_id]
    );

    return result.rows[0] || null;
  },

  // DELETE (organization-safe)
  async delete(record_id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM attendance_records
      WHERE record_id = $1
        AND organization_id = $2
      RETURNING
        record_id,
        status,
        attendance_date,
        created_at,
        service_id,
        member_id,
        visitor_id
      `,
      [record_id, organization_id]
    );

    return result.rows[0] || null;
  }
};

export default Attendance;
