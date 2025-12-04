/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // Create sessions table
  await knex.schema.createTable("sessions", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.date("date").notNullable();
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("sessions");
};
