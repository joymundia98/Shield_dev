/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
    ALTER TABLE visitors
    ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Rollback: remove the identity generation
  await knex.raw(`
    ALTER TABLE visitors
    ALTER COLUMN id DROP IDENTITY IF EXISTS;
  `);
};