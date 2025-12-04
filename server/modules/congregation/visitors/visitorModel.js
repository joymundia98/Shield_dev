import { pool } from "../../../server.js";

const Visitor = {
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM visitors ORDER BY id ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM visitors WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      name,
      gender,
      age,
      visit_date,
      address,
      phone,
      email,
      invited_by,
      photo_url,
      first_time,
      needs_follow_up
    } = data;

    const result = await pool.query(
      `
      INSERT INTO visitors
      (name, gender, age, visit_date, address, phone, email, invited_by, photo_url, first_time, needs_follow_up)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [name, gender, age, visit_date, address, phone, email, invited_by, photo_url, first_time ?? true, needs_follow_up ?? false]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      name,
      gender,
      age,
      visit_date,
      address,
      phone,
      email,
      invited_by,
      photo_url,
      first_time,
      needs_follow_up
    } = data;

    const result = await pool.query(
      `
      UPDATE visitors
      SET name=$1, gender=$2, age=$3, visit_date=$4, address=$5, phone=$6, email=$7, invited_by=$8, photo_url=$9, first_time=$10, needs_follow_up=$11
      WHERE id=$12
      RETURNING *
      `,
      [name, gender, age, visit_date, address, phone, email, invited_by, photo_url, first_time, needs_follow_up, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM visitors WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Visitor;
