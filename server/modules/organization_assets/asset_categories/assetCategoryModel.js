import { pool } from "../../../server.js";

export const AssetCategory = {

  // CREATE category (organization scoped)
  async create(data) {
    const { name, description, organization_id } = data;

    const result = await pool.query(
      `INSERT INTO asset_categories (name, description, organization_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, organization_id]
    );

    return result.rows[0];
  },

  // GET all categories for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM asset_categories
       WHERE organization_id = $1
       ORDER BY category_id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // GET category by ID (organization scoped)
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM asset_categories
       WHERE category_id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // UPDATE category (organization scoped)
  async update(id, organization_id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of ["name", "description"]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id, organization_id);

    const result = await pool.query(
      `UPDATE asset_categories
       SET ${fields.join(", ")}
       WHERE category_id = $${i} AND organization_id = $${i + 1}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  // DELETE category (organization scoped)
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM asset_categories
       WHERE category_id = $1 AND organization_id = $2
       RETURNING *`,
      [id, organization_id]
    );

    return result.rows[0] || null;
  }
};
