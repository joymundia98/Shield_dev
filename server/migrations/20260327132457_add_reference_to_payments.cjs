exports.up = async function (knex) {
  await knex.schema.alterTable("payments", (table) => {
    table.string("reference_type");
    table.integer("reference_id");
  });

  // ⚠️ Then enforce NOT NULL safely (after columns exist)
  await knex.raw(`
    UPDATE payments
    SET reference_type = 'unknown', reference_id = 0
    WHERE reference_type IS NULL OR reference_id IS NULL
  `);

  await knex.schema.alterTable("payments", (table) => {
    table.string("reference_type").notNullable().alter();
    table.integer("reference_id").notNullable().alter();
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("payments", (table) => {
    table.dropColumn("reference_type");
    table.dropColumn("reference_id");
  });
};