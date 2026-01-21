// migrations/20260121_update_roles_departments_unique.js

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function(knex) {
  // DROP old global unique constraint on roles
  await knex.schema.raw(`
    ALTER TABLE roles
    DROP CONSTRAINT IF EXISTS roles_name_unique;
  `);

  // ADD new per-organization unique constraint on roles
  await knex.schema.raw(`
    ALTER TABLE roles
    ADD CONSTRAINT roles_name_organization_unique UNIQUE (name, organization_id);
  `);

  // DROP old global unique constraint on departments
  await knex.schema.raw(`
    ALTER TABLE departments
    DROP CONSTRAINT IF EXISTS departments_name_unique;
  `);

  // ADD new per-organization unique constraint on departments
  await knex.schema.raw(`
    ALTER TABLE departments
    ADD CONSTRAINT departments_name_organization_unique UNIQUE (name, organization_id);
  `);
}

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function(knex) {
  // Revert roles constraint
  await knex.schema.raw(`
    ALTER TABLE roles
    DROP CONSTRAINT IF EXISTS roles_name_organization_unique;
  `);
  await knex.schema.raw(`
    ALTER TABLE roles
    ADD CONSTRAINT roles_name_unique UNIQUE (name);
  `);

  // Revert departments constraint
  await knex.schema.raw(`
    ALTER TABLE departments
    DROP CONSTRAINT IF EXISTS departments_name_organization_unique;
  `);
  await knex.schema.raw(`
    ALTER TABLE departments
    ADD CONSTRAINT departments_name_unique UNIQUE (name);
  `);
}
