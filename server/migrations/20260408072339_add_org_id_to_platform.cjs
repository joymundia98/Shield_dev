/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("platform_admins", (table) => {

    table
      .integer("organization_id")
      .unsigned()
      .references("id")
      .inTable("organizations")
      .onDelete("SET NULL");
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("platform_admins", (table) => {
    table.dropColumn("organization_id");
  });
};