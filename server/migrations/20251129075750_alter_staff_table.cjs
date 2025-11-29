exports.up = async function (knex) {
  // 1. DROP CHECK CONSTRAINT IF EXISTS
  await knex.raw(`
    ALTER TABLE staff
    DROP CONSTRAINT IF EXISTS staff_status_check;
  `);

  // 2. status should remain a plain text with default
  await knex.raw(`
    ALTER TABLE staff
    ALTER COLUMN status TYPE text,
    ALTER COLUMN status SET DEFAULT 'active';
  `);

  // 3. FIX DUPLICATE COLUMNS BEFORE RENAMING
  // -------------------------------------------------------

  // If "join_date" already exists, drop "joinDate"
  const hasJoinDate = await knex.schema.hasColumn("staff", "joinDate");
  const hasJoin_date = await knex.schema.hasColumn("staff", "join_date");

  if (hasJoinDate && hasJoin_date) {
    // drop the duplicate one ("joinDate")
    await knex.schema.alterTable("staff", table => {
      table.dropColumn("joinDate");
    });
  } else if (hasJoinDate && !hasJoin_date) {
    // safe to rename
    await knex.schema.alterTable("staff", table => {
      table.renameColumn("joinDate", "join_date");
    });
  }

  // Rename NRC → nrc ONLY if needed
  const hasNRC = await knex.schema.hasColumn("staff", "NRC");
  if (hasNRC) {
    await knex.schema.alterTable("staff", table => {
      table.renameColumn("NRC", "nrc");
    });
  }
};

exports.down = async function (knex) {
  // OPTIONAL ROLLBACK
  const hasJoin_date = await knex.schema.hasColumn("staff", "join_date");
  if (hasJoin_date) {
    await knex.schema.alterTable("staff", table => {
      table.renameColumn("join_date", "joinDate");
    });
  }

  const hasNrc = await knex.schema.hasColumn("staff", "nrc");
  if (hasNrc) {
    await knex.schema.alterTable("staff", table => {
      table.renameColumn("nrc", "NRC");
    });
  }

  await knex.raw(`
    ALTER TABLE staff
    ALTER COLUMN status TYPE text;
  `);
};
