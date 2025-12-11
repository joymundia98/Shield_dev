/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('asset_depreciation', 'useful_life');
  if (!hasColumn) {
    await knex.schema.alterTable('asset_depreciation', (table) => {
      table.integer('useful_life').comment('Useful life of the asset in years');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('asset_depreciation', 'useful_life');
  if (hasColumn) {
    await knex.schema.alterTable('asset_depreciation', (table) => {
      table.dropColumn('useful_life');
    });
  }
};
