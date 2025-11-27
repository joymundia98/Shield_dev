exports.up = async function (knex) {
  await knex.schema.alterTable("programs", (table) => {
    table.integer("department_id").unsigned();

    table
      .foreign("department_id")
      .references("department_id")
      .inTable("departments")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("programs", (table) => {
    table.dropForeign("department_id");
    table.dropColumn("department_id");
  });
};
