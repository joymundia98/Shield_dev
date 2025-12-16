import { pool } from "../../../server.js";

const StudentsModel = {
  async create(full_name, age, contact) {
    const result = await pool.query(
      `INSERT INTO students (full_name, age, contact)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [full_name, age, contact]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`
      SELECT student_id, full_name, age, contact, created_at
      FROM students
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async findById(student_id) {
    const result = await pool.query(
      `SELECT student_id, full_name, age, contact
       FROM students
       WHERE student_id = $1
       LIMIT 1`,
      [student_id]
    );
    return result.rows[0];
  },

  async update(student_id, full_name, age, contact) {
    const result = await pool.query(
      `UPDATE students
       SET full_name = $1, age = $2, contact = $3
       WHERE student_id = $4
       RETURNING *`,
      [full_name, age, contact, student_id]
    );
    return result.rows[0];
  },

  async delete(student_id) {
    await pool.query(`DELETE FROM students WHERE student_id = $1`, [student_id]);
    return true;
  }
};

export default StudentsModel;
