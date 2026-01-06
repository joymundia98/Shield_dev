import { pool } from "../../../server.js";

const ClassTeachersModel = {
  async create({ class_id, teacher_id, organization_id }) {
    const result = await pool.query(
      `INSERT INTO class_teachers (class_id, teacher_id, organization_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [class_id, teacher_id, organization_id]
    );
    return result.rows[0];
  },

  async findAll(organization_id) {
    const result = await pool.query(`
      SELECT ct.id, ct.class_id, ct.teacher_id, ct.organization_id, 
             c.name AS class_name, t.full_name AS teacher_name
      FROM class_teachers ct
      JOIN classes c ON ct.class_id = c.class_id
      JOIN teachers t ON ct.teacher_id = t.teacher_id
      WHERE ct.organization_id = $1
      ORDER BY ct.id DESC
    `, [organization_id]);
    return result.rows;
  },

  async findById(id, organization_id) {
    const result = await pool.query(
      `SELECT ct.id, ct.class_id, ct.teacher_id, ct.organization_id, 
              c.name AS class_name, t.full_name AS teacher_name
       FROM class_teachers ct
       JOIN classes c ON ct.class_id = c.class_id
       JOIN teachers t ON ct.teacher_id = t.teacher_id
       WHERE ct.id = $1 AND ct.organization_id = $2
       LIMIT 1`,
      [id, organization_id]
    );
    return result.rows[0];
  },

  async update(id, { class_id, teacher_id, organization_id }) {
    const result = await pool.query(
      `UPDATE class_teachers
       SET class_id = $1, teacher_id = $2
       WHERE id = $3 AND organization_id = $4
       RETURNING *`,
      [class_id, teacher_id, id, organization_id]
    );
    return result.rows[0];
  },

  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM class_teachers
       WHERE id = $1 AND organization_id = $2
       RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default ClassTeachersModel;
