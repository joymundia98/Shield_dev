exports.up = async function (knex) {
  await knex.schema.createTable("platform_admins", (table) => {
    table.increments("id").primary();

    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();

    table.string("phone").nullable();
    table.string("photo_url").nullable();

    // Role for platform-level access
    table
      .integer("role_id")
      .unsigned()
      .references("id")
      .inTable("roles")
      .onDelete("SET NULL");

    // Status control
    table.string("status");

    // Security fields
    table.boolean("is_super_admin").defaultTo(true);
    table.timestamp("last_login_at").nullable();

    // Audit
    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("platform_admins");
};