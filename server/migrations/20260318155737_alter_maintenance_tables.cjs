exports.up = function (knex) {
  return knex.schema
    .alterTable("maintenance_records", function (table) {
      table
        .integer("organization_id")
        .unsigned()
        .references("id")
        .inTable("organizations")
        .onDelete("CASCADE")
        .index();
    })
    .alterTable("maintenance_categories", function (table) {
      table
        .integer("organization_id")
        .unsigned()
        .references("id")
        .inTable("organizations")
        .onDelete("CASCADE")
        .index();
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable("maintenance_records", function (table) {
      table.dropColumn("organization_id");
    })
    .alterTable("maintenance_categories", function (table) {
      table.dropColumn("organization_id");
    });
};