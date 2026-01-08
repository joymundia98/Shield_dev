import { pool } from "../../../server.js";

const MemberStatistics = {
  // GET ALL (organization scoped)
  async getAll(organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM member_statistics
      WHERE organization_id = $1
      ORDER BY stat_date DESC
      `,
      [organization_id]
    );

    return result.rows;
  },

  // GET BY DATE (organization scoped)
  async getByDate(stat_date, organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM member_statistics
      WHERE stat_date = $1
        AND organization_id = $2
      `,
      [stat_date, organization_id]
    );

    return result.rows[0] || null;
  },

  // UPSERT (organization enforced)
  async upsert(data, organization_id) {
    const fields = [
      "organization_id",
      "stat_date",
      "total_members",
      "total_widows",
      "total_orphans",
      "total_disabled",
      "male_members",
      "female_members",
      "age_0_12",
      "age_13_18",
      "age_19_35",
      "age_36_60",
      "age_60_plus",
      "status_active",
      "status_visitor",
      "status_new_convert",
      "status_inactive",
      "status_transferred"
    ];

    const values = fields.map((field) =>
      field === "organization_id" ? organization_id : data[field]
    );

    const placeholders = values.map((_, i) => `$${i + 1}`).join(",");

    const updateSet = fields
      .filter((f) => !["stat_date", "organization_id"].includes(f))
      .map((f) => `${f} = EXCLUDED.${f}`)
      .join(", ");

    const query = `
      INSERT INTO member_statistics (${fields.join(", ")})
      VALUES (${placeholders})
      ON CONFLICT (organization_id, stat_date)
      DO UPDATE SET ${updateSet}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // RECALCULATE TODAY (organization scoped)
  async recalculateToday(organization_id) {
    const query = `
      WITH stats AS (
        SELECT
          $1::int AS organization_id,
          CURRENT_DATE AS stat_date,

          COUNT(*) AS total_members,
          COUNT(*) FILTER (WHERE widowed IS TRUE) AS total_widows,
          COUNT(*) FILTER (WHERE orphan IS TRUE) AS total_orphans,
          COUNT(*) FILTER (WHERE disabled IS TRUE) AS total_disabled,

          COUNT(*) FILTER (WHERE LOWER(gender) = 'male') AS male_members,
          COUNT(*) FILTER (WHERE LOWER(gender) = 'female') AS female_members,

          COUNT(*) FILTER (
            WHERE date_of_birth IS NOT NULL
            AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) BETWEEN 0 AND 12
          ) AS age_0_12,

          COUNT(*) FILTER (
            WHERE date_of_birth IS NOT NULL
            AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) BETWEEN 13 AND 18
          ) AS age_13_18,

          COUNT(*) FILTER (
            WHERE date_of_birth IS NOT NULL
            AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) BETWEEN 19 AND 35
          ) AS age_19_35,

          COUNT(*) FILTER (
            WHERE date_of_birth IS NOT NULL
            AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) BETWEEN 36 AND 60
          ) AS age_36_60,

          COUNT(*) FILTER (
            WHERE date_of_birth IS NOT NULL
            AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) > 60
          ) AS age_60_plus,

          COUNT(*) FILTER (WHERE status = 'Active') AS status_active,
          COUNT(*) FILTER (WHERE status = 'Visitor') AS status_visitor,
          COUNT(*) FILTER (WHERE status = 'New Convert') AS status_new_convert,
          COUNT(*) FILTER (WHERE status = 'Inactive') AS status_inactive,
          COUNT(*) FILTER (WHERE status = 'Transferred') AS status_transferred

        FROM members
        WHERE organization_id = $1
      )
      INSERT INTO member_statistics
      SELECT * FROM stats
      ON CONFLICT (organization_id, stat_date)
      DO UPDATE SET
        total_members = EXCLUDED.total_members,
        total_widows = EXCLUDED.total_widows,
        total_orphans = EXCLUDED.total_orphans,
        total_disabled = EXCLUDED.total_disabled,
        male_members = EXCLUDED.male_members,
        female_members = EXCLUDED.female_members,
        age_0_12 = EXCLUDED.age_0_12,
        age_13_18 = EXCLUDED.age_13_18,
        age_19_35 = EXCLUDED.age_19_35,
        age_36_60 = EXCLUDED.age_36_60,
        age_60_plus = EXCLUDED.age_60_plus,
        status_active = EXCLUDED.status_active,
        status_visitor = EXCLUDED.status_visitor,
        status_new_convert = EXCLUDED.status_new_convert,
        status_inactive = EXCLUDED.status_inactive,
        status_transferred = EXCLUDED.status_transferred
      RETURNING *;
    `;

    const result = await pool.query(query, [organization_id]);
    return result.rows[0];
  }
};

export default MemberStatistics;
