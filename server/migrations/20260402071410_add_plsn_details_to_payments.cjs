exports.up = async function (knex) {
  await knex.schema.alterTable("payments", (table) => {

    // ✅ plan reference
    table
      .integer("plan_id")
      .unsigned()
      .references("id")
      .inTable("plans")
      .onDelete("SET NULL");

    // ✅ snapshot of billing cycle (monthly, yearly, etc)
    table.string("billing_cycle").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("payments", (table) => {
    table.dropColumn("plan_id");
    table.dropColumn("billing_cycle");
  });
};