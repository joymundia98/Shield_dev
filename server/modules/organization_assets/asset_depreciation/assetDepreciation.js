import { pool } from "../../../server.js";

const AssetDepreciation = {

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

  async getById(depreciation_id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM asset_depreciation
       WHERE depreciation_id = $1 AND organization_id = $2`,
      [depreciation_id, organization_id]
    );
    return result.rows[0] || null;
  },

  // ✅ CREATE with correct validation using asset_id
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

    // Validate asset exists using asset_id (correct PK)
    const assetCheck = await pool.query(
      `SELECT 1 FROM assets 
       WHERE asset_id = $1 AND organization_id = $2`,
      [asset_id, organization_id]
    );

    if (assetCheck.rowCount === 0) {
      throw new Error("Invalid asset_id: asset does not exist");
    }

    const result = await pool.query(
      `INSERT INTO asset_depreciation
       (asset_id, fiscal_year, opening_value, depreciation_rate, depreciation_amount, closing_value, useful_life, organization_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [asset_id, fiscal_year, opening_value, depreciation_rate, depreciation_amount, closing_value, useful_life, organization_id]
    );

    return result.rows[0];
  },

  async update(depreciation_id, organization_id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    const allowedFields = [
      "asset_id",
      "fiscal_year",
      "opening_value",
      "depreciation_rate",
      "depreciation_amount",
      "closing_value",
      "useful_life"
    ];

    for (const key of allowedFields) {
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