import { pool } from '../../../server.js'; // Adjust path to your pool

const Church = {
  // Get all churches for a specific organization
  async getAll(organization_id) {
    const result = await pool.query(
      'SELECT * FROM churches WHERE organization_id = $1 ORDER BY church_id ASC',
      [organization_id]
    );
    return result.rows;
  },

  // Get a single church by id AND organization
  async getById(id, organization_id) {
    const result = await pool.query(
      'SELECT * FROM churches WHERE church_id = $1 AND organization_id = $2',
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Create a new church for the given organization
  async create(data) {
    const {
      name,
      establishment_year,
      denomination_id,
      email,
      phone,
      address,
      profile_pic,
      vision,
      mission,
      organization_id
    } = data;

    const result = await pool.query(
      `INSERT INTO churches 
        (name, establishment_year, denomination_id, email, phone, address, profile_pic, vision, mission, organization_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [name, establishment_year, denomination_id, email, phone, address, profile_pic, vision, mission, organization_id]
    );

    return result.rows[0];
  },

  // Update a church, only if it belongs to the organization
  async update(id, data, organization_id) {
    const {
      name,
      establishment_year,
      denomination_id,
      email,
      phone,
      address,
      profile_pic,
      vision,
      mission
    } = data;

    const result = await pool.query(
      `UPDATE churches SET 
         name=$1, establishment_year=$2, denomination_id=$3, email=$4, phone=$5, address=$6, profile_pic=$7, vision=$8, mission=$9
       WHERE church_id=$10 AND organization_id=$11
       RETURNING *`,
      [name, establishment_year, denomination_id, email, phone, address, profile_pic, vision, mission, id, organization_id]
    );

    return result.rows[0] || null;
  },

  // Delete a church, only if it belongs to the organization
  async delete(id, organization_id) {
    const result = await pool.query(
      'DELETE FROM churches WHERE church_id=$1 AND organization_id=$2 RETURNING *',
      [id, organization_id]
    );
    return result.rows[0] || null;
  }
};

export default Church;
