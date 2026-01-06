import { pool } from "../../../server.js";

const TeacherModel = {
  async create({ full_name, email, phone, organization_id }) {
    const result = await pool.query(
      `
      INSERT INTO teachers (full_name, email, phone, organization_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [full_name, email, phone, organization_id]
    );
    return result.rows[0];
  },

  async findAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM teachers WHERE organization_id = $1 ORDER BY created_at DESC`,
      [organization_id]
    );
    return result.rows;
  },

  async findById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM teachers WHERE teacher_id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0];
  },

  async update(id, { full_name, email, phone, organization_id }) {
    const result = await pool.query(
      `
      UPDATE teachers
      SET full_name = $1, email = $2, phone = $3
      WHERE teacher_id = $4 AND organization_id = $5
      RETURNING *
      `,
      [full_name, email, phone, id, organization_id]
    );
    return result.rows[0];
  },

  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM teachers WHERE teacher_id = $1 AND organization_id = $2 RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0];
  },
};

export default TeacherModel;
