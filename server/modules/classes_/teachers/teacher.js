import { pool } from "../../../server.js";

const TeacherModel = {
  async create({ full_name, email, phone }) {
    const result = await pool.query(
      `
      INSERT INTO teachers (full_name, email, phone)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [full_name, email, phone]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(
      `SELECT * FROM teachers ORDER BY created_at DESC`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM teachers WHERE teacher_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async update(id, { full_name, email, phone }) {
    const result = await pool.query(
      `
      UPDATE teachers
      SET full_name = $1, email = $2, phone = $3
      WHERE teacher_id = $4
      RETURNING *
      `,
      [full_name, email, phone, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query(
      `DELETE FROM teachers WHERE teacher_id = $1`,
      [id]
    );
    return true;
  },
};

export default TeacherModel;
