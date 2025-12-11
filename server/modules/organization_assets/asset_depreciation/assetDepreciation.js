import { pool } from "../../../server.js";

const AssetDepreciation = {
  async getAll() {
    const result = await pool.query(`
      SELECT depreciation_id, asset_id, fiscal_year, opening_value, depreciation_rate,
             depreciation_amount, closing_value, useful_life, created_at
      FROM asset_depreciation
      ORDER BY fiscal_year DESC
    `);
    return result.rows;
  },

  async getById(depreciation_id) {
    const result = await pool.query(
      `SELECT * FROM asset_depreciation WHERE depreciation_id = $1`,
      [depreciation_id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      asset_id,
      fiscal_year,
      opening_value,
      depreciation_rate,
      depreciation_amount,
      closing_value,
      useful_life
    } = data;

    const result = await pool.query(
      `INSERT INTO asset_depreciation
       (asset_id, fiscal_year, opening_value, depreciation_rate, depreciation_amount, closing_value, useful_life)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [asset_id, fiscal_year, opening_value, depreciation_rate, depreciation_amount, closing_value, useful_life]
    );

    return result.rows[0];
  },

  async update(depreciation_id, data) {
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

    values.push(depreciation_id);

    const result = await pool.query(
      `UPDATE asset_depreciation
       SET ${fields.join(", ")}
       WHERE depreciation_id = $${i}
       RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async delete(depreciation_id) {
    const result = await pool.query(
      `DELETE FROM asset_depreciation
       WHERE depreciation_id = $1
       RETURNING *`,
      [depreciation_id]
    );
    return result.rows[0];
  }
};

export default AssetDepreciation;
