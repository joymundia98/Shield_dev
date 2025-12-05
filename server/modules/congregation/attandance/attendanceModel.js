import { pool } from "../../../server.js";

const Attendance = {
  async getAll() {
    const result = await pool.query(
      `SELECT record_id, status, attendance_date, created_at
       FROM attendance_records
       ORDER BY attendance_date DESC`
    );
    return result.rows;
  },

  async getById(record_id) {
    const result = await pool.query(
      `SELECT record_id, status, attendance_date, created_at
       FROM attendance_records WHERE record_id = $1`,
      [record_id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { session_id, congregant_id, status, attendance_date } = data;
    const result = await pool.query(
      `INSERT INTO attendance_records (status, attendance_date)
       VALUES ($1, $2, $3, $4)
       RETURNING record_id, status, attendance_date, created_at`,
      [session_id, congregant_id, status, attendance_date]
    );
    return result.rows[0];
  },

  async update(record_id, data) {
    const { status } = data;
    const result = await pool.query(
      `UPDATE attendance_records
       SET status = $1
       WHERE record_id = $2
       RETURNING record_id, status, attendance_date, created_at`,
      [status, record_id]
    );
    return result.rows[0];
  },

  async delete(record_id) {
    const result = await pool.query(
      `DELETE FROM attendance_records
       WHERE record_id = $1
       RETURNING record_id, status, attendance_date, created_at`,
      [record_id]
    );
    return result.rows[0];
  }
};

export default Attendance;
