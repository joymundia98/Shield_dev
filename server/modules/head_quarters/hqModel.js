import { pool } from "../../server.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

function generateHQAccountId() {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `HQ-${random}`;
}

const HeadquartersModel = {
  // =========================
  // CREATE HQ
  // =========================
  async create(data) {
    const {
      name,
      code,
      email,
      phone,
      region,
      country,
      password
    } = data;

    const headquarters_account_id = generateHQAccountId();

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const result = await pool.query(
      `
      INSERT INTO headquarters (
        name,
        code,
        email,
        phone,
        region,
        country,
        headquarters_account_id,
        password
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id, name, code, email, phone, region, country, headquarters_account_id
      `,
      [
        name,
        code,
        email,
        phone,
        region,
        country,
        headquarters_account_id,
        hashedPassword
      ]
    );

    return result.rows[0];
  },

  // =========================
  // GET ALL HQ
  // =========================
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM headquarters ORDER BY id ASC`
    );
    return result.rows;
  },

  async getAllByName() {
    const result = await pool.query(
      `SELECT * FROM headquarters ORDER BY id ASC`,
    );
    return result.rows;
  },

async getDepartmentsByHQ(hq_id) {
  const result = await pool.query(
    `
    SELECT d.*
    FROM departments d
    JOIN organizations o ON d.organization_id = o.id
    WHERE o.headquarters_id = $1
    `,
    [hq_id]
  );
  return result.rows;
},

async getDepartmentsByHQAndOrg(hq_id, org_id) {
  const result = await pool.query(
    `
    SELECT d.*
    FROM departments d
    JOIN organizations o ON d.organization_id = o.id
    WHERE o.headquarters_id = $1
      AND o.id = $2
    `,
    [hq_id, org_id]
  );
  return result.rows;
},

  // =========================
  // GET HQ BY ID
  // =========================
  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM headquarters WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByAccountId(accountId) {
    const result = await pool.query(
      `SELECT * FROM headquarters WHERE headquarters_account_id = $1`,
      [accountId]
    );
    return result.rows[0];
  },


async login({ headquarters_account_id, password }) {
  const result = await pool.query(
    `SELECT * FROM headquarters WHERE headquarters_account_id = $1`,
    [headquarters_account_id]
  );

  const hq = result.rows[0];
  if (!hq || !hq.password) return null;

  const match = await bcrypt.compare(password, hq.password);
  if (!match) return null;

  const { password: _, ...hqData } = hq;
  return hqData;
},

async getOrgsByHQId(id) {
  const result = await pool.query(
    `SELECT * FROM organizations WHERE headquarters_id = $1`,
    [id]
  );
  return result.rows; // return ALL organizations
},

async getUsersByHQId(headquarter_id) {
  const result = await pool.query(
    `
    SELECT u.*
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE o.headquarters_id = $1
    `,
    [headquarter_id]
  );
  return result.rows;
},


async getDonorsByHQId(hq_id) {
  const result = await pool.query(
    `
    SELECT d.*
    FROM donors d
    JOIN organizations o ON d.organization_id = o.id
    WHERE o.headquarters_id = $1
    `,
    [hq_id]
  );
  return result.rows;
},

async getOrgByIdUnderHQ(orgId, headquarterId) {
  // Fetch the organization only if it belongs to the headquarter
  const orgResult = await pool.query(
    `
    SELECT *
    FROM organizations
    WHERE id = $1 AND headquarters_id = $2
    `,
    [orgId, headquarterId]
  );

  const org = orgResult.rows[0];
  if (!org) return null; // not found or does not belong to this HQ

  // Optional: fetch departments and roles
  const [departmentsResult, rolesResult] = await Promise.all([
    pool.query(`SELECT * FROM departments WHERE organization_id = $1`, [org.id]),
    pool.query(`SELECT * FROM roles WHERE organization_id = $1`, [org.id])
  ]);

  org.departments = departmentsResult.rows;
  org.roles = rolesResult.rows;

  return org;
},

async getMembersByHQId(hq_id) {
  const result = await pool.query(
    `
    SELECT m.*
    FROM members m
    JOIN organizations o ON m.organization_id = o.id
    WHERE o.headquarters_id = $1
    `,
    [hq_id]
  );
  return result.rows;
},

async getMembersByHQAndOrg(hq_id, org_id) {
  const result = await pool.query(
    `
    SELECT m.*
    FROM members m
    JOIN organizations o ON m.organization_id = o.id
    WHERE o.headquarters_id = $1
      AND m.organization_id = $2
    `,
    [hq_id, org_id]
  );
  return result.rows;
},


async getUsersByHQAndOrg(hq_id, org_id) {
  const result = await pool.query(
    `
    SELECT u.*
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE o.headquarters_id = $1
      AND o.id = $2
    `,
    [hq_id, org_id]
  );
  return result.rows;
},

async getProgramsByHQId(hq_id) {
  const result = await pool.query(
    `
    SELECT p.*
    FROM programs p
    JOIN organizations o ON p.organization_id = o.id
    WHERE o.headquarters_id = $1
    `,
    [hq_id]
  );
  return result.rows;
},

async getProgramsByHQAndOrg(hq_id, org_id) {
  const result = await pool.query(
    `
    SELECT p.*
    FROM programs p
    JOIN organizations o ON p.organization_id = o.id
    WHERE o.headquarters_id = $1
      AND o.id = $2
    `,
    [hq_id, org_id]
  );
  return result.rows;
},

async getMinistriesByHQId(hq_id) {
  const result = await pool.query(
    `
    SELECT m.*
    FROM ministries m
    JOIN organizations o ON m.organization_id = o.id
    WHERE o.headquarters_id = $1
    `,
    [hq_id]
  );
  return result.rows;
},

async getDonationsByHQ(hq_id) {
  const result = await pool.query(
    `
    SELECT d.*
    FROM donations d
    JOIN organizations o ON d.organization_id = o.id
    WHERE o.headquarters_id = $1
    `,
    [hq_id]
  );
  return result.rows;
},

async getDonationsByHQAndOrg(hq_id, org_id) {
  const result = await pool.query(
    `
    SELECT d.*
    FROM donations d
    JOIN organizations o ON d.organization_id = o.id
    WHERE o.headquarters_id = $1
      AND o.id = $2
    `,
    [hq_id, org_id]
  );
  return result.rows;
},

async getConvertsByOrganization(org_id) {
  const result = await pool.query(
    `SELECT * FROM converts WHERE organization_id = $1`,
    [org_id]
  );
  return result.rows;
},

async getConvertsByHQAndOrg(hq_id, org_id) {
  const result = await pool.query(
    `
    SELECT c.*
    FROM converts c
    JOIN organizations o ON c.organization_id = o.id
    WHERE o.headquarters_id = $1
      AND o.id = $2
    `,
    [hq_id, org_id]
  );
  return result.rows;
},

  // =========================
  // UPDATE HQ
  // =========================
  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setClause = fields
      .map((field, idx) => `${field} = $${idx + 1}`)
      .join(", ");

    const result = await pool.query(
      `
      UPDATE headquarters
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${values.length + 1}
      RETURNING *
      `,
      [...values, id]
    );

    return result.rows[0];
  },

  // =========================
  // DELETE HQ
  // =========================
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM headquarters WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // =========================
  // GET ORGANIZATIONS UNDER HQ
  // =========================
  async getOrganizations(hq_id) {
    const result = await pool.query(
      `
      SELECT 
        o.id,
        o.name,
        o.status,
        o.region,
        o.district,
        o.created_at
      FROM organizations o
      WHERE o.headquarters_id = $1
      ORDER BY o.name
      `,
      [hq_id]
    );

    return result.rows;
  }
};

export default HeadquartersModel;
