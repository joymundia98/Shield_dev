// migrations/YYYYMMDD_create_headquarters.js

exports.up = async function(knex) {
  // ============================
  // 1. Create headquarters table
  // ============================
  await knex.schema.createTable("headquarters", table => {
    table.increments("id").primary();

    table.string("name").notNullable();
    table.string("code").unique(); // optional: CCZ, ZCCB, etc
    table.string("email");
    table.string("phone");

    table.string("region");
    table.string("country");

    table.string("hq_status");

    table.timestamps(true, true);
  });

  // =====================================
  // 2. Link organizations → headquarters
  // =====================================
  await knex.schema.alterTable("organizations", table => {
    table
      .integer("headquarters_id")
      .unsigned()
      .references("id")
      .inTable("headquarters")
      .onDelete("SET NULL")
      .index();
  });
}

exports.down = async function(knex) {
  // ============================
  // Remove column from orgs
  // ============================
  await knex.schema.alterTable("organizations", table => {
    table.dropColumn("headquarters_id");
  });

  // ============================
  // Drop headquarters table
  // ============================
  await knex.schema.dropTableIfExists("headquarters");

  // ============================
  // Drop enum
  // ============================
  await knex.raw(`DROP TYPE IF EXISTS hq_status`);
}
