exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.text("reset_token");
    table.timestamp("reset_token_expiry");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("reset_token");
    table.dropColumn("reset_token_expiry");
  });
};