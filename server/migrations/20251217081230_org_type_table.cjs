/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // 1. Create organization_type table
  const hasOrgType = await knex.schema.hasTable("organization_type");
  if (!hasOrgType) {
    await knex.schema.createTable("organization_type", (table) => {
      table.increments("org_type_id").primary();
      table.string("name", 255).notNullable(); // Example: 'Headquarter', 'Church'
      table.text("description");
      table.timestamps(true, true);
    });
  }

  // 2. Alter organizations table
  const hasOrgs = await knex.schema.hasTable("organizations");
  if (hasOrgs) {
    await knex.schema.alterTable("organizations", async (table) => {
      // Drop the old type column if it exists
      table.dropColumn("type");

      // Add the foreign key to organization_type
      table
        .integer("org_type_id")
        .unsigned()
        .references("org_type_id")
        .inTable("organization_type")
        .onDelete("SET NULL");

      // Optional: add password field for multi-tenancy
      if (!(await knex.schema.hasColumn("organizations", "password"))) {
        table.string("password", 255);
      }
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  const hasOrgs = await knex.schema.hasTable("organizations");
  if (hasOrgs) {
    await knex.schema.alterTable("organizations", (table) => {
      table.dropColumn("org_type_id");
      table.dropColumn("password");
      table.string("type", 255); // Restore old type column
    });
  }

  const hasOrgType = await knex.schema.hasTable("organization_type");
  if (hasOrgType) {
    await knex.schema.dropTable("organization_type");
  }
};
