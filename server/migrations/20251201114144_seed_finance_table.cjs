// migrations/20251201120000_seed_finance_table_dynamic.cjs

exports.up = async function (knex) {
  // -----------------------------
  // Expense Categories
  // -----------------------------
  await knex("expense_categories").del();
  const expenseCategoriesData = [
    { name: "Utilities" },
    { name: "Office Supplies" },
    { name: "Maintenance" },
    { name: "Events" },
    { name: "Salaries" },
  ];
  await knex("expense_categories").insert(expenseCategoriesData);

  // Fetch inserted IDs
  const expenseCategories = await knex("expense_categories").select("*");

  // -----------------------------
  // Expense Subcategories
  // -----------------------------
  await knex("expense_subcategories").del();
  const expenseSubcategoriesData = [
    { category: "Utilities", name: "Electricity" },
    { category: "Utilities", name: "Water" },
    { category: "Office Supplies", name: "Stationery" },
    { category: "Office Supplies", name: "Software Licenses" },
    { category: "Maintenance", name: "Building Repairs" },
    { category: "Maintenance", name: "Equipment Repairs" },
    { category: "Events", name: "Workshops" },
    { category: "Events", name: "Conferences" },
    { category: "Salaries", name: "Staff Salaries" },
    { category: "Salaries", name: "Contractor Payments" },
  ];

  const expenseSubcategories = expenseSubcategoriesData.map((sub) => {
    const cat = expenseCategories.find((c) => c.name === sub.category);
    return {
      category_id: cat.id,
      name: sub.name,
    };
  });

  await knex("expense_subcategories").insert(expenseSubcategories);

  // -----------------------------
  // Income Categories
  // -----------------------------
  await knex("income_categories").del();
  const incomeCategoriesData = [
    { name: "Donations" },
    { name: "Tithes" },
    { name: "Fundraising" },
    { name: "Grants" },
  ];
  await knex("income_categories").insert(incomeCategoriesData);

  const incomeCategories = await knex("income_categories").select("*");

  // -----------------------------
  // Income Subcategories
  // -----------------------------
  await knex("income_subcategories").del();
  const incomeSubcategoriesData = [
    { category: "Donations", name: "Online Donations" },
    { category: "Donations", name: "Cash Donations" },
    { category: "Tithes", name: "Monthly Tithes" },
    { category: "Tithes", name: "Special Tithes" },
    { category: "Fundraising", name: "Events" },
    { category: "Fundraising", name: "Merchandise Sales" },
    { category: "Grants", name: "Government Grants" },
    { category: "Grants", name: "Private Grants" },
  ];

  const incomeSubcategories = incomeSubcategoriesData.map((sub) => {
    const cat = incomeCategories.find((c) => c.name === sub.category);
    return {
      category_id: cat.id,
      name: sub.name,
    };
  });

  await knex("income_subcategories").insert(incomeSubcategories);
};

exports.down = async function (knex) {
  await knex("income_subcategories").del();
  await knex("income_categories").del();
  await knex("expense_subcategories").del();
  await knex("expense_categories").del();
};
