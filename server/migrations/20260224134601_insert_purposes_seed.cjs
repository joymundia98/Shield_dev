// migrations/20260224_insert_purposes_autogen.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex('purposes').insert([
    { name: 'Tithes' },
    { name: 'Offering' },
    { name: 'Special Fund' },
    { name: 'Disaster Relief' },
    { name: 'Other' },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex('purposes')
    .whereIn('name', ['Tithes', 'Offering', 'Special Fund', 'Disaster Relief', 'Other'])
    .del();
};