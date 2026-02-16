/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("users", function (table) {
    table
      .integer("headquarter_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("headquarters")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("users", function (table) {
    table.dropForeign(["headquarter_id"]);
    table.dropColumn("headquarter_id");
  });
};
