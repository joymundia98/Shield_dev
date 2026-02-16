// models/organization.model.js

import { pool } from "../../server.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// ===============================
// UTIL
// ===============================
function generateAccountId() {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ORG-${random}`;
}

const defaultDepartments = [
  { name: "Administration", category: "church" },
  { name: "Finance", category: "corporate" },
];

const defaultRoles = [
  { name: "Administrator", description: "Full system control", department: "Administration" },
  { name: "Registrar", description: "Registrar for an organization", department: "Administration" },
  { name: "Finance Officer", description: "Handles financial matters", department: "Finance" },
];

const Organization = {
  async create(data) {
    const {
      name,
      denomination,
      address,
      region,
      district,
      status = "active",
      organization_email,
      org_type_id,
      headquarters_id,
      password
    } = data;

    const organization_account_id = generateAccountId();

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1️⃣ Create organization
      const orgResult = await client.query(
        `
        INSERT INTO organizations (
          name, denomination, address, region, district, status,
          organization_email, organization_account_id, org_type_id, headquarters_id, password
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
          headquarters_id,
          hashedPassword
        ]
      );

      const org = orgResult.rows[0];
      const organization_id = org.id; // ✅ Use the actual PK

      // 2️⃣ Seed default departments
      const departmentMap = {};

      for (const dept of defaultDepartments) {
        let deptRow = (
          await client.query(
            `SELECT * FROM departments WHERE name = $1 AND organization_id = $2`,
            [dept.name, organization_id]
          )
        ).rows[0];

        if (!deptRow) {
          const insertDept = await client.query(
            `
            INSERT INTO departments (name, category, organization_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [dept.name, dept.category, organization_id]
          );
          deptRow = insertDept.rows[0];
        }

        // Make sure we reference the correct PK column here!
        departmentMap[dept.name] = deptRow; // deptRow.department_id or deptRow.id
      }

      // 3️⃣ Seed default roles
      for (const role of defaultRoles) {
        const existingRole = (
          await client.query(
            `SELECT * FROM roles WHERE name = $1 AND organization_id = $2`,
            [role.name, organization_id]
          )
        ).rows[0];

        if (!existingRole) {
          await client.query(
            `
            INSERT INTO roles (name, description, organization_id, department_id)
            VALUES ($1, $2, $3, $4)
            `,
            [
              role.name,
              role.description,
              organization_id,
              role.department
                ? departmentMap[role.department]?.department_id || departmentMap[role.department]?.id
                : null
            ]
          );
        }
      }

      await client.query("COMMIT");
      return org;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Organization creation failed:", err);
      throw err;
    } finally {
      client.release();
    }
  },

  // ===============================
  // GET BY ID
  // ===============================
  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM organizations WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // ===============================
  // GET BY EMAIL (FIXED TYPO)
  // ===============================
  async getByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM organizations WHERE organization_email = $1`,
      [email]
    );
    return result.rows[0];
  },

  // ===============================
  // GET BY ACCOUNT ID
  // ===============================
  async getByAccId(org_acc_id) {
    const result = await pool.query(
      `SELECT * FROM organizations WHERE organization_account_id = $1`,
      [org_acc_id]
    );
    return result.rows[0];
  },

  // ===============================
  // LOGIN
  // ===============================
  async login({ organization_account_id, password }) {
    const result = await pool.query(
      `SELECT 
          o.*,
          ot.name AS org_type_name,
          h.name AS headquarters_name
        FROM organizations o
        LEFT JOIN organization_type ot ON o.org_type_id = ot.org_type_id
        LEFT JOIN headquarters h ON o.headquarters_id = h.id
        WHERE o.organization_account_id = $1`,
      [organization_account_id]
    );

    const org = result.rows[0];
    if (!org || !org.password) return null;

    const match = await bcrypt.compare(password, org.password);
    if (!match) return null;

    const { password: _, ...orgData } = org;
    return orgData;
  },

  // ===============================
  // LIST ALL (ADMIN USE)
  // ===============================
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM organizations ORDER BY id ASC`
    );
    return result.rows;
  },

  // ===============================
  // LIST BY HQ (HQ VISIBILITY)
  // ===============================
  async getByHeadquarters(headquarters_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM organizations
      WHERE headquarters_id = $1
      ORDER BY name
      `,
      [headquarters_id]
    );
    return result.rows;
  },

  // ===============================
  // UPDATE
  // ===============================
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
      headquarters_id, // ✅ NEW
      password
    } = data;

    const hashedPassword =
      password !== undefined
        ? await bcrypt.hash(password, SALT_ROUNDS)
        : undefined;

    const fields = [
      "name",
      "denomination",
      "address",
      "region",
      "district",
      "status",
      "organization_email",
      "org_type_id",
      "headquarters_id",
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
      headquarters_id,
      hashedPassword
    ];

    const setClauses = fields
      .map((field, idx) =>
        values[idx] !== undefined ? `${field} = $${idx + 1}` : null
      )
      .filter(Boolean);

    const filteredValues = values.filter(v => v !== undefined);

    filteredValues.push(id);

    const result = await pool.query(
      `
      UPDATE organizations
      SET ${setClauses.join(", ")}, updated_at = NOW()
      WHERE id = $${filteredValues.length}
      RETURNING *
      `,
      filteredValues
    );

    return result.rows[0];
  },

  // ===============================
  // DELETE
  // ===============================
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM organizations WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Organization;
