// models/leaveRequestModel.js
import { pool } from "../../../server.js";

const LeaveRequest = {
  // Get all leave requests
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM leave_requests ORDER BY id ASC`
    );
    return result.rows;
  },

  // Get a leave request by ID
  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM leave_requests WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  // Create a new leave request
  async create(data) {
    const { staff_id, leave_type, start_date, end_date, days, status } = data;

    const result = await pool.query(
      `
      INSERT INTO leave_requests (
        staff_id, leave_type, start_date, end_date, days, status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [staff_id, leave_type, start_date, end_date, days, status]
    );

    return result.rows[0];
  },

  // Update a leave request's status
  async updateStatus(id, status) {
    const result = await pool.query(
      `
      UPDATE leave_requests
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    return result.rows[0];
  },

  // Update a leave request (full update of fields)
  async update(id, data) {
    const { staff_id, leave_type, start_date, end_date, days, status } = data;

    const result = await pool.query(
      `
      UPDATE leave_requests
      SET
        staff_id = $1,
        leave_type = $2,
        start_date = $3,
        end_date = $4,
        days = $5,
        status = $6
      WHERE id = $7
      RETURNING *
      `,
      [staff_id, leave_type, start_date, end_date, days, status, id]
    );

    return result.rows[0];
  },

  // Delete a leave request
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM leave_requests WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // Get leave requests by staff ID
  async getByStaff(staffId) {
    const result = await pool.query(
      `SELECT * FROM leave_requests WHERE staff_id = $1 ORDER BY id ASC`,
      [staffId]
    );
    return result.rows;
  }
};

export default LeaveRequest;
