// migrations/20251231092122_add_org_id_to_tables.cjs

exports.up = async function (knex) {
  const tables = [
    "worship",
    "special_services",
    "social_links",
    "sacraments",
    "role_permissions",
    "follow_ups",
    "follow_up_sessions"
  ];

  for (const table of tables) {
    const exists = await knex.schema.hasTable(table);
    if (!exists) continue;

    const hasColumn = await knex.schema.hasColumn(table, "organization_id");
    if (hasColumn) continue;

    await knex.schema.alterTable(table, (t) => {
      t
        .integer("organization_id")
        .unsigned()
        .references("id")
        .inTable("organizations")
        .onDelete("CASCADE")
        .index();
    });
  }
};

exports.down = async function (knex) {
  const tables = [
    "worship",
    "special_services",
    "social_links",
    "sacraments",
    "role_permissions",
    "follow_ups",
    "follow_up_sessions"
  ];

  for (const table of tables) {
    const exists = await knex.schema.hasTable(table);
    if (!exists) continue;

    const hasColumn = await knex.schema.hasColumn(table, "organization_id");
    if (!hasColumn) continue;

    await knex.schema.alterTable(table, (t) => {
      t.dropColumn("organization_id");
    });
  }
};
