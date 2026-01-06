import { pool } from "../../server.js";

const ClassesModel = {
  async create(data) {
    const { name, category, schedule, description, organization_id } = data;
    const result = await pool.query(
      `
      INSERT INTO classes (name, class_category_id, schedule, description, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [name, category, schedule, description, organization_id]
    );
    return result.rows[0];
  },

  async findAll(organization_id) {
    const result = await pool.query(
      `
      SELECT * FROM classes
      WHERE organization_id = $1
      ORDER BY created_at DESC
      `,
      [organization_id]
    );
    return result.rows;
  },

  async findById(class_id, organization_id) {
    const result = await pool.query(
      `
      SELECT * FROM classes
      WHERE class_id = $1 AND organization_id = $2
      LIMIT 1
      `,
      [class_id, organization_id]
    );
    return result.rows[0];
  },

  async update(class_id, data) {
    const { name, category, schedule, description, organization_id } = data;
    const result = await pool.query(
      `
      UPDATE classes
      SET name=$1, class_category_id=$2, schedule=$3, description=$4
      WHERE class_id=$5 AND organization_id=$6
      RETURNING *
      `,
      [name, category, schedule, description, class_id, organization_id]
    );
    return result.rows[0];
  },

  async delete(class_id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM classes
      WHERE class_id = $1 AND organization_id = $2
      RETURNING *
      `,
      [class_id, organization_id]
    );
    return result.rows[0];
  },
};

export default ClassesModel;
