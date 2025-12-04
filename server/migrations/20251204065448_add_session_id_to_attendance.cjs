exports.up = async function (knex) {
  const hasSessionId = await knex.schema.hasColumn("attendance_records", "session_id");
  if (!hasSessionId) {
    await knex.schema.alterTable("attendance_records", (table) => {
      table
        .integer("session_id")
        .unsigned()
        .references("id")
        .inTable("sessions")
        .onDelete("SET NULL"); // or CASCADE or RESTRICT
    });
  }
};

exports.down = async function (knex) {
  const hasSessionId = await knex.schema.hasColumn("attendance_records", "session_id");
  if (hasSessionId) {
    await knex.schema.alterTable("attendance_records", (table) => {
      table.dropColumn("session_id");
    });
  }
};
