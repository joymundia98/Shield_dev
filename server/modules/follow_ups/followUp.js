import { pool } from "../../server.js";

const FollowUpsModel = {
  async create(data) {

    //don't forget to change member_id to visitor_id in the database schema
    const { visitor_id, followup_date, type, notes } = data;
    const result = await pool.query(
      `
      INSERT INTO follow_ups (visitor_id, followup_date, type, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [visitor_id, followup_date, type, notes]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`
      SELECT * FROM follow_ups ORDER BY followup_date DESC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM follow_ups WHERE followup_id = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { visitor_id, followup_date, type, notes } = data;
    const result = await pool.query(
      `
      UPDATE follow_ups
      SET visitor_id=$1, followup_date=$2, type=$3, notes=$4, created_at=NOW()
      WHERE followup_id=$5
      RETURNING *
      `,
      [visitor_id, followup_date, type, notes, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query(`DELETE FROM follow_ups WHERE followup_id = $1`, [id]);
    return true;
  },

  async findByMember(member_id) {
    const result = await pool.query(
      `SELECT * FROM follow_ups WHERE member_id = $1 ORDER BY followup_date DESC`,
      [member_id]
    );
    return result.rows;
  },
};

export default FollowUpsModel;
