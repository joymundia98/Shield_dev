import { pool } from "../../../server.js";

const AssetDepreciation = {

  // GET all depreciation records for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT depreciation_id, asset_id, fiscal_year, opening_value, depreciation_rate,
              depreciation_amount, closing_value, useful_life, created_at
       FROM asset_depreciation
       WHERE organization_id = $1
       ORDER BY fiscal_year DESC`,
      [organization_id]
    );
    return result.rows;
  },

  // GET depreciation by ID (organization scoped)
  async getById(depreciation_id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM asset_depreciation
       WHERE depreciation_id = $1 AND organization_id = $2`,
      [depreciation_id, organization_id]
    );
    return result.rows[0] || null;
  },

  // CREATE depreciation record (organization scoped)
  async create(data) {
    const {
      asset_id,
      fiscal_year,
      opening_value,
      depreciation_rate,
      depreciation_amount,
      closing_value,
      useful_life,
      organization_id
    } = data;

    const result = await pool.query(
      `INSERT INTO asset_depreciation
       (asset_id, fiscal_year, opening_value, depreciation_rate, depreciation_amount, closing_value, useful_life, organization_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [asset_id, fiscal_year, opening_value, depreciation_rate, depreciation_amount, closing_value, useful_life, organization_id]
    );

    return result.rows[0];
  },

  // UPDATE depreciation record (organization scoped)
  async update(depreciation_id, organization_id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of ["asset_id", "fiscal_year", "opening_value", "depreciation_rate", "depreciation_amount", "closing_value", "useful_life"]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(depreciation_id, organization_id);

    const result = await pool.query(
      `UPDATE asset_depreciation
       SET ${fields.join(", ")}
       WHERE depreciation_id = $${i} AND organization_id = $${i + 1}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  // DELETE depreciation record (organization scoped)
  async delete(depreciation_id, organization_id) {
    const result = await pool.query(
      `DELETE FROM asset_depreciation
       WHERE depreciation_id = $1 AND organization_id = $2
       RETURNING *`,
      [depreciation_id, organization_id]
    );
    return result.rows[0] || null;
  }
};

export default AssetDepreciation;
