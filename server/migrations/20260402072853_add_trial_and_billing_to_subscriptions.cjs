/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("subscriptions", (table) => {

    // ✅ billing cycle (snapshot from plan)
    table.string("billing_cycle").nullable();

    // ✅ trial days per subscription
    table.integer("trial_days").defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("subscriptions", (table) => {
    table.dropColumn("billing_cycle");
    table.dropColumn("trial_days");
  });
};