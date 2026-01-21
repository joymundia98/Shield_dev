import { pool } from "../../server.js";

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
      status = "active"
    } = data;

    const result = await pool.query(
      `
      INSERT INTO headquarters (
        name, code, email, phone, region, country, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [name, code, email, phone, region, country, status]
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

async getOrgsByHQId(id) {
  const result = await pool.query(
    `SELECT * FROM organizations WHERE headquarters_id = $1`,
    [id]
  );
  return result.rows; // return ALL organizations
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
