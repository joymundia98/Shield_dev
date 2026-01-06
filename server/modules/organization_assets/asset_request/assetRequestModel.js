import { pool } from "../../../server.js";

export const AssetRequest = {

  // CREATE a new asset request (organization scoped)
  async create(data) {
    const { asset_id, requested_by, request_type, request_date, status, notes, organization_id } = data;

    const result = await pool.query(
      `
      INSERT INTO asset_requests (
        asset_id, requested_by, request_type, request_date, status, notes, organization_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [asset_id, requested_by, request_type, request_date, status, notes, organization_id]
    );

    return result.rows[0];
  },

  // GET all asset requests for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM asset_requests WHERE organization_id=$1 ORDER BY request_id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // GET asset request by ID (organization scoped)
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM asset_requests WHERE request_id=$1 AND organization_id=$2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // UPDATE asset request (organization scoped)
  async update(id, organization_id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (!fields.length) return null;

    const setQuery = fields.map((field, i) => `${field}=$${i + 1}`).join(", ");
    values.push(id, organization_id);

    const result = await pool.query(
      `UPDATE asset_requests SET ${setQuery} WHERE request_id=$${fields.length + 1} AND organization_id=$${fields.length + 2} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  // DELETE asset request (organization scoped)
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM asset_requests WHERE request_id=$1 AND organization_id=$2 RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  }
};
