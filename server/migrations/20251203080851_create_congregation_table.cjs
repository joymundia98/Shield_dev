/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // 1. Categories table
  if (!(await knex.schema.hasTable("categories"))) {
    await knex.schema.createTable("categories", (table) => {
      table.increments("id").primary();
      table.string("name", 50).unique().notNullable(); // e.g., Children / Adults
    });
  }

  // 2. Congregants table
  if (!(await knex.schema.hasTable("congregants"))) {
    await knex.schema.createTable("congregants", (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable();
      table.string("gender", 20).notNullable(); // Male / Female (NO ENUM)
      table
        .integer("category_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("categories")
        .onDelete("RESTRICT");
    });
  }

  // 3. Attendance records table
  if (!(await knex.schema.hasTable("attendance_records"))) {
    await knex.schema.createTable("attendance_records", (table) => {
      table.increments("id").primary();
      table
        .integer("congregant_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("congregants")
        .onDelete("CASCADE");

      table.date("attendance_date").notNullable();
      table.string("status", 20).notNullable(); // Present / Absent
      table.timestamp("created_at").defaultTo(knex.fn.now());

      table.unique(["congregant_id", "attendance_date"]);
    });
  }

  // 4. Member statistics table
  if (!(await knex.schema.hasTable("member_statistics"))) {
    await knex.schema.createTable("member_statistics", (table) => {
      table.date("stat_date").primary();
      table.integer("total_members").defaultTo(0);
      table.integer("total_widows").defaultTo(0);
      table.integer("total_orphans").defaultTo(0);
      table.integer("total_disabled").defaultTo(0);
      table.integer("male_members").defaultTo(0);
      table.integer("female_members").defaultTo(0);
      table.integer("age_0_12").defaultTo(0);
      table.integer("age_13_18").defaultTo(0);
      table.integer("age_19_35").defaultTo(0);
      table.integer("age_36_60").defaultTo(0);
      table.integer("age_60_plus").defaultTo(0);
      table.integer("status_active").defaultTo(0);
      table.integer("status_visitor").defaultTo(0);
      table.integer("status_new_convert").defaultTo(0);
      table.integer("status_inactive").defaultTo(0);
      table.integer("status_transferred").defaultTo(0);
    });
  }

  // 5. Alter members table to add missing fields
  const membersColumns = [
    "age",
    "disabled",
    "orphan",
    "widowed",
    "nrc",
    "guardian_name",
    "guardian_phone",
    "status",
  ];

  const hasColumns = await Promise.all(
    membersColumns.map((col) => knex.schema.hasColumn("members", col))
  );

  await knex.schema.alterTable("members", (table) => {
    if (!hasColumns[0]) table.integer("age");
    if (!hasColumns[1]) table.boolean("disabled").defaultTo(false);
    if (!hasColumns[2]) table.boolean("orphan").defaultTo(false);
    if (!hasColumns[3]) table.boolean("widowed").defaultTo(false);
    if (!hasColumns[4]) table.string("nrc", 50);
    if (!hasColumns[5]) table.string("guardian_name", 255);
    if (!hasColumns[6]) table.string("guardian_phone", 20);
    if (!hasColumns[7]) table.string("status", 50).defaultTo("Active");
  });
};

exports.down = async function (knex) {
  // Drop columns from members table
  const membersColumns = [
    "age",
    "disabled",
    "orphan",
    "widowed",
    "nrc",
    "guardian_name",
    "guardian_phone",
    "status",
  ];

  await knex.schema.alterTable("members", (table) => {
    membersColumns.forEach((col) => {
      table.dropColumn(col);
    });
  });

  // Drop other tables in reverse order of dependencies
  await knex.schema.dropTableIfExists("member_statistics");
  await knex.schema.dropTableIfExists("attendance_records");
  await knex.schema.dropTableIfExists("congregants");
  await knex.schema.dropTableIfExists("categories");
};
