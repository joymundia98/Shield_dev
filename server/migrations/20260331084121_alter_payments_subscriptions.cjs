/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {

  /**
   * 1. SUBSCRIPTIONS TABLE
   */
  await knex.schema.alterTable("subscriptions", (table) => {
    //add remarks
    table.text("remarks").nullable();
  });

  /**
   * 2. PAYMENTS TABLE
   */
  await knex.schema.alterTable("payments", (table) => {
    //remove provider_id (if exists)
    table.dropColumn("provider_payment_id");

    //add subscription_id
    table
      .integer("subscription_id")
      .unsigned()
      .references("id")
      .inTable("subscriptions")
      .onDelete("SET NULL");

    //add remarks
    table.text("remarks").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {

  await knex.schema.alterTable("subscriptions", (table) => {
    table.dropColumn("remarks");
  });

  await knex.schema.alterTable("payments", (table) => {
    table.integer("provider_payment_id").nullable();
    table.dropColumn("subscription_id");
    table.dropColumn("remarks");
  });
};