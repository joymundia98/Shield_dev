import { pool } from "../../../server.js";

export const MaintenanceCategory = {
  async create(data) {
    const { name, description, total_records = 0, organization_id } = data;

    const result = await pool.query(
      `
      INSERT INTO maintenance_categories (name, description, total_records, organization_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, description, total_records, organization_id]
    );

    return result.rows[0];
  },

  async getAll(organization_id) {
    const result = await pool.query(`SELECT * FROM maintenance_categories ORDER BY id ASC`, [organization_id]);
    return result.rows;
  },

  async getById(id, organization_id) {
    const result = await pool.query(`SELECT * FROM maintenance_categories WHERE id=$1 AND organization_id=$2`, [id, organization_id]);
    return result.rows[0];
  },

  async update(id, data) {
    const { name, description, total_records, organization_id } = data;

    const result = await pool.query(
      `
      UPDATE maintenance_categories
      SET name=$1, description=$2, total_records=$3
      WHERE id=$4 AND organization_id=$5
      RETURNING *
      `,
      [name, description, total_records, id, organization_id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM maintenance_categories WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};
