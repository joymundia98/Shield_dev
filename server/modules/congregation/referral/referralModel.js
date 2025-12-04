import { pool } from "../../../server.js";

const Referral = {
  async getAll() {
    const result = await pool.query(`SELECT * FROM referrals ORDER BY id ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`SELECT * FROM referrals WHERE id=$1`, [id]);
    return result.rows[0] || null;
  },

  async create(source) {
    const result = await pool.query(
      `INSERT INTO referrals (source) VALUES ($1) RETURNING *`,
      [source]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM referrals WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Referral;
