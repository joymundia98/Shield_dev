/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {

  /**
   * 1. SUBSCRIPTIONS TABLE
   */
  await knex.schema.alterTable("payments", (table) => {
    //add remarks
    table.text("date").nullable();
  });

};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {

  await knex.schema.alterTable("payments", (table) => {
    table.dropColumn("date");
  });
};