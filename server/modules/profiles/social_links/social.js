import { pool } from '../../../server.js'; // adjust path

const SocialLinks = {
  async getAll() {
    const result = await pool.query('SELECT * FROM social_links ORDER BY link_id ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM social_links WHERE link_id = $1', [id]);
    return result.rows[0];
  },

  async getByChurchId(church_id) {
    const result = await pool.query(
      'SELECT * FROM social_links WHERE church_id = $1 ORDER BY link_id ASC',
      [church_id]
    );
    return result.rows;
  },

  async create(data) {
    const { church_id, platform, url } = data;
    const result = await pool.query(
      'INSERT INTO social_links (church_id, platform, url) VALUES ($1, $2, $3) RETURNING *',
      [church_id, platform, url]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { church_id, platform, url } = data;
    const result = await pool.query(
      'UPDATE social_links SET church_id = $1, platform = $2, url = $3 WHERE link_id = $4 RETURNING *',
      [church_id, platform, url, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM social_links WHERE link_id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

export default SocialLinks;
