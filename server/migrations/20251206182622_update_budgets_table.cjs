/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. Drop income_subcategory_id column
  const hasIncomeCol = await knex.schema.hasColumn('budgets', 'income_subcategory_id');
  if (hasIncomeCol) {
    await knex.schema.alterTable('budgets', (table) => {
      table.dropColumn('income_subcategory_id');
    });
  }

  // 2. Drop existing category_id column
  const hasCategoryCol = await knex.schema.hasColumn('budgets', 'category_id');
  if (hasCategoryCol) {
    await knex.schema.alterTable('budgets', (table) => {
      table.dropColumn('category_id');
    });
  }

  // 3. Add new category_id referencing expense_categories
  const hasNewCategoryCol = await knex.schema.hasColumn('budgets', 'category_id');
  if (!hasNewCategoryCol) {
    await knex.schema.alterTable('budgets', (table) => {
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('expense_categories')
        .onDelete('SET NULL')
        .nullable();
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Rollback: drop new category_id and restore old columns
  const hasNewCategoryCol = await knex.schema.hasColumn('budgets', 'category_id');
  if (hasNewCategoryCol) {
    await knex.schema.alterTable('budgets', (table) => {
      table.dropColumn('category_id');
    });
  }

  await knex.schema.alterTable('budgets', (table) => {
    table.integer('category_id').nullable();
    table.integer('income_subcategory_id').nullable();
  });
}
