import { pool } from "../../../server.js";

const Attendance = {
  async getAll() {
    const result = await pool.query(
      `SELECT record_id, status, attendance_date, created_at, service_id, member_id, visitor_id
       FROM attendance_records
       ORDER BY attendance_date DESC`
    );
    return result.rows;
  },

  async getById(record_id) {
    const result = await pool.query(
      `SELECT record_id, status, attendance_date, created_at, service_id, member_id, visitor_id
       FROM attendance_records WHERE record_id = $1`,
      [record_id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { service_id, member_id, visitor_id, status, attendance_date } = data;

    // Ensure we handle either member_id or visitor_id being null
    const result = await pool.query(
      `INSERT INTO attendance_records (status, attendance_date, service_id, member_id, visitor_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING record_id, status, attendance_date, created_at, service_id, member_id, visitor_id`,
      [status, attendance_date, service_id, member_id || null, visitor_id || null]
    );

    return result.rows[0];  // Return the newly inserted attendance record
  },

  async update(record_id, data) {
    const { status } = data;

    const result = await pool.query(
      `UPDATE attendance_records
       SET status = $1
       WHERE record_id = $2
       RETURNING record_id, status, attendance_date, created_at, service_id, member_id, visitor_id`,
      [status, record_id]
    );

    return result.rows[0];  // Return the updated attendance record
  },

  async delete(record_id) {
    const result = await pool.query(
      `DELETE FROM attendance_records
       WHERE record_id = $1
       RETURNING record_id, status, attendance_date, created_at, service_id, member_id, visitor_id`,
      [record_id]
    );
    return result.rows[0];  // Return the deleted attendance record details
  }
};

export default Attendance;
