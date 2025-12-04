/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // Drop old incorrect FKs if they exist
  await knex.raw(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'attendance_records_session_id_foreign'
      ) THEN
        ALTER TABLE attendance_records
        DROP CONSTRAINT attendance_records_session_id_foreign;
      END IF;

      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'attendance_records_student_id_foreign'
      ) THEN
        ALTER TABLE attendance_records
        DROP CONSTRAINT attendance_records_student_id_foreign;
      END IF;
    END$$;
  `);

  // Add correct FK for session_id if not exists
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'attendance_records_session_id_foreign'
      ) THEN
        ALTER TABLE attendance_records
        ADD CONSTRAINT attendance_records_session_id_foreign
        FOREIGN KEY (session_id)
        REFERENCES sessions(id)
        ON DELETE SET NULL;
      END IF;
    END$$;
  `);

  // Add correct FK for congregant_id if not exists
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'attendance_records_congregant_id_foreign'
      ) THEN
        ALTER TABLE attendance_records
        ADD CONSTRAINT attendance_records_congregant_id_foreign
        FOREIGN KEY (congregant_id)
        REFERENCES congregants(id)
        ON DELETE CASCADE;
      END IF;
    END$$;
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  // Drop the newly created foreign keys
  await knex.raw(`
    ALTER TABLE attendance_records
    DROP CONSTRAINT IF EXISTS attendance_records_session_id_foreign;
  `);

  await knex.raw(`
    ALTER TABLE attendance_records
    DROP CONSTRAINT IF EXISTS attendance_records_congregant_id_foreign;
  `);
};
