/**
 * @param { import("knex").Knex } knex
 */

exports.up = async function (knex) {
  const hasUsers = await knex.schema.hasTable("users");
  if (!hasUsers) return;

  const hasStatus = await knex.schema.hasColumn("users", "status");

  // If status exists, drop default
  if (hasStatus) {
    await knex.schema.alterTable("users", (table) => {
      table.string("status").alter(); // removes default
    });

    await knex.raw(`ALTER TABLE users ALTER COLUMN status DROP DEFAULT`);
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  const hasUsers = await knex.schema.hasTable("users");
  if (!hasUsers) return;

  const hasStatus = await knex.schema.hasColumn("users", "status");

  if (hasStatus) {
    await knex.schema.alterTable("users", (table) => {
      table.string("status").defaultTo("active").alter();
    });
  }
};
