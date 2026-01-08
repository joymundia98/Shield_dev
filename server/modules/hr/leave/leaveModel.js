// models/leaveRequestModel.js
import { pool } from "../../../server.js";

const LeaveRequest = {
  // Get all leave requests (ADMIN / SUPER ONLY)
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM leave_requests WHERE organization_id = $1 ORDER BY id ASC`, [organization_id]
    );
    return result.rows;
  },

  // Get all leave requests for an organization
  async getByOrganization(orgId) {
    const result = await pool.query(
      `
      SELECT *
      FROM leave_requests
      WHERE organization_id = $1
      ORDER BY id ASC
      `,
      [orgId]
    );
    return result.rows;
  },

  // Get a leave request by ID (scoped by org)
  async getById(id, orgId) {
    const result = await pool.query(
      `
      SELECT *
      FROM leave_requests
      WHERE id = $1 AND organization_id = $2
      `,
      [id, orgId]
    );
    return result.rows[0] || null;
  },

  // Create a new leave request
  async create(data) {
    const {
      staff_id,
      organization_id,
      leave_type,
      start_date,
      end_date,
      days,
      status = "Pending"
    } = data;

    const result = await pool.query(
      `
      INSERT INTO leave_requests (
        staff_id,
        organization_id,
        leave_type,
        start_date,
        end_date,
        days,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        staff_id,
        organization_id,
        leave_type,
        start_date,
        end_date,
        days,
        status
      ]
    );

    return result.rows[0];
  },

  // Update leave request status (scoped by org)
  async updateStatus(id, status, orgId) {
    const result = await pool.query(
      `
      UPDATE leave_requests
      SET status = $1
      WHERE id = $2 AND organization_id = $3
      RETURNING *
      `,
      [status, id, orgId]
    );

    return result.rows[0];
  },

  // Update leave request (full update, scoped by org)
  async update(id, data, orgId) {
    const {
      staff_id,
      leave_type,
      start_date,
      end_date,
      days,
      status
    } = data;

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
      WHERE id = $7 AND organization_id = $8
      RETURNING *
      `,
      [
        staff_id,
        leave_type,
        start_date,
        end_date,
        days,
        status,
        id,
        orgId
      ]
    );

    return result.rows[0];
  },

  // Delete a leave request (scoped by org)
  async delete(id, orgId) {
    const result = await pool.query(
      `
      DELETE FROM leave_requests
      WHERE id = $1 AND organization_id = $2
      RETURNING *
      `,
      [id, orgId]
    );
    return result.rows[0];
  },

  // Get leave requests by staff ID (scoped by org)
  async getByStaff(staffId, orgId) {
    const result = await pool.query(
      `
      SELECT *
      FROM leave_requests
      WHERE staff_id = $1 AND organization_id = $2
      ORDER BY id ASC
      `,
      [staffId, orgId]
    );
    return result.rows;
  }
};

export default LeaveRequest;
