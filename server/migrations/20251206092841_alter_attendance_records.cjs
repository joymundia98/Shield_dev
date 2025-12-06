/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // Drop old columns if they exist
  const hasSessionId = await knex.schema.hasColumn('attendance_records', 'session_id');
  if (hasSessionId) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.dropColumn('session_id');
    });
  }

  const hasCongregantId = await knex.schema.hasColumn('attendance_records', 'congregant_id');
  if (hasCongregantId) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.dropColumn('congregant_id');
    });
  }

  // Add new foreign key columns
  await knex.schema.alterTable('attendance_records', (table) => {
    table
      .integer('service_id')
      .unsigned()
      .references('id')
      .inTable('services')
      .onDelete('SET NULL');

    table
      .integer('member_id')
      .unsigned()
      .references('member_id')
      .inTable('members')
      .onDelete('SET NULL');

    table
      .integer('visitor_id')
      .unsigned()
      .references('id')
      .inTable('visitors')
      .onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('attendance_records', (table) => {
    table.dropColumn('service_id');
    table.dropColumn('member_id');
    table.dropColumn('visitor_id');

  });
};
