/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // 1. Drop session_id and congregant_id from attendance_records
  const hasSessionId = await knex.schema.hasColumn("attendance_records", "session_id");
  const hasCongregantId = await knex.schema.hasColumn("attendance_records", "congregant_id");

  await knex.schema.alterTable("attendance_records", (table) => {
    if (hasSessionId) table.dropColumn("session_id");
    if (hasCongregantId) table.dropColumn("congregant_id");
  });

  // 2. Drop congregants table entirely
  const hasCongregants = await knex.schema.hasTable("congregants");
  if (hasCongregants) {
    await knex.schema.dropTable("congregants");
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  // 1. Recreate congregants table (simple structure - update as needed)
  await knex.schema.createTable("congregants", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("gender");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // 2. Re-add columns to attendance_records
  await knex.schema.alterTable("attendance_records", (table) => {
    table.integer("session_id");
    table.integer("congregant_id");
  });
};
