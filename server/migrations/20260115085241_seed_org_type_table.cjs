/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  await knex("organization_type").insert([
    {
      name: "Headquarters / Central Authority",
      description:
        "Sets doctrine, governance, and global strategy. Examples: Headquarters (HQ), Holy See (Catholic), General Conference, Synod, National Office",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      name: "Regional / Territorial Level",
      description:
        "Oversees multiple local churches within a geographic area. Examples: Archdiocese / Diocese (Catholic, Anglican), Conference (Methodist), Presbytery (Presbyterian), District / Region",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      name: "Local Church Level",
      description:
        "Individual worshiping community. Examples: Parish, Congregation, Local Church, Assembly",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      name: "Sub-Local Units (Optional)",
      description:
        "Smaller groups within a local church. Examples: Branch Church, Chapel, Cell Group / House Church, Ministry Unit",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function(knex) {
  await knex("organization_type")
    .whereIn("name", [
      "Headquarters / Central Authority",
      "Regional / Territorial Level",
      "Local Church Level",
      "Sub-Local Units (Optional)",
    ])
    .del();
}
