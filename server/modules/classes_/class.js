import { pool } from "../../server.js";

const ClassesModel = {
  async create(data) {
    const { name, category, schedule, description } = data;
    const result = await pool.query(
      `
      INSERT INTO classes (name, class_category_id, schedule, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, category, schedule, description]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`
      SELECT * FROM classes ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async findById(class_id) {
    const result = await pool.query(
      `SELECT * FROM classes WHERE class_id = $1 LIMIT 1`,
      [class_id]
    );
    return result.rows[0];
  },

  async update(class_id, data) {
    const { name, category, schedule, description } = data;
    const result = await pool.query(
      `
      UPDATE classes
      SET name=$1, class_category_id=$2, schedule=$3, description=$4
      WHERE class_id=$5
      RETURNING *
      `,
      [name, category, schedule, description, class_id]
    );
    return result.rows[0];
  },

  async delete(class_id) {
    await pool.query(`DELETE FROM classes WHERE class_id = $1`, [class_id]);
    return true;
  },
};

export default ClassesModel;
