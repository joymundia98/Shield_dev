/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable('class_categories');

  if (!hasTable) {
    await knex.schema.createTable('class_categories', (table) => {
      table.increments('category_id').primary();

      table.string('name', 255).notNullable().unique();
      table.text('description');

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  const hasTable = await knex.schema.hasTable('class_categories');

  if (hasTable) {
    await knex.schema.dropTable('class_categories');
  }
};
