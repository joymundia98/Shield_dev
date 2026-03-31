/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // ✅ Rename table
  await knex.schema.renameTable("references", "payment_references");

  // ✅ Fix foreign key in payments table
  await knex.schema.alterTable("payments", (table) => {
    table.dropForeign("reference_id");

    table
      .foreign("reference_id")
      .references("id")
      .inTable("payment_references")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  // 🔁 Revert foreign key first
  await knex.schema.alterTable("payments", (table) => {
    table.dropForeign("reference_id");

    table
      .foreign("reference_id")
      .references("id")
      .inTable("references")
      .onDelete("CASCADE");
  });

  // 🔁 Rename back
  await knex.schema.renameTable("payment_references", "references");
};