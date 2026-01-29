/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {

  // =========================
  // ADD UNIQUE CONSTRAINTS
  // =========================
  await knex.schema.alterTable("program_categories", table => {
    table.unique(["name"]);
  });

  await knex.schema.alterTable("asset_categories", table => {
    table.unique(["name"]);
  });

  // =========================
  // SEED DATA
  // =========================

  // Donor Types
  await knex("donor_types")
    .insert([{ name: "Individual" }, { name: "Corporate" }])
    .onConflict("name")
    .ignore();

  // Program Categories
  await knex("program_categories")
    .insert([
      { name: "Life Events" },
      { name: "Church Business Events" },
      { name: "Community Events" },
      { name: "Spiritual Events" },
      { name: "Other" },
    ])
    .onConflict("name")
    .ignore();

  // Expense Categories
  await knex("expense_categories")
    .insert([
      { name: "Operational Expenses" },
      { name: "Employee Expenses" },
      { name: "Project / Department Expenses" },
      { name: "Financial & Regulatory Expenses" },
      { name: "Capital Expenses" },
    ])
    .onConflict("name")
    .ignore();

  // Expense Subcategories
  await knex("expense_subcategories")
    .insert([
      { name: "Rent", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Operational Expenses')") },
      { name: "Utilities", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Operational Expenses')") },
      { name: "Office Supplies", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Operational Expenses')") },
      { name: "Equipment & Software", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Operational Expenses')") },

      { name: "Salaries & Wages", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Employee Expenses')") },
      { name: "Reimbursements", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Employee Expenses')") },

      { name: "Project Costs", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Project / Department Expenses')") },
      { name: "Materials / Consultants / Outsourcing", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Project / Department Expenses')") },

      { name: "Taxes, Fees, Insurance", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Financial & Regulatory Expenses')") },
      { name: "Compliance Costs", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Financial & Regulatory Expenses')") },

      { name: "Investments / Assets", category_id: knex.raw("(SELECT id FROM expense_categories WHERE name = 'Capital Expenses')") },
    ])
    .onConflict(["name", "category_id"])
    .ignore();

  // Donor Subcategories
  await knex("donor_subcategories")
    .insert([
      { name: "Regular", donor_type_id: knex.raw("(SELECT id FROM donor_types WHERE name = 'Individual')") },
      { name: "Occasional", donor_type_id: knex.raw("(SELECT id FROM donor_types WHERE name = 'Individual')") },
      { name: "One-time", donor_type_id: knex.raw("(SELECT id FROM donor_types WHERE name = 'Individual')") },

      { name: "Silver", donor_type_id: knex.raw("(SELECT id FROM donor_types WHERE name = 'Corporate')") },
      { name: "Gold", donor_type_id: knex.raw("(SELECT id FROM donor_types WHERE name = 'Corporate')") },
      { name: "Platinum", donor_type_id: knex.raw("(SELECT id FROM donor_types WHERE name = 'Corporate')") },
    ])
    .onConflict(["name", "donor_type_id"])
    .ignore();

  // Maintenance Categories
  await knex("maintenance_categories")
    .insert([
      { name: "Cleaning & Calibration", description: "Regular maintenance of electronics" },
      { name: "Repair", description: "Repair works" },
      { name: "Inspection", description: "Inspection records" },
    ])
    .onConflict("name")
    .ignore();

  // Income Categories
  await knex("income_categories")
    .insert([
      { name: "Donations" },
      { name: "Tithes" },
      { name: "Fundraising" },
      { name: "Grants" },
    ])
    .onConflict("name")
    .ignore();

  // Income Subcategories
  await knex("income_subcategories")
    .insert([
      { name: "Online Donations", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Donations')") },
      { name: "Cash Donations", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Donations')") },

      { name: "Monthly Tithes", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Tithes')") },
      { name: "Special Tithes", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Tithes')") },

      { name: "Events", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Fundraising')") },
      { name: "Merchandise Sales", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Fundraising')") },

      { name: "Government Grants", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Grants')") },
      { name: "Private Grants", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Grants')") },
      { name: "Semi-Private Grants", category_id: knex.raw("(SELECT id FROM income_categories WHERE name = 'Grants')") },
    ])
    .onConflict(["name", "category_id"])
    .ignore();

  // Asset Categories
  await knex("asset_categories")
    .insert([
      { name: "Electronics", description: "Projectors, laptops, sound systems" },
      { name: "Furniture", description: "Chairs, tables, pulpits" },
      { name: "Vehicles", description: "Church vans, buses, motorcycles" },
      { name: "Religious Items", description: "Altars, robes, communion sets" },
    ])
    .onConflict("name")
    .ignore();
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex("asset_categories").del();
  await knex("income_subcategories").del();
  await knex("income_categories").del();
  await knex("maintenance_categories").del();
  await knex("donor_subcategories").del();
  await knex("expense_subcategories").del();
  await knex("expense_categories").del();
  await knex("program_categories").del();
  await knex("donor_types").del();

  await knex.schema.alterTable("program_categories", table => {
    table.dropUnique(["name"]);
  });

  await knex.schema.alterTable("donor_types", table => {
    table.dropUnique(["name"]);
  });

  await knex.schema.alterTable("expense_categories", table => {
    table.dropUnique(["name"]);
  });

  await knex.schema.alterTable("maintenance_categories", table => {
    table.dropUnique(["name"]);
  });

  await knex.schema.alterTable("income_categories", table => {
    table.dropUnique(["name"]);
  });

  await knex.schema.alterTable("asset_categories", table => {
    table.dropUnique(["name"]);
  });
};
