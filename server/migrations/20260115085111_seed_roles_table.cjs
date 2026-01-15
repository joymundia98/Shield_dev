/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  await knex("roles").insert([
    {
      name: "Trustees",
      description: "Full system control",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Bishop / Presiding Reverend",
      description: "Spiritual head with authority over doctrine and governance",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Senior Pastor",
      description: "Leads church operations and spiritual direction",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Elders",
      description: "Provides spiritual oversight and leadership support",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Associate Pastors",
      description: "Assists senior pastor in ministry and administration",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Deacons",
      description: "Supports church service and community care",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Church Administrator",
      description: "Manages church administration and records",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Finance Officer / Treasurer",
      description: "Manages church finances and accountability",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Admin Assistant",
      description: "Supports administrative operations",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Assistants / Ministry Helpers",
      description: "Supports ministry activities and logistics",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Organization Registrar",
      description: "Registrar for an organization",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Organization Admin",
      description: "Admin for an organization",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
    {
      name: "Regular Member",
      description: "Standard member role",
      organization_id: null,
      department_id: null,
      created_at: knex.fn.now(),
    },
  ]);
}

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function(knex) {
  await knex("roles")
    .whereIn("name", [
      "Trustees",
      "Bishop / Presiding Reverend",
      "Senior Pastor",
      "Elders",
      "Associate Pastors",
      "Deacons",
      "Church Administrator",
      "Finance Officer / Treasurer",
      "Admin Assistant",
      "Assistants / Ministry Helpers",
      "Organization Registrar",
      "Organization Admin",
      "Regular Member",
    ])
    .del();
}
