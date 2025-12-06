import { pool } from "../../../server.js";

export const Asset = {
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
      longitude
    } = data;

    const result = await pool.query(
      `
      INSERT INTO assets (
        name, category_id, location_id, department_id,
        acquisition_date, purchase_cost, current_value,
        condition_status, status, serial_number, description,
        latitude, longitude
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
      `,
      [
        name, category_id, location_id, department_id,
        acquisition_date, purchase_cost, current_value,
        condition_status, status, serial_number, description,
        latitude, longitude
      ]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(`SELECT * FROM assets ORDER BY asset_id ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`SELECT * FROM assets WHERE asset_id=$1`, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setQuery = fields.map((field, i) => `${field}=$${i + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE assets SET ${setQuery} WHERE asset_id=$${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM assets WHERE asset_id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};
