// models/organization.model.js

import { pool } from "../../server.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // For bcrypt

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
      org_type_id, // references organization_type
      password
    } = data;

    const organization_account_id = generateAccountId();

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

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
        hashedPassword
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

  async getByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM orgranizations WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  async getByAccId(org_acc_id) {
    const result = await pool.query(
      `SELECT * FROM organizations WHERE organization_account_id = $1`,
      [org_acc_id]
    );
    return result.rows[0];
  },

  async login({ organization_account_id, password }) {
    const result = await pool.query(
      `SELECT * FROM organizations WHERE organization_account_id = $1`,
      [organization_account_id]
    );

    const org = result.rows[0];
    if (!org) return null;

    const match = await bcrypt.compare(password, org.password);
    if (!match) return null;

    // Remove password before returning
    const { password: _, ...orgData } = org;
    return orgData;
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

    // Hash password if provided
    let hashedPassword = password ? await bcrypt.hash(password, SALT_ROUNDS) : undefined;

    const fields = [
      "name",
      "denomination",
      "address",
      "region",
      "district",
      "status",
      "organization_email",
      "org_type_id",
      "password"
    ];

    const values = [
      name,
      denomination,
      address,
      region,
      district,
      status,
      organization_email,
      org_type_id,
      hashedPassword
    ];

    // Only update fields that are defined
    const setClauses = fields
      .map((field, idx) => (values[idx] !== undefined ? `${field} = $${idx + 1}` : null))
      .filter(Boolean);

    const filteredValues = values.filter(v => v !== undefined);

    // Append id at the end
    filteredValues.push(id);

    const result = await pool.query(
      `UPDATE organizations SET ${setClauses.join(", ")} WHERE id = $${filteredValues.length} RETURNING *`,
      filteredValues
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
