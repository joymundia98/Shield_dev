// modules/roles/roles.model.js
import { pool } from "../../server.js";

const RolesModel = {
  async create(data) {
    const { name, description, organization_id, department_id } = data;

    const result = await pool.query(
      `
      INSERT INTO roles (name, description, organization_id, department_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, description, organization_id, department_id]
    );

    return result.rows[0];
  },

  async findAll(organization_id) {
    const result = await pool.query(`SELECT * FROM roles WHERE organization_id=$1 ORDER BY id DESC`, [organization_id]);
    return result.rows;
  },

  async getAllOrgRoles() {
    const result = await pool.query(`SELECT * FROM roles ORDER BY id DESC`);
    return result.rows;
  },

  async findById(id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM roles WHERE id = $1 AND organization_id=$2`,
      [id, organization_id]
    );
    return result.rows[0];
  },

async update(id, organization_id, data) {
  const { name, description } = data;

  const result = await pool.query(
    `
    UPDATE roles
    SET
      name = COALESCE($1, name),
      description = COALESCE($2, description)
      department = COALESCE($3, department)
    WHERE id = $4
      AND organization_id = $5
    RETURNING *
    `,
    [name, description, id, organization_id]
  );

  return result.rows[0] || null;
},

  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM roles WHERE id = $1 AND organization_id=$2 RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default RolesModel;
