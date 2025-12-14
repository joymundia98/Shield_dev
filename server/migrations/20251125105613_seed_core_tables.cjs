/**
 * @param { import("knex").Knex } knex
 */

exports.up = async function (knex) {
  await knex("roles").insert([
    { name: "Admin", description: "Full system control" },
    { name: "Organization_admin", description: "Admin for an organization" },
    { name: "Registra", description: "Registra for an organization" },
    { name: "Member", description: "Regular member" }
  ]);

  const permissions = [
    {
      name: "organization.create",
      path: "/api/organizations/register",
      method: "POST",
      description: "Create a new organization",
    },
    {
      name: "organization.view",
      path: "/api/organizations",
      method: "GET",
      description: "View organizations",
    },
    {
      name: "user.create",
      path: "/api/users/register",
      method: "POST",
      description: "Create a new user",
    },
    {
      name: "user.view",
      path: "/api/users",
      method: "GET",
      description: "View users",
    }
  ];

  await knex("permissions").insert(permissions);

  const systemAdmin = await knex("roles").where({ name: "Admin" }).first();
  const allPermissions = await knex("permissions");

  await knex("role_permissions").insert(
    allPermissions.map(p => ({
      role_id: systemAdmin.id,
      permission_id: p.id
    }))
  );

  await knex("organizations").insert({
    id: 1,
    name: "Central Assembly Headquarters",
    denomination: "Pentecostal",
    address: "Plot 123, Cairo Road",
    region: "Lusaka Province",
    district: "Lusaka District",
    status: "active",
  });
}

exports.down = async function (knex) {
  await knex("role_permissions").del();
  await knex("permissions").del();
  await knex("roles").del();
  await knex("organizations")
    .where({ name: "Central Assembly Headquarters" })
    .del();
}
