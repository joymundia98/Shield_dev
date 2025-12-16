import { pool } from "../../../server.js";

const FollowUpSessionsModel = {
  async create(data) {
    const { session_id, counsellor_id, follow_up_date, notes, status } = data;
    const result = await pool.query(
      `
      INSERT INTO follow_up_sessions (session_id, counsellor_id, follow_up_date, notes, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [session_id, counsellor_id, follow_up_date, notes, status]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`
      SELECT * FROM follow_up_sessions ORDER BY follow_up_date DESC
    `);
    return result.rows;
  },

  async findById(follow_up_id) {
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE follow_up_id = $1 LIMIT 1`,
      [follow_up_id]
    );
    return result.rows[0];
  },

  async update(follow_up_id, data) {
    const { session_id, counsellor_id, follow_up_date, notes, status } = data;
    const result = await pool.query(
      `
      UPDATE follow_up_sessions
      SET session_id=$1, counsellor_id=$2, follow_up_date=$3, notes=$4, status=$5, created_at=NOW()
      WHERE follow_up_id=$6
      RETURNING *
      `,
      [session_id, counsellor_id, follow_up_date, notes, status, follow_up_id]
    );
    return result.rows[0];
  },

  async delete(follow_up_id) {
    await pool.query(`DELETE FROM follow_up_sessions WHERE follow_up_id = $1`, [follow_up_id]);
    return true;
  },

  async findByCounsellor(counsellor_id) {
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE counsellor_id = $1 ORDER BY follow_up_date DESC`,
      [counsellor_id]
    );
    return result.rows;
  },

  async findBySession(session_id) {
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE session_id = $1 ORDER BY follow_up_date DESC`,
      [session_id]
    );
    return result.rows;
  },
};

export default FollowUpSessionsModel;
