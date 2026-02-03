/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("attendance_records", (table) => {
    table
      .integer("headquarters_id")
      .unsigned()
      .references("id")
      .inTable("headquarters")
      .onDelete("SET NULL")
      .index();
  });

    await knex.schema.alterTable("attendance", (table) => {
    table
      .integer("headquarters_id")
      .unsigned()
      .references("id")
      .inTable("headquarters")
      .onDelete("SET NULL")
      .index();
  });

  await knex.schema.alterTable("converts", (table) => {
    table
      .integer("headquarters_id")
      .unsigned()
      .references("id")
      .inTable("headquarters")
      .onDelete("SET NULL")
      .index();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("attendance_records", (table) => {
    table.dropForeign(["headquarters_id"]);
    table.dropColumn("headquarters_id");
  });

  await knex.schema.alterTable("attendance", (table) => {
    table.dropForeign(["headquarters_id"]);
    table.dropColumn("headquarters_id");
  });

  await knex.schema.alterTable("converts", (table) => {
    table.dropForeign(["headquarters_id"]);
    table.dropColumn("headquarters_id");
  });
};
