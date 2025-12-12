import { pool } from '../../../server.js'; // Adjust path to your pool

const Church = {
  async getAll() {
    const result = await pool.query('SELECT * FROM churches ORDER BY church_id ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM churches WHERE church_id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const {
      name,
      establishment_year,
      denomination,
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
      (name, establishment_year, denomination, email, phone, address, profile_pic, vision, mission, organization_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [name, establishment_year, denomination, email, phone, address, profile_pic, vision, mission, organization_id]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      name,
      establishment_year,
      denomination,
      email,
      phone,
      address,
      profile_pic,
      vision,
      mission,
      organization_id
    } = data;

    const result = await pool.query(
      `UPDATE churches SET 
        name=$1, establishment_year=$2, denomination=$3, email=$4, phone=$5, address=$6, profile_pic=$7, vision=$8, mission=$9, organization_id=$10
        WHERE church_id=$11
        RETURNING *`,
      [name, establishment_year, denomination, email, phone, address, profile_pic, vision, mission, organization_id, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM churches WHERE church_id=$1 RETURNING *', [id]);
    return result.rows[0];
  }
};

export default Church;
