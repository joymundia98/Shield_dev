/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // Rename student_id to congregant_id
  const hasStudentId = await knex.schema.hasColumn('attendance_records', 'student_id');
  if (hasStudentId) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.renameColumn('student_id', 'congregant_id');
    });
  }

  // Add attendance_date if it doesn't exist
  const hasAttendanceDate = await knex.schema.hasColumn('attendance_records', 'attendance_date');
  if (!hasAttendanceDate) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.date('attendance_date').notNullable().defaultTo(knex.fn.now());
    });
  }

  // Add created_at if it doesn't exist
  const hasCreatedAt = await knex.schema.hasColumn('attendance_records', 'created_at');
  if (!hasCreatedAt) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  // Ensure primary key is record_id
  const hasRecordId = await knex.schema.hasColumn('attendance_records', 'record_id');
  if (!hasRecordId) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.increments('record_id').primary();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  // Revert changes if needed
  const hasCongregantId = await knex.schema.hasColumn('attendance_records', 'congregant_id');
  if (hasCongregantId) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.renameColumn('congregant_id', 'student_id');
    });
  }

  const hasAttendanceDate = await knex.schema.hasColumn('attendance_records', 'attendance_date');
  if (hasAttendanceDate) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.dropColumn('attendance_date');
    });
  }

  const hasCreatedAt = await knex.schema.hasColumn('attendance_records', 'created_at');
  if (hasCreatedAt) {
    await knex.schema.alterTable('attendance_records', (table) => {
      table.dropColumn('created_at');
    });
  }
};
