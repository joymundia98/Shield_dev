exports.up = async function (knex) {
  // ---------------------------------------------------
  // 1. DEPARTMENTS TABLE UPDATE
  // ---------------------------------------------------
  const deptHasCategory = await knex.schema.hasColumn("departments", "category");
  const deptHasCreated = await knex.schema.hasColumn("departments", "created_at");

  await knex.schema.alterTable("departments", (table) => {
    if (!deptHasCategory) {
      table.string("category").notNullable().defaultTo("church");
    }
    if (!deptHasCreated) {
      table.timestamp("created_at").defaultTo(knex.fn.now());
    }
  });

  // ---------------------------------------------------
  // 2. STAFF TABLE UPDATE
  // ---------------------------------------------------
  const staffHasDept = await knex.schema.hasColumn("staff", "department_id");
  const staffHasUser = await knex.schema.hasColumn("staff", "user_id");
  const staffHasJoin = await knex.schema.hasColumn("staff", "join_date");
  const staffHasPaid = await knex.schema.hasColumn("staff", "paid");
  const staffHasCreated = await knex.schema.hasColumn("staff", "created_at");
  const staffHasName = await knex.schema.hasColumn("staff", "name");

  await knex.schema.alterTable("staff", (table) => {
    if (!staffHasDept) {
      table
        .integer("department_id")
        .unsigned()
        .references("department_id")     // ✔ FIXED
        .inTable("departments")
        .onDelete("SET NULL");
    }

    if (!staffHasUser) {
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    }

    if (!staffHasName) table.string("name").notNullable();
    if (!staffHasJoin) table.date("join_date");
    if (!staffHasPaid) table.boolean("paid").defaultTo(false);
    if (!staffHasCreated) table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // ---------------------------------------------------
  // 3. LEAVE REQUESTS TABLE UPDATE
  // ---------------------------------------------------
  const hasDays = await knex.schema.hasColumn("leave_requests", "days");
  const hasStatus = await knex.schema.hasColumn("leave_requests", "status");
  const hasApproval = await knex.schema.hasColumn("leave_requests", "approval_status");

  await knex.schema.alterTable("leave_requests", (table) => {
    table.string("leave_type").notNullable().alter();

    if (!hasDays) table.integer("days");

    if (!hasStatus) {
      table
        .enu("status", ["pending", "approved", "rejected"])
        .defaultTo("pending");
    }

    if (hasApproval) table.dropColumn("approval_status");
  });
};

exports.down = async function (knex) {
  // optional rollback
};
