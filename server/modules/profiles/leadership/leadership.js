import { pool } from '../../../server.js'; // adjust path to your pool

const Leadership = {
  // Get all leadership for a specific organization
  async getAll(organization_id) {
    const result = await pool.query(
      'SELECT * FROM leadership WHERE organization_id = $1 ORDER BY leadership_id ASC',
      [organization_id]
    );
    return result.rows;
  },

  // Get a single leadership record by ID and organization
  async getById(id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM leadership WHERE leadership_id = $1 AND organization_id = $2',
      [id, organization_id]
    );
    return result.rows[0];
  },

  // Get leadership by church_id for a specific organization
  async getByChurchId(church_id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM leadership WHERE church_id = $1 AND organization_id = $2 ORDER BY leadership_id ASC',
      [church_id, organization_id]
    );
    return result.rows;
  },

  // Create a new leadership record under the authenticated organization
  async create(data) {
    const { church_id, role, name, year_start, year_end, organization_id } = data;

    const result = await pool.query(
      `INSERT INTO leadership (church_id, role, name, year_start, year_end, organization_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [church_id, role, name, year_start, year_end, organization_id]
    );

    return result.rows[0];
  },

// Update leadership record under the authenticated organization
async update(id, organization_id, data) {
  // 1️⃣ Ensure record exists under this organization
  const existing = await pool.query(
    `SELECT * FROM leadership 
     WHERE leadership_id = $1 AND organization_id = $2`,
    [id, organization_id]
  );

  if (!existing.rows[0]) {
    return null;
  }

  const { church_id, role, name, year_start, year_end } = data;

  const result = await pool.query(
    `UPDATE leadership SET 
       church_id = $1,
       role = $2,
       name = $3,
       year_start = $4,
       year_end = $5
     WHERE leadership_id = $6
       AND organization_id = $7
     RETURNING *`,
    [church_id, role, name, year_start, year_end, id, organization_id]
  );

  return result.rows[0];
},

  // Delete leadership record under the authenticated organization
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM leadership WHERE leadership_id = $1 AND organization_id = $2 RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default Leadership;
