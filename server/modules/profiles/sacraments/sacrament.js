import { pool } from '../../../server.js'; // adjust path

const Sacraments = {
  async getAll(organization_id) {
    const result = await pool.query('SELECT * FROM sacraments ORDER BY organization_id ASC', [organization_id]);
    return result.rows;
  },

  async getById(organization_id) {
    const result = await pool.query('SELECT * FROM sacraments WHERE organization_id = $1', [organization_id]);
    return result.rows[0];
  },

  async getByChurchId(church_id, organization_id) {
    const result = await pool.query('SELECT * FROM sacraments WHERE church_id = $1 AND organization_id = $2 ORDER BY organization_id ASC', [church_id, organization_id]);
    return result.rows;
  },

  async create(data) {
  console.log(data);  // Check if church_id is being passed
  const { church_id, sacrament_name } = data;
  console.log(`Inserting sacrament with church_id: ${church_id} and sacrament_name: ${sacrament_name}`);

  if (!church_id) {
    throw new Error('church_id is required');
  }

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
