/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  const hasCategory = await knex.schema.hasColumn('classes', 'category');
  const hasClassCategoryId = await knex.schema.hasColumn('classes', 'class_category_id');

  await knex.schema.alterTable('classes', (table) => {
    // Drop old category column
    if (hasCategory) {
      table.dropColumn('category');
    }

    // Add new FK column
    if (!hasClassCategoryId) {
      table
        .integer('class_category_id')
        .unsigned()
        .references('category_id')
        .inTable('class_categories')
        .onDelete('SET NULL');
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  const hasClassCategoryId = await knex.schema.hasColumn('classes', 'class_category_id');

  await knex.schema.alterTable('classes', (table) => {
    if (hasClassCategoryId) {
      table.dropColumn('class_category_id');
    }

    // Restore old column if rolling back
    table.string('category');
  });
};
