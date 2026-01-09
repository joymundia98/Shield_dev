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

  // CREATE (organization_id enforced)
  async create(data) {
    const {
      service_id,
      member_id,
      visitor_id,
      organization_id,
      status,
      attendance_date
    } = data;

    const result = await pool.query(
      `
      INSERT INTO attendance_records (
        organization_id,
        status,
        attendance_date,
        service_id,
        member_id,
        visitor_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        record_id,
        status,
        attendance_date,
        created_at,
        service_id,
        member_id,
        visitor_id
      `,
      [
        organization_id,
        status,
        attendance_date,
        service_id,
        member_id || null,
        visitor_id || null
      ]
    );

    return result.rows[0];
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
