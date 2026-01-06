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

  async update(id,organization_id, data) {
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

    const result = await pool.query(
      `UPDATE programs SET 
      name=$1,
      description=$2,
      department_id=$3,
      category_id=$4,
      organization_id=$5,
      date=$6,
      time=$7,
      venue=$8,
      agenda=$9,
      status=$10,
      event_type=$11,
      notes=$12
      WHERE id=$13
      AND organization_id=$14
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
        id,
      ]
    );

    return result.rows[0];
  },

  async delete(id, organization_id) {
    const result = await pool.query(`DELETE FROM programs WHERE id=$1 AND organization_id=$2 RETURNING *`, [id, organization_id]);
    return result.rows[0];
  },

  async getByStatus(status, organization_id) {
    const result = await pool.query(`SELECT * FROM programs WHERE status=$1 ABD organization_id=$2 ORDER BY date ASC`, [status, organization_id]);
    return result.rows;
  },
};
