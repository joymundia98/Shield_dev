// migrations/XXXXXX_alter_donors_table.cjs

exports.up = async function (knex) {
  return knex.schema.alterTable("donors", (table) => {
    // Existing columns:
    // id, donor_type, name, contact_info, created_at

    // New fields
    table.string("email");
    table.string("phone");
    table.string("address");

    table
      .integer("member_id")
      .references("member_id")
      .inTable("members")
      .onDelete("SET NULL");

    table
      .integer("organization_id")
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");

    table.string("preferred_contact_method"); // e.g., phone, email, whatsapp
    table.text("notes");

    table.boolean("is_active").defaultTo(true);

    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable("donors", (table) => {
    table.dropColumn("email");
    table.dropColumn("phone");
    table.dropColumn("address");
    table.dropColumn("member_id");
    table.dropColumn("organization_id");
    table.dropColumn("preferred_contact_method");
    table.dropColumn("notes");
    table.dropColumn("is_active");
    table.dropColumn("updated_at");
  });
};
