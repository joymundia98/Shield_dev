import { pool } from "../../../server.js";

const DonorSubcategory = {
  async getAll() {
    const result = await pool.query(
      `SELECT id, donor_type_id, name, created_at, updated_at 
       FROM donor_subcategories ORDER BY name ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, donor_type_id, name, created_at, updated_at 
       FROM donor_subcategories WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { donor_type_id, name } = data;
    const result = await pool.query(
      `INSERT INTO donor_subcategories (donor_type_id, name)
       VALUES ($1, $2)
       RETURNING id, donor_type_id, name, created_at, updated_at`,
      [donor_type_id, name]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name } = data;
    const result = await pool.query(
      `UPDATE donor_subcategories SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, donor_type_id, name, created_at, updated_at`,
      [name, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM donor_subcategories WHERE id = $1
       RETURNING id, name`,
      [id]
    );
    return result.rows[0];
  }
};

export default DonorSubcategory;
