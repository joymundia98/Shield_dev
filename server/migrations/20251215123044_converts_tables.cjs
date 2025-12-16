/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  const hasConverts = await knex.schema.hasTable('converts');
  if (!hasConverts) {
    await knex.schema.createTable('converts', (table) => {
      table.increments('id').primary();
      table.string('convert_type', 255).notNullable();
      table.date('convert_date').notNullable();
      table.integer('member_id').unsigned().references('member_id').inTable('members').onDelete('SET NULL');
      table.integer('visitor_id').unsigned().references('id').inTable('visitors').onDelete('SET NULL');
      table.string('follow_up_status')
      table.integer('organization_id').references('id').inTable('organizations').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function(knex) {
  const hasConverts = await knex.schema.hasTable('converts');
  if (hasConverts) {
    await knex.schema.dropTable('converts');
  }
};
