import { pool } from "../../server.js";

export const Program = {
  async create(data) {
    const {
      name,
      description,
      department_id,
      category_id,
      organization_id,
      date,
      time,
      venue,
      agenda,
      status,
      event_type,
      notes,
    } = data;

    const result = await pool.query(
      `INSERT INTO programs 
      (name, description, department_id, category_id, organization_id, date, time, venue, agenda, status, event_type, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        name,
        description,
        department_id,
        category_id,
        organization_id,
        date,
        time,
        venue,
        agenda,
        status,
        event_type,
        notes,
      ]
    );

    return result.rows[0];
  },

  async getAll(organization_id) {
    const result = await pool.query(`SELECT * FROM programs WHERE organization_id=$1 ORDER BY date ASC`, [organization_id]);
    return result.rows;
  },

  async getById(id,organization_id) {
    const result = await pool.query(`SELECT * FROM programs WHERE id=$1 AND organization_id=$2`, [id,organization_id]);
    return result.rows[0];
  },

  async update(id, organization_id, data) {
    // 1️⃣ Fetch existing program to ensure it exists
    const existing = await pool.query(
      `SELECT * FROM programs WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );

    if (!existing.rows[0]) {
      return null;
    }

    const {
      name,
      description,
      department_id,
      category_id,
      date,
      time,
      venue,
      agenda,
      status,
      event_type,
      notes,
    } = data;

    // 2️⃣ Update program
    const result = await pool.query(
      `
      UPDATE programs
      SET 
        name = $1,
        description = $2,
        department_id = $3,
        category_id = $4,
        date = $5,
        time = $6,
        venue = $7,
        agenda = $8,
        status = $9,
        event_type = $10,
        notes = $11
      WHERE id = $12
        AND organization_id = $13
      RETURNING *
      `,
      [
        name,
        description,
        department_id,
        category_id,
        date,
        time,
        venue,
        agenda,
        status,
        event_type,
        notes,
        id,
        organization_id
      ]
    );

    return result.rows[0];
  },

  async delete(id, organization_id) {
    const result = await pool.query(`DELETE FROM programs WHERE id=$1 AND organization_id=$2 RETURNING *`, [id, organization_id]);
    return result.rows[0];
  },

  async getByStatus(status, organization_id) {
    const result = await pool.query(`SELECT * FROM programs WHERE status=$1 AND organization_id=$2 ORDER BY date ASC`, [status, organization_id]);
    return result.rows;
  },
};
