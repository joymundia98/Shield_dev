/**
 * @param { import("knex").Knex } knex
 */

exports.up = async function (knex) {
  return knex.schema.alterTable("staff", (table) => {
    table.string("name");
    table.string("role");
    table
      .enum("status", ["active", "on-leave", "unpaid"])
      .defaultTo("active");
    table.string("gender");
    table.string("NRC");
    table.string("address");
    table.string("phone");
    table.string("email");
    table.string("photo");
    table.boolean("paid").defaultTo(false);

    // optional: if joinDate should equal start_date, remove this one
    table.date("joinDate");
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable("staff", (table) => {
    table.dropColumn("name");
    table.dropColumn("role");
    table.dropColumn("status");
    table.dropColumn("gender");
    table.dropColumn("NRC");
    table.dropColumn("address");
    table.dropColumn("phone");
    table.dropColumn("email");
    table.dropColumn("photo");
    table.dropColumn("paid");
    table.dropColumn("joinDate");
  });
};
