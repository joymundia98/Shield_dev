import { pool } from "../../../server.js";

const Congregant = {
  async getAll() {
    const result = await pool.query(
      `SELECT id, name, gender, category_id FROM congregants ORDER BY id ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, name, gender, category_id FROM congregants WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { name, gender, category_id } = data;
    const result = await pool.query(
      `INSERT INTO congregants (name, gender, category_id)
       VALUES ($1, $2, $3)
       RETURNING id, name, gender, category_id`,
      [name, gender, category_id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name, gender, category_id } = data;
    const result = await pool.query(
      `UPDATE congregants
       SET name = $1, gender = $2, category_id = $3
       WHERE id = $4
       RETURNING id, name, gender, category_id`,
      [name, gender, category_id, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM congregants WHERE id = $1 RETURNING id, name, gender, category_id`,
      [id]
    );
    return result.rows[0];
  }
};

export default Congregant;
