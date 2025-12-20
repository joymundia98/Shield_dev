/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('audit_logs');

  if (exists) {
    await knex.schema.dropTable('audit_logs');
  }

  await knex.schema.createTable('audit_trail', (table) => {
    table.increments('audit_id').primary();

    // Who performed the action
    table.integer('user_id').nullable(); // system actions can be null
    table.integer('organization_id').nullable()
      .references('id')
      .inTable('organizations')
      .onDelete('SET NULL');

    // What happened
    table.string('action', 50).notNullable(); 
    // e.g. CREATE, UPDATE, DELETE, LOGIN, EXPORT

    table.string('module', 100).notNullable(); 
    // e.g. payroll, members, programs

    table.integer('record_id').nullable(); 
    // ID of affected record

    // Change tracking
    table.jsonb('old_values').nullable();
    table.jsonb('new_values').nullable();

    // Request metadata
    table.string('ip_address', 50).nullable();
    table.text('user_agent').nullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('audit_logs');
};
