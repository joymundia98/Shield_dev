import { pool } from "../../server.js";

const OrganizationType = {
  // CREATE
  async create(name, description) {
    const result = await pool.query(
      `
      INSERT INTO organization_type (name, description)
      VALUES ($1, $2)
      RETURNING org_type_id, name, description, created_at, updated_at
      `,
      [name, description]
    );
    return result.rows[0];
  },

  // GET ALL
  async getAll() {
    const result = await pool.query(`
      SELECT org_type_id, name, description, created_at, updated_at
      FROM organization_type
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  // GET BY ID
  async getById(id) {
    const result = await pool.query(
      `SELECT org_type_id, name, description FROM organization_type WHERE org_type_id=$1 LIMIT 1`,
      [id]
    );
    return result.rows[0];
  },

  // UPDATE
  async update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of Object.keys(data)) {
      fields.push(`${key} = $${i}`);
      values.push(data[key]);
      i++;
    }
    values.push(id);

    const result = await pool.query(
      `UPDATE organization_type SET ${fields.join(", ")} WHERE org_type_id=$${i} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  // DELETE
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM organization_type WHERE org_type_id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default OrganizationType;
