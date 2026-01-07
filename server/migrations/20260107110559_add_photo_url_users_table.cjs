/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  const hasOrgs = await knex.schema.hasTable("users");
  if (hasOrgs) {
    const hasPassword = await knex.schema.hasColumn("users", "photo_url");
    if (!hasPassword) {
      await knex.schema.alterTable("users", (table) => {
        table.string("photo_url", 255);
      });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  const hasOrgs = await knex.schema.hasTable("users");
  if (hasOrgs) {
    const hasPassword = await knex.schema.hasColumn("users", "photo_url");
    if (hasPassword) {
      await knex.schema.alterTable("users", (table) => {
        table.dropColumn("photo_url");
      });
    }
  }
};
