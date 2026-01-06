import { pool } from "../../../server.js";

export const AssetLocation = {

  // CREATE location (organization scoped)
  async create(data) {
    const { name, description, organization_id } = data;

    const result = await pool.query(
      `INSERT INTO asset_locations (name, description, organization_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, organization_id]
    );

    return result.rows[0];
  },

  // GET all locations for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM asset_locations WHERE organization_id=$1 ORDER BY location_id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // GET location by ID (organization scoped)
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM asset_locations WHERE location_id=$1 AND organization_id=$2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // UPDATE location (organization scoped)
  async update(id, organization_id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of ["name", "description"]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id, organization_id);

    const result = await pool.query(
      `UPDATE asset_locations
       SET ${fields.join(", ")}
       WHERE location_id=$${i} AND organization_id=$${i + 1}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  // DELETE location (organization scoped)
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM asset_locations
       WHERE location_id=$1 AND organization_id=$2
       RETURNING *`,
      [id, organization_id]
    );

    return result.rows[0] || null;
  }
};
