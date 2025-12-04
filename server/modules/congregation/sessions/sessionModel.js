import { pool } from "../../../server.js";

const Session = {
  async getAll() {
    const result = await pool.query(
      `SELECT id, name, date, description, created_at 
       FROM sessions ORDER BY date DESC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, name, date, description, created_at 
       FROM sessions WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { name, date, description } = data;
    const result = await pool.query(
      `INSERT INTO sessions (name, date, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, date, description, created_at`,
      [name, date, description]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name, date, description } = data;
    const result = await pool.query(
      `UPDATE sessions
       SET name = $1, date = $2, description = $3
       WHERE id = $4
       RETURNING id, name, date, description, created_at`,
      [name, date, description, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM sessions 
       WHERE id = $1 
       RETURNING id, name, date, description, created_at`,
      [id]
    );
    return result.rows[0];
  }
};

export default Session;
