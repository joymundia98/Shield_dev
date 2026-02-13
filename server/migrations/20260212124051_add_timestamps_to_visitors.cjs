exports.up = async function(knex) {
  await knex.schema.alterTable('visitors', (table) => {
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

exports.down = async function(knex) {
  await knex.schema.alterTable('visitors', (table) => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
}
