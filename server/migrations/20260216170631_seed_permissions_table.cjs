/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex("permissions").insert([
    {
      name: "View Branch Directory",
      path: "/HQ/branchDirectory",
      method: "GET",
      description:
        "Access and view the branch directory under HQ, including branch details and contact information.",
    },
    {
      name: "View HQ Reports",
      path: "/HQ/GeneralReport",
      method: "GET",
      description:
        "Access and view general reports available under the HQ section.",
    },
    {
      name: "Manage Organization Profile",
      path: "/Organization/edittableProfile",
      method: "GET",
      description:
        "Access and manage the organization profile details including updates and configuration.",
    },
    {
      name: "Access Organization Lobby",
      path: "/Organization/orgLobby",
      method: "GET",
      description:
        "Access the organization lobby area providing overview and navigation options.",
    },
    {
      name: "Manage Organization Accounts",
      path: "/Organization/ListedAccounts",
      method: "GET",
      description:
        "View and manage organization user accounts including creation, updates, and status control.",
    },
    {
      name: "Manage Roles",
      path: "/Organization/roles",
      method: "GET",
      description:
        "View and manage role definitions and role configurations within the organization.",
    },
    {
      name: "Manage Permissions",
      path: "/Organization/permissions",
      method: "GET",
      description:
        "View and manage permission assignments and permission configurations within the organization.",
    },
    {
      name: "Manage Organization Admins",
      path: "/Organization/orgAdminAccounts",
      method: "GET",
      description:
        "View and manage organization administrator accounts and their access rights.",
    },
  ]);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex("permissions")
    .whereIn("path", [
      "/HQ/branchDirectory",
      "/HQ/GeneralReport",
      "/Organization/edittableProfile",
      "/Organization/orgLobby",
      "/Organization/ListedAccounts",
      "/Organization/roles",
      "/Organization/permissions",
      "/Organization/orgAdminAccounts",
    ])
    .del();
}
