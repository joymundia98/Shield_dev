import { pool } from "../../../server.js";

export const Asset = {

  // CREATE asset
  async create(data) {
    const {
      name,
      category_id,
      location_id,
      department_id,
      acquisition_date,
      purchase_cost,
      current_value,
      condition_status,
      status,
      serial_number,
      description,
      latitude,
      longitude,
      organization_id,  // added!
    } = data;

    const result = await pool.query(
      `
      INSERT INTO assets (
        name, category_id, location_id, department_id,
        acquisition_date, purchase_cost, current_value,
        condition_status, status, serial_number, description,
        latitude, longitude, organization_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
      `,
      [
        name, category_id, location_id, department_id,
        acquisition_date, purchase_cost, current_value,
        condition_status, status, serial_number, description,
        latitude, longitude, organization_id
      ]
    );

    return result.rows[0];
  },

  // GET all assets for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT * FROM assets WHERE organization_id=$1 ORDER BY asset_id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // GET asset by ID for organization
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM assets WHERE asset_id=$1 AND organization_id=$2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // UPDATE asset for organization
  async update(id, organization_id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (!fields.length) return null;

    const setQuery = fields.map((field, i) => `${field}=$${i + 1}`).join(", ");
    values.push(id, organization_id);

    const result = await pool.query(
      `UPDATE assets SET ${setQuery} WHERE asset_id=$${fields.length + 1} AND organization_id=$${fields.length + 2} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  // DELETE asset for organization
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM assets WHERE asset_id=$1 AND organization_id=$2 RETURNING *`,
      [id, organization_id]
    );

    return result.rows[0] || null;
  }
};
