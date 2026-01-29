exports.up = async function(knex) {
  await knex.schema.alterTable("headquarters", (table) => {
    table.string("headquarters_account_id", 50).unique();
    table.text("password");
  });
}

exports.down = async function(knex) {
  await knex.schema.alterTable("headquarters", (table) => {
    table.dropColumn("headquarters_account_id");
    table.dropColumn("password");
  });
}
