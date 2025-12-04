/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  // 1. visitors
  if (!(await knex.schema.hasTable("visitors"))) {
    await knex.schema.createTable("visitors", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("gender", 10).checkIn(["Male", "Female"]);
      table.integer("age").checkBetween([0, 120]);
      table.date("visit_date").notNullable();
      table.text("address");
      table.string("phone", 50);
      table.string("email", 255);
      table.string("invited_by", 255);
      table.text("photo_url");
      table.boolean("first_time").defaultTo(true);
      table.boolean("needs_follow_up").defaultTo(false);
    });
  }

  // 2. services
  if (!(await knex.schema.hasTable("services"))) {
    await knex.schema.createTable("services", (table) => {
      table.increments("id").primary();
      table.string("name", 100).unique().notNullable();
    });

    // Seed services
    await knex("services").insert([
      { name: "Sunday Service" },
      { name: "Midweek Service" },
      { name: "Youth Service" },
      { name: "Special Program" },
    ]);
  }

  // 3. referrals
  if (!(await knex.schema.hasTable("referrals"))) {
    await knex.schema.createTable("referrals", (table) => {
      table.increments("id").primary();
      table.string("source", 100).unique().notNullable();
    });

    // Seed referrals
    await knex("referrals").insert([
      { source: "Friend/Family" },
      { source: "Online Search" },
      { source: "Social Media" },
      { source: "Church Event" },
      { source: "Walk-in" },
    ]);
  }

  // 4. visitor_service (junction table)
  if (!(await knex.schema.hasTable("visitor_service"))) {
    await knex.schema.createTable("visitor_service", (table) => {
      table.integer("visitor_id").unsigned().notNullable()
        .references("id").inTable("visitors").onDelete("CASCADE");
      table.integer("service_id").unsigned().notNullable()
        .references("id").inTable("services").onDelete("CASCADE");
      table.primary(["visitor_id", "service_id"]);
    });
  }

  // 5. visitor_referral (junction table)
  if (!(await knex.schema.hasTable("visitor_referral"))) {
    await knex.schema.createTable("visitor_referral", (table) => {
      table.integer("visitor_id").unsigned().notNullable()
        .references("id").inTable("visitors").onDelete("CASCADE");
      table.integer("referral_id").unsigned().notNullable()
        .references("id").inTable("referrals").onDelete("CASCADE");
      table.primary(["visitor_id", "referral_id"]);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("visitor_referral");
  await knex.schema.dropTableIfExists("visitor_service");
  await knex.schema.dropTableIfExists("referrals");
  await knex.schema.dropTableIfExists("services");
  await knex.schema.dropTableIfExists("visitors");
};
