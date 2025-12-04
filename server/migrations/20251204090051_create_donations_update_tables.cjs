/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // 1. donor_types
  if (!(await knex.schema.hasTable("donor_types"))) {
    await knex.schema.createTable("donor_types", (table) => {
      table.increments("id").primary();
      table.string("name", 100).unique().notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }

  // 2. donor_subcategories
  if (!(await knex.schema.hasTable("donor_subcategories"))) {
    await knex.schema.createTable("donor_subcategories", (table) => {
      table.increments("id").primary();
      table
        .integer("donor_type_id")
        .unsigned()
        .references("id")
        .inTable("donor_types")
        .onDelete("CASCADE")
        .notNullable();
      table.string("name", 100).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.unique(["donor_type_id", "name"]);
    });
  }

  // 3. purposes
  if (!(await knex.schema.hasTable("purposes"))) {
    await knex.schema.createTable("purposes", (table) => {
      table.increments("id").primary();
      table.string("name", 100).unique().notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }

  // 4. donors (ALTER existing table)
  const donorColumns = await Promise.all([
    knex.schema.hasColumn("donors", "donor_type_id"),
    knex.schema.hasColumn("donors", "donor_subcategory_id"),
    knex.schema.hasColumn("donors", "email"),
    knex.schema.hasColumn("donors", "phone"),
    knex.schema.hasColumn("donors", "address"),
    knex.schema.hasColumn("donors", "preferred_contact_method"),
    knex.schema.hasColumn("donors", "notes"),
    knex.schema.hasColumn("donors", "is_active"),
  ]);

  await knex.schema.alterTable("donors", (table) => {
    if (!donorColumns[0])
      table
        .integer("donor_type_id")
        .unsigned()
        .references("id")
        .inTable("donor_types")
        .onDelete("SET NULL");
    if (!donorColumns[1])
      table
        .integer("donor_subcategory_id")
        .unsigned()
        .references("id")
        .inTable("donor_subcategories")
        .onDelete("SET NULL");
    if (!donorColumns[2]) table.string("email", 150);
    if (!donorColumns[3]) table.string("phone", 50);
    if (!donorColumns[4]) table.text("address");
    if (!donorColumns[5]) table.string("preferred_contact_method", 50);
    if (!donorColumns[6]) table.text("notes");
    if (!donorColumns[7]) table.boolean("is_active").defaultTo(true);
  });

  // 5. donations
  if (!(await knex.schema.hasTable("donations"))) {
    await knex.schema.createTable("donations", (table) => {
      table.increments("id").primary();
      table
        .integer("donor_id")
        .unsigned()
        .references("id")
        .inTable("donors")
        .onDelete("SET NULL");
      table.boolean("donor_registered").notNullable();
      table.boolean("is_anonymous").defaultTo(false);
      table.string("donor_name", 150);
      table.string("donor_phone", 50);
      table.string("donor_email", 150);
      table
        .integer("donor_type_id")
        .unsigned()
        .references("id")
        .inTable("donor_types")
        .onDelete("SET NULL");
      table
        .integer("donor_subcategory_id")
        .unsigned()
        .references("id")
        .inTable("donor_subcategories")
        .onDelete("SET NULL");
      table
        .integer("purpose_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("purposes")
        .onDelete("RESTRICT");
      table.date("date").notNullable();
      table.decimal("amount", 12, 2).notNullable();
      table.string("method", 50).notNullable();
      table.text("notes");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("donations");

  // Optional: only drop columns if they exist
  await knex.schema.alterTable("donors", (table) => {
    table.dropColumn("donor_type_id");
    table.dropColumn("donor_subcategory_id");
    table.dropColumn("email");
    table.dropColumn("phone");
    table.dropColumn("address");
    table.dropColumn("preferred_contact_method");
    table.dropColumn("notes");
    table.dropColumn("is_active");
  });

  await knex.schema.dropTableIfExists("purposes");
  await knex.schema.dropTableIfExists("donor_subcategories");
  await knex.schema.dropTableIfExists("donor_types");
};
