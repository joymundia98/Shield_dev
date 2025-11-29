// models/staffModel.js
import { pool } from "../../../server.js";

const Staff = {
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM staff ORDER BY id ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM staff WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      user_id,
      department,
      position,
      start_date,
      contract_type,
      name,
      role,
      status,
      gender,
      NRC,
      address,
      phone,
      email,
      photo,
      paid,
      join_date,
      department_id
    } = data;

    const result = await pool.query(
      `
      INSERT INTO staff (
        user_id, department, position, start_date, contract_type,
        name, role, status, gender, nrc, address, phone, email,
        photo, paid, "join_date", department_id
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17
      )
      RETURNING *
      `,
      [
        user_id, department, position, start_date, contract_type,
        name, role, status, gender, NRC, address, phone, email,
        photo, paid, join_date, department_id
      ]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      user_id,
      department,
      position,
      start_date,
      contract_type,
      name,
      role,
      status,
      gender,
      NRC,
      address,
      phone,
      email,
      photo,
      paid,
      join_date,
      department_id
    } = data;

    const result = await pool.query(
      `
      UPDATE staff
      SET
        user_id = $1,
        department = $2,
        position = $3,
        start_date = $4,
        contract_type = $5,
        name = $6,
        role = $7,
        status = $8,
        gender = $9,
        nrc = $10,
        address = $11,
        phone = $12,
        email = $13,
        photo = $14,
        paid = $15,
        join_date = $16,
        department_id = $17
      WHERE id = $18
      RETURNING *
      `,
      [
        user_id, department, position, start_date, contract_type,
        name, role, status, gender, NRC, address, phone, email,
        photo, paid, join_date, department_id, id
      ]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM staff WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async getByDepartment(deptId) {
    const result = await pool.query(
      `SELECT * FROM staff WHERE department_id = $1 ORDER BY id ASC`,
      [deptId]
    );
    return result.rows;
  }
};

export default Staff;
