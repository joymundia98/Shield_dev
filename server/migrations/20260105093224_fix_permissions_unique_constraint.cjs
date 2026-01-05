exports.up = async function(knex) {
  await knex.schema.alterTable("permissions", (table) => {
    table.dropUnique(["path"]);
    table.unique(["path", "method"], "permissions_path_method_unique");
  });
}

exports.down = async function(knex) {
  await knex.schema.alterTable("permissions", (table) => {
    table.dropUnique(["path", "method"], "permissions_path_method_unique");
    table.unique(["path"]);
  });
}
