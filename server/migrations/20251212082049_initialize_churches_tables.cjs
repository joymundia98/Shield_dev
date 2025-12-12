/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  // Churches table
  const hasChurches = await knex.schema.hasTable('churches');
  if (!hasChurches) {
    await knex.schema.createTable('churches', (table) => {
      table.increments('church_id').primary();
      table.string('name', 255).notNullable();
      table.integer('establishment_year');
      table
        .integer('denomination_id')
        .unsigned()
        .references('id')
        .inTable('denominations')
        .onDelete('CASCADE');
      table.string('email', 255);
      table.string('phone', 50);
      table.text('address');
      table.string('profile_pic', 255);
      table.text('vision');
      table.text('mission');
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE');
    });
  }

  // Social links table
  const hasSocialLinks = await knex.schema.hasTable('social_links');
  if (!hasSocialLinks) {
    await knex.schema.createTable('social_links', (table) => {
      table.increments('link_id').primary();
      table
        .integer('church_id')
        .unsigned()
        .notNullable()
        .references('church_id')
        .inTable('churches')
        .onDelete('CASCADE');
      table.string('platform', 50);
      table.string('url', 255).notNullable();
    });
  }

  // Leadership table
  const hasLeadership = await knex.schema.hasTable('leadership');
  if (!hasLeadership) {
    await knex.schema.createTable('leadership', (table) => {
      table.increments('leadership_id').primary();
      table
        .integer('church_id')
        .unsigned()
        .notNullable()
        .references('church_id')
        .inTable('churches')
        .onDelete('CASCADE');
      table.string('role', 255);
      table.string('name', 255);
      table.integer('year_start');
      table.integer('year_end'); // NULL if still serving
    });
  }

  // Ministries table
  const hasMinistries = await knex.schema.hasTable('ministries');
  if (!hasMinistries) {
    await knex.schema.createTable('ministries', (table) => {
      table.increments('ministry_id').primary();
      table
        .integer('church_id')
        .unsigned()
        .notNullable()
        .references('church_id')
        .inTable('churches')
        .onDelete('CASCADE');
      table.string('name', 255);
      table.text('description');
    });
  }

  // Core values table
  const hasCoreValues = await knex.schema.hasTable('core_values');
  if (!hasCoreValues) {
    await knex.schema.createTable('core_values', (table) => {
      table.increments('core_value_id').primary();
      table
        .integer('church_id')
        .unsigned()
        .notNullable()
        .references('church_id')
        .inTable('churches')
        .onDelete('CASCADE');
      table.string('value', 255);
    });
  }

  // Worship times table
  const hasWorshipTimes = await knex.schema.hasTable('worship_times');
  if (!hasWorshipTimes) {
    await knex.schema.createTable('worship_times', (table) => {
      table.increments('worship_time_id').primary();
      table
        .integer('church_id')
        .unsigned()
        .notNullable()
        .references('church_id')
        .inTable('churches')
        .onDelete('CASCADE');
      table.string('day', 50);
      table.string('time', 255);
    });
  }

  // Sacraments table
  const hasSacraments = await knex.schema.hasTable('sacraments');
  if (!hasSacraments) {
    await knex.schema.createTable('sacraments', (table) => {
      table.increments('sacrament_id').primary();
      table
        .integer('church_id')
        .unsigned()
        .notNullable()
        .references('church_id')
        .inTable('churches')
        .onDelete('CASCADE');
      table.string('sacrament_name', 255);
    });
  }

  // Special services table
  const hasSpecialServices = await knex.schema.hasTable('special_services');
  if (!hasSpecialServices) {
    await knex.schema.createTable('special_services', (table) => {
      table.increments('special_service_id').primary();
      table
        .integer('church_id')
        .unsigned()
        .notNullable()
        .references('church_id')
        .inTable('churches')
        .onDelete('CASCADE');
      table.string('service_name', 255);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('special_services');
  await knex.schema.dropTableIfExists('sacraments');
  await knex.schema.dropTableIfExists('worship_times');
  await knex.schema.dropTableIfExists('core_values');
  await knex.schema.dropTableIfExists('ministries');
  await knex.schema.dropTableIfExists('leadership');
  await knex.schema.dropTableIfExists('social_links');
  await knex.schema.dropTableIfExists('churches');
};
