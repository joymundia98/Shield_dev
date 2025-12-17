/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  const hasOrgs = await knex.schema.hasTable("organizations");
  if (hasOrgs) {
    const hasPassword = await knex.schema.hasColumn("organizations", "password");
    if (!hasPassword) {
      await knex.schema.alterTable("organizations", (table) => {
        table.string("password", 255);
      });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  const hasOrgs = await knex.schema.hasTable("organizations");
  if (hasOrgs) {
    const hasPassword = await knex.schema.hasColumn("organizations", "password");
    if (hasPassword) {
      await knex.schema.alterTable("organizations", (table) => {
        table.dropColumn("password");
      });
    }
  }
};
