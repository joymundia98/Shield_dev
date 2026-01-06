import { pool } from "../../../server.js";

const StudentsModel = {
  async create({ full_name, age, contact, organization_id }) {
    const result = await pool.query(
      `INSERT INTO students (full_name, age, contact, organization_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [full_name, age, contact, organization_id]
    );
    return result.rows[0];
  },

  async findAll(organization_id) {
    const result = await pool.query(
      `SELECT student_id, full_name, age, contact, created_at
       FROM students
       WHERE organization_id = $1
       ORDER BY created_at DESC`,
      [organization_id]
    );
    return result.rows;
  },

  async findById(student_id, organization_id) {
    const result = await pool.query(
      `SELECT student_id, full_name, age, contact
       FROM students
       WHERE student_id = $1 AND organization_id = $2
       LIMIT 1`,
      [student_id, organization_id]
    );
    return result.rows[0];
  },

  async update(student_id, { full_name, age, contact, organization_id }) {
    const result = await pool.query(
      `UPDATE students
       SET full_name = $1, age = $2, contact = $3
       WHERE student_id = $4 AND organization_id = $5
       RETURNING *`,
      [full_name, age, contact, student_id, organization_id]
    );
    return result.rows[0];
  },

  async delete(student_id, organization_id) {
    const result = await pool.query(
      `DELETE FROM students
       WHERE student_id = $1 AND organization_id = $2
       RETURNING *`,
      [student_id, organization_id]
    );
    return result.rows[0];
  }
};

export default StudentsModel;
