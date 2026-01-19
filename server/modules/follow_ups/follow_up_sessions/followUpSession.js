import { pool } from "../../../server.js";

const FollowUpSessionsModel = {
  // CREATE a new follow-up session (organization enforced)
  async create(data, organization_id) {
    const { session_id, counsellor_id, follow_up_date, notes, status } = data;
    const result = await pool.query(
      `
      INSERT INTO follow_up_sessions 
        (session_id, counsellor_id, follow_up_date, notes, status, organization_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [session_id, counsellor_id, follow_up_date, notes, status, organization_id]
    );
    return result.rows[0];
  },

  // GET all follow-up sessions for an organization
  async findAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE organization_id = $1 ORDER BY follow_up_date DESC`,
      [organization_id]
    );
    return result.rows;
  },

  // GET a session by ID (organization scoped)
  async findById(follow_up_id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE follow_up_id = $1 AND organization_id = $2 LIMIT 1`,
      [follow_up_id, organization_id]
    );
    return result.rows[0];
  },

  // UPDATE a session (organization safe)
  async update(follow_up_id, data, organization_id) {
    const { session_id, counsellor_id, follow_up_date, notes, status } = data;
    const result = await pool.query(
      `
      UPDATE follow_up_sessions
      SET session_id=$1, counsellor_id=$2, follow_up_date=$3, notes=$4, status=$5, created_at=NOW()
      WHERE follow_up_id=$6 AND organization_id=$7
      RETURNING *
      `,
      [session_id, counsellor_id, follow_up_date, notes, status, follow_up_id, organization_id]
    );
    return result.rows[0];
  },

  // DELETE a session (organization safe)
  async delete(follow_up_id, organization_id) {
    const result = await pool.query(
      `DELETE FROM follow_up_sessions WHERE follow_up_id = $1 AND organization_id = $2 RETURNING *`,
      [follow_up_id, organization_id]
    );
    return result.rows[0] || null;
  },

  // GET sessions by counsellor (organization scoped)
  async findByCounsellor(counsellor_id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE counsellor_id = $1 AND organization_id = $2 ORDER BY follow_up_date DESC`,
      [counsellor_id, organization_id]
    );
    return result.rows;
  },

  // GET sessions by session_id (organization scoped)
  async findBySession(session_id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE session_id = $1 AND organization_id = $2 ORDER BY follow_up_date DESC`,
      [session_id, organization_id]
    );
    return result.rows;
  },
};

export default FollowUpSessionsModel;
