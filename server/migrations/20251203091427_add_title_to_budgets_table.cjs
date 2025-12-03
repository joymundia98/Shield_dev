/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  const hasTitle = await knex.schema.hasColumn("budgets", "title");
  if (!hasTitle) {
    await knex.schema.alterTable("budgets", (table) => {
      table.string("title", 255).notNullable().defaultTo("Untitled");
    });
  }
};

exports.down = async function(knex) {
  const hasTitle = await knex.schema.hasColumn("budgets", "title");
  if (hasTitle) {
    await knex.schema.alterTable("budgets", (table) => {
      table.dropColumn("title");
    });
  }
};
