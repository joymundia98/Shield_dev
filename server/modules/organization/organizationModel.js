import { pool } from "../../server.js";
import crypto from "crypto"; // for random ID generation

function generateAccountId() {
  // Example: ORG-8F3A9C1D
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ORG-${random}`;
}

const Organization = {
  // CREATE
  async create(data) {
    const {
      name,
      denomination,
      address,
      region,
      district,
      status = "active",
      organization_email,
      org_type_id, // now referencing organization_type
      password
    } = data;

    const organization_account_id = generateAccountId();

    const result = await pool.query(
      `
      INSERT INTO organizations (
        name,
        denomination,
        address,
        region,
        district,
        status,
        organization_email,
        organization_account_id,
        org_type_id,
        password
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        name,
        denomination,
        address,
        region,
        district,
        status,
        organization_email,
        organization_account_id,
        org_type_id,
        password
      ]
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
    const result = await pool.query(
      `SELECT * FROM organizations ORDER BY id ASC`
    );
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
      status,
      organization_email,
      org_type_id,
      password
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
        status = $6,
        organization_email = $7,
        org_type_id = $8,
        password = $9
      WHERE id = $10
      RETURNING *
      `,
      [
        name,
        denomination,
        address,
        region,
        district,
        status,
        organization_email,
        org_type_id,
        password,
        id
      ]
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
