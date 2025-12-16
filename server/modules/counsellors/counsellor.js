import { pool } from "../../server.js";

const CounsellorsModel = {
  async create(data) {
    const { full_name, specialty, contact_number, email } = data;
    const result = await pool.query(
      `
      INSERT INTO counsellors (full_name, specialty, contact_number, email)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [full_name, specialty, contact_number, email]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`
      SELECT * FROM counsellors ORDER BY full_name ASC
    `);
    return result.rows;
  },

  async findById(counsellor_id) {
    const result = await pool.query(
      `SELECT * FROM counsellors WHERE counsellor_id = $1 LIMIT 1`,
      [counsellor_id]
    );
    return result.rows[0];
  },

  async update(counsellor_id, data) {
    const { full_name, specialty, contact_number, email } = data;
    const result = await pool.query(
      `
      UPDATE counsellors
      SET full_name=$1, specialty=$2, contact_number=$3, email=$4
      WHERE counsellor_id=$5
      RETURNING *
      `,
      [full_name, specialty, contact_number, email, counsellor_id]
    );
    return result.rows[0];
  },

  async delete(counsellor_id) {
    await pool.query(`DELETE FROM counsellors WHERE counsellor_id = $1`, [counsellor_id]);
    return true;
  },
};

export default CounsellorsModel;
