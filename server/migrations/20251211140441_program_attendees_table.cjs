exports.up = async function(knex) {
  const hasAttendees = await knex.schema.hasTable("attendees");
  if (!hasAttendees) {
    await knex.schema.createTable("attendees", (table) => {
      table.increments("attendee_id").primary();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable().unique();
      table.string("phone", 15);
      table.integer("age").notNullable();
      table.string("gender", 50).notNullable();
      table.integer("program_id")
           .unsigned()
           .notNullable()
           .references("id")
           .inTable("programs")
           .onDelete("CASCADE");
      table.string("role", 255);
      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  const hasAttendees = await knex.schema.hasTable("attendees");
  if (hasAttendees) await knex.schema.dropTable("attendees");
};
