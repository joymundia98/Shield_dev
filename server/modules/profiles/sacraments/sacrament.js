import { pool } from '../../../server.js'; // adjust path

const Sacraments = {
  async getAll() {
    const result = await pool.query('SELECT * FROM sacraments ORDER BY sacrament_id ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM sacraments WHERE sacrament_id = $1', [id]);
    return result.rows[0];
  },

  async getByChurchId(church_id) {
    const result = await pool.query('SELECT * FROM sacraments WHERE church_id = $1 ORDER BY sacrament_id ASC', [church_id]);
    return result.rows;
  },

  async create(data) {
    const { church_id, sacrament_name } = data;
    const result = await pool.query(
      'INSERT INTO sacraments (church_id, sacrament_name) VALUES ($1, $2) RETURNING *',
      [church_id, sacrament_name]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { church_id, sacrament_name } = data;
    const result = await pool.query(
      'UPDATE sacraments SET church_id = $1, sacrament_name = $2 WHERE sacrament_id = $3 RETURNING *',
      [church_id, sacrament_name, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM sacraments WHERE sacrament_id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

export default Sacraments;
