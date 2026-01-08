/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  const hasVisitors = await knex.schema.hasTable("visitors");
  if (!hasVisitors) return;

  const hasServiceId = await knex.schema.hasColumn("visitors", "service_id");
  const hasChurchFindOut = await knex.schema.hasColumn("visitors", "church_find_out");

  await knex.schema.alterTable("visitors", (table) => {
    if (!hasServiceId) {
      table
        .integer("service_id")
        .unsigned()
        .references("id")
        .inTable("services")
        .onDelete("SET NULL");
    }

    if (!hasChurchFindOut) {
      table.string("church_find_out");
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  const hasVisitors = await knex.schema.hasTable("visitors");
  if (!hasVisitors) return;

  await knex.schema.alterTable("visitors", (table) => {
    table.dropColumn("service_id");
    table.dropColumn("church_find_out");
  });
};
