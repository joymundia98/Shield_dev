// models/organization.model.js

import { pool } from "../../server.js";

const Organization = {
  // CREATE
  async create(data) {
    const {
      name,
      denomination,
      address,
      region,
      district,
      status = "active"
    } = data;

    const result = await pool.query(
      `
      INSERT INTO organizations (
        name, denomination, address, region, district, status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [name, denomination, address, region, district, status]
    );

    return result.rows[0];
  },

  // GET BY ID
  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM organizations WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // LIST ALL
  async getAll() {
    const result = await pool.query(`SELECT * FROM organizations ORDER BY id ASC`);
    return result.rows;
  },

  // UPDATE
  async update(id, data) {
    const {
      name,
      denomination,
      address,
      region,
      district,
      status
    } = data;

    const result = await pool.query(
      `
      UPDATE organizations
      SET
        name = $1,
        denomination = $2,
        address = $3,
        region = $4,
        district = $5,
        status = $6
      WHERE id = $7
      RETURNING *
      `,
      [name, denomination, address, region, district, status, id]
    );

    return result.rows[0];
  },

  // DELETE
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM organizations WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Organization;
