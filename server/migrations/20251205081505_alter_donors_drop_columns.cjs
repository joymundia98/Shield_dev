/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  const hasDonorType = await knex.schema.hasColumn("donors", "donor_type");
  const hasContactInfo = await knex.schema.hasColumn("donors", "contact_info");

  return knex.schema.alterTable("donors", (table) => {
    if (hasDonorType) table.dropColumn("donor_type");
    if (hasContactInfo) table.dropColumn("contact_info");
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  // Reverse the migration (add columns back)
  return knex.schema.alterTable("donors", (table) => {
    table.string("donor_type").nullable();
    table.text("contact_info").nullable();
  });
};
