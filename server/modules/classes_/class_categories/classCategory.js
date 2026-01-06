import { pool } from "../../../server.js";

const ClassCategoryModel = {
  async create({ name, description, organization_id }) {
    if (!organization_id) throw new Error("organization_id is required");

    const result = await pool.query(
      `
      INSERT INTO class_categories (name, description, organization_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, description, organization_id]
    );
    return result.rows[0];
  },

  async findAll(organization_id) {
    if (!organization_id) throw new Error("organization_id is required");

    const result = await pool.query(`
      SELECT *
      FROM class_categories
      WHERE organization_id = $1
      ORDER BY created_at DESC
    `, [organization_id]);
    return result.rows;
  },

  async findById(category_id, organization_id) {
    if (!organization_id) throw new Error("organization_id is required");

    const result = await pool.query(
      `
      SELECT *
      FROM class_categories
      WHERE category_id = $1 AND organization_id = $2
      `,
      [category_id, organization_id]
    );
    return result.rows[0];
  },

  async update(category_id, { name, description, organization_id }) {
    if (!organization_id) throw new Error("organization_id is required");

    const result = await pool.query(
      `
      UPDATE class_categories
      SET name = $1,
          description = $2,
          updated_at = NOW()
      WHERE category_id = $3 AND organization_id = $4
      RETURNING *
      `,
      [name, description, category_id, organization_id]
    );
    return result.rows[0];
  },

  async delete(category_id, organization_id) {
    if (!organization_id) throw new Error("organization_id is required");

    const result = await pool.query(
      `
      DELETE FROM class_categories
      WHERE category_id = $1 AND organization_id = $2
      RETURNING *
      `,
      [category_id, organization_id]
    );
    return result.rows[0];
  },
};

export default ClassCategoryModel;
