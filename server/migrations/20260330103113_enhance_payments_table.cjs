/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {

  /**
   * 1. PAYMENT METHODS TABLE
   */
  await knex.schema.createTable("payment_methods", (table) => {
    table.increments("id").primary();

    table.string("name").notNullable(); 
    table.string("provider").nullable(); 
    table.boolean("is_active").defaultTo(true);

    table.timestamps(true, true);
  });

  /**
   * 2. REFERENCES TABLE
   */
  await knex.schema.createTable("references", (table) => {
    table.increments("id").primary();

    table.string("type").notNullable(); 

    table.timestamps(true, true);
  });

  /**
   * 3. ALTER PAYMENTS TABLE
   */
  await knex.schema.alterTable("payments", (table) => {

    table.timestamp("payment_date").nullable();

    table
      .integer("payment_method_id")
      .unsigned()
      .references("id")
      .inTable("payment_methods")
      .onDelete("SET NULL");

    // ✅ FIXED: now inside table block
    table
      .integer("reference_id")
      .unsigned()
      .references("id")
      .inTable("references")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("payments", (table) => {
    table.dropColumn("payment_date");
    table.dropColumn("payment_method_id");
    table.dropColumn("reference_id");
  });

  await knex.schema.dropTableIfExists("references");
  await knex.schema.dropTableIfExists("payment_methods");
};