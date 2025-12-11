exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable("maintenance_records");

  if (hasTable) {
    await knex.schema.alterTable("maintenance_records", (table) => {
      // First drop the old FK
      table.dropForeign("category_id");

      // Now add the correct FK
      table
        .foreign("category_id")
        .references("category_id")
        .inTable("asset_categories")
        .onDelete("RESTRICT");
    });
  }
};

exports.down = async function (knex) {
  const hasTable = await knex.schema.hasTable("maintenance_records");

  if (hasTable) {
    await knex.schema.alterTable("maintenance_records", (table) => {
      table.dropForeign("category_id");

    });
  }
};
