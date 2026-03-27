/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

  // PLANS TABLE
  await knex.schema.createTable("plans", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable(); // e.g. Free, Pro
    table.decimal("price", 10, 2).notNullable().defaultTo(0);
    table
      .string("billing_cycle")
    table.timestamps(true, true);
  });

  // SUBSCRIPTIONS TABLE
  await knex.schema.createTable("subscriptions", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("plan_id")
      .unsigned()
      .references("id")
      .inTable("plans")
      .onDelete("SET NULL");

    table
      .integer("organization_id")
      .unsigned()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");

    table
      .integer("headquarters_id")
      .unsigned()
      .references("id")
      .inTable("headquarters")
      .onDelete("CASCADE");

    table
      .string("status")
      .notNullable()
      .defaultTo("trialing");

    table.timestamp("start_date").defaultTo(knex.fn.now());
    table.timestamp("end_date").nullable();
    table.timestamp("trial_end").nullable();

    table.timestamps(true, true);
  });

  // PAYMENTS TABLE
  await knex.schema.createTable("payments", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("organization_id")
      .unsigned()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");

    table
      .integer("headquarters_id")
      .unsigned()
      .references("id")
      .inTable("headquarters")
      .onDelete("CASCADE");

    table
      .decimal("amount", 10, 2)
      .notNullable();

    table.string("payment_provider").notNullable(); // e.g. stripe, paypal
    table.string("provider_payment_id").nullable();

    table
      .string("status")
      .notNullable()
      .defaultTo("pending");

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("payments");
  await knex.schema.dropTableIfExists("subscriptions");
  await knex.schema.dropTableIfExists("plans");

  // Drop enums (PostgreSQL specific)
  await knex.raw("DROP TYPE IF EXISTS payment_status_enum");
  await knex.raw("DROP TYPE IF EXISTS subscription_status_enum");
  await knex.raw("DROP TYPE IF EXISTS billing_cycle_enum");
};