/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Create asset_categories if not exists
  const hasAssetCategories = await knex.schema.hasTable("asset_categories");
  if (!hasAssetCategories) {
    await knex.schema.createTable("asset_categories", (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable().unique();
      table.text("description");
      table.integer("total_assets").defaultTo(0);
    });
  }

  // Create maintenance_categories if not exists
  const hasMaintenanceCategories = await knex.schema.hasTable("maintenance_categories");
  if (!hasMaintenanceCategories) {
    await knex.schema.createTable("maintenance_categories", (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable().unique();
      table.text("description");
      table.integer("total_records").defaultTo(0);
    });
  }

  // Create assets if not exists
  const hasAssets = await knex.schema.hasTable("assets");
  if (!hasAssets) {
    await knex.schema.createTable("assets", (table) => {
      table.increments("id").primary();
      table.string("name", 150).notNullable();

      table
        .integer("category_id")
        .notNullable()
        .references("id")
        .inTable("asset_categories")
        .onDelete("RESTRICT");

      table.string("location", 150).notNullable();

      table.string("condition", 50).notNullable(); // Use VARCHAR, remove check for compatibility

      table
        .integer("assigned_to")
        .references("id")
        .inTable("members")
        .onDelete("SET NULL");

      table.decimal("initial_value", 12, 2).notNullable();
      table.decimal("current_value", 12, 2).notNullable();

      // PostgreSQL stored generated column
      table.specificType(
        "depreciation_rate",
        "NUMERIC(5,2) GENERATED ALWAYS AS ((initial_value - current_value) / initial_value * 100) STORED"
      );

      table.boolean("under_maintenance").defaultTo(false);
    });
  }

  // Create maintenance_records if not exists
  const hasMaintenanceRecords = await knex.schema.hasTable("maintenance_records");
  if (!hasMaintenanceRecords) {
    await knex.schema.createTable("maintenance_records", (table) => {
      table.increments("id").primary();

      table
        .integer("asset_id")
        .notNullable()
        .references("asset_id")
        .inTable("assets")
        .onDelete("CASCADE");

      table
        .integer("category_id")
        .notNullable()
        .references("id")
        .inTable("maintenance_categories")
        .onDelete("RESTRICT");

      table.date("last_service").notNullable();
      table.date("next_service").notNullable();

      table.string("status", 50).notNullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  if (await knex.schema.hasTable("maintenance_records")) {
    await knex.schema.dropTable("maintenance_records");
  }
  if (await knex.schema.hasTable("assets")) {
    await knex.schema.dropTable("assets");
  }
  if (await knex.schema.hasTable("maintenance_categories")) {
    await knex.schema.dropTable("maintenance_categories");
  }
  if (await knex.schema.hasTable("asset_categories")) {
    await knex.schema.dropTable("asset_categories");
  }
};
