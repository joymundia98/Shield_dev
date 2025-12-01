exports.up = async function (knex) {
  await knex.schema.alterTable('members', (table) => {
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('members', (table) => {
    table.dropColumn('user_id');
  });
};
