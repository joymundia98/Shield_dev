// migrations/xxxxxx_create_finance_tables.cjs

exports.up = async function (knex) {

  // ===========================================
  // Expense Categories
  // ===========================================
  if (!(await knex.schema.hasTable("expense_categories"))) {
    await knex.schema.createTable("expense_categories", (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable().unique();
    });
  }

  if (!(await knex.schema.hasTable("expense_subcategories"))) {
    await knex.schema.createTable("expense_subcategories", (table) => {
      table.increments("id").primary();
      table
        .integer("category_id")
        .references("id")
        .inTable("expense_categories")
        .onDelete("CASCADE");
      table.string("name", 100).notNullable();
      table.unique(["category_id", "name"]);
    });
  }

  // ===========================================
  // Income Categories
  // ===========================================
  if (!(await knex.schema.hasTable("income_categories"))) {
    await knex.schema.createTable("income_categories", (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable().unique();
    });
  }

  if (!(await knex.schema.hasTable("income_subcategories"))) {
    await knex.schema.createTable("income_subcategories", (table) => {
      table.increments("id").primary();
      table
        .integer("category_id")
        .references("id")
        .inTable("income_categories")
        .onDelete("CASCADE");
      table.string("name", 100).notNullable();
      table.unique(["category_id", "name"]);
    });
  }

  // ===========================================
  // Expenses Table
  // ===========================================
  if (!(await knex.schema.hasTable("expenses"))) {
    await knex.schema.createTable("expenses", (table) => {
      table.increments("id").primary();

      table
        .integer("subcategory_id")
        .references("id")
        .inTable("expense_subcategories")
        .onDelete("SET NULL");

      table
        .integer("user_id")
        .references("id")
        .inTable("users");

      table.date("date").notNullable();

      // departments table uses "id" not "department_id"
      table
        .integer("department_id")
        .references("department_id")
        .inTable("departments")
        .onDelete("SET NULL");

      table.text("description");
      table.decimal("amount", 12, 2).notNullable();
      table.string("status", 20).defaultTo("Pending");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // ===========================================
  // Incomes Table
  // ===========================================
  if (!(await knex.schema.hasTable("incomes"))) {
    await knex.schema.createTable("incomes", (table) => {
      table.increments("id").primary();

      table
        .integer("subcategory_id")
        .references("id")
        .inTable("income_subcategories")
        .onDelete("SET NULL");

      table
        .integer("user_id")
        .references("id")
        .inTable("users");

      table
        .integer("donor_id")
        .references("id")
        .inTable("donors")
        .onDelete("SET NULL");

      table.date("date").notNullable();
      table.string("giver", 100);
      table.text("description");
      table.decimal("amount", 12, 2).notNullable();
      table.string("status", 20).defaultTo("Pending");

      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // ===========================================
  // Attachments Table
  // ===========================================
  if (!(await knex.schema.hasTable("attachments"))) {
    await knex.schema.createTable("attachments", (table) => {
      table.increments("attachment_id").primary();

      table
        .integer("expense_id")
        .references("id")
        .inTable("expenses")
        .onDelete("CASCADE");

      table
        .integer("income_id")
        .references("id")
        .inTable("incomes")
        .onDelete("CASCADE");

      table.text("url").notNullable();
      table.string("file_type", 50);
      table.timestamp("uploaded_at").defaultTo(knex.fn.now());
    });
  }

  // ===========================================
  // Extra Fields Table
  // ===========================================
  if (!(await knex.schema.hasTable("extra_fields"))) {
    await knex.schema.createTable("extra_fields", (table) => {
      table.increments("field_id").primary();

      table
        .integer("expense_id")
        .references("id")
        .inTable("expenses")
        .onDelete("CASCADE");

      table
        .integer("income_id")
        .references("id")
        .inTable("incomes")
        .onDelete("CASCADE");

      table.string("key", 100).notNullable();
      table.text("value");
    });
  }

  // ===========================================
  // Existing Budgets Table — ALTER IT
  // ===========================================
  const hasExpenseSub = await knex.schema.hasColumn("budgets", "expense_subcategory_id");
  const hasIncomeSub = await knex.schema.hasColumn("budgets", "income_subcategory_id");

  if (!hasExpenseSub) {
    await knex.schema.alterTable("budgets", (table) => {
      table
        .integer("expense_subcategory_id")
        .references("id")
        .inTable("expense_subcategories")
        .onDelete("CASCADE");
    });
  }

  if (!hasIncomeSub) {
    await knex.schema.alterTable("budgets", (table) => {
      table
        .integer("income_subcategory_id")
        .references("id")
        .inTable("income_subcategories")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.alterTable("budgets", (table) => {
    table.dropColumn("expense_subcategory_id");
    table.dropColumn("income_subcategory_id");
  });

  await knex.schema.dropTableIfExists("extra_fields");
  await knex.schema.dropTableIfExists("attachments");
  await knex.schema.dropTableIfExists("incomes");
  await knex.schema.dropTableIfExists("expenses");
  await knex.schema.dropTableIfExists("income_subcategories");
  await knex.schema.dropTableIfExists("income_categories");
  await knex.schema.dropTableIfExists("expense_subcategories");
  await knex.schema.dropTableIfExists("expense_categories");
};
