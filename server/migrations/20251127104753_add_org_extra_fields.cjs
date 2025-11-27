/**
 * @param { import("knex").Knex } knex
 */

exports.up = async function (knex) {
  return knex.schema.alterTable("organizations", (table) => {
    table.string("organization_email").unique();
    table.string("organization_account_id");
    table.string("type"); // e.g., "church", "ngo", "school", etc.
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable("organizations", (table) => {
    table.dropColumn("organization_email");
    table.dropColumn("organization_account_id");
    table.dropColumn("type");
  });
};


