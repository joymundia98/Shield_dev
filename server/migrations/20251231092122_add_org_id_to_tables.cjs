// migrations/20251231092122_add_org_id_to_tables.cjs

exports.up = async function (knex) {
  const tables = [
    "members",
    "staff",
    "visitors",
    "assets",
    "asset_categories",
    "asset_assignments",
    "asset_locations",
    "asset_requests",
    "asset_depreciation",
    "asset_warranty",
    "attendance",
    "attendance_records",
    "attendance_sessions",
    "attendees",
    "budgets",
    "expenses",
    "expense_categories",
    "expense_subcategories",
    "income_categories",
    "income_subcategories",
    "incomes",
    "transactions",
    "donations",
    "program_categories",
    "program_reports",
    "events",
    "event_categories",
    "campaigns",
    "departments",
    "ministries",
    "ministry_teams",
    "leadership",
    "organization_leaders",
    "compliance_requirements",
    "governance_meetings",
    "governance_policies",
    "classes",
    "class_categories",
    "class_teachers",
    "students",
    "teachers",
    "enrollments",
    "payroll",
    "leave_requests",
    "staff_appraisals",
    "counselling_sessions",
    "counselling_types",
    "counsellors",
    "documents",
    "document_tags",
    "attachments",
    "alerts",
    "dashboards",
    "prayer_requests",
    "services",
    "sessions",
    "session_feedback",
    "activity_logs"
  ];

  for (const table of tables) {
    const exists = await knex.schema.hasTable(table);
    if (!exists) continue;

    const hasColumn = await knex.schema.hasColumn(table, "organization_id");
    if (hasColumn) continue;

    await knex.schema.alterTable(table, (t) => {
      t
        .integer("organization_id")
        .unsigned()
        .references("id")
        .inTable("organizations")
        .onDelete("CASCADE")
        .index();
    });
  }
};

exports.down = async function (knex) {
  const tables = [
    "members",
    "staff",
    "visitors",
    "assets",
    "asset_categories",
    "asset_assignments",
    "asset_locations",
    "asset_requests",
    "asset_depreciation",
    "asset_warranty",
    "attendance",
    "attendance_records",
    "attendance_sessions",
    "attendees",
    "budgets",
    "expenses",
    "expense_categories",
    "expense_subcategories",
    "income_categories",
    "income_subcategories",
    "incomes",
    "transactions",
    "donations",
    "program_categories",
    "program_reports",
    "events",
    "event_categories",
    "campaigns",
    "departments",
    "ministries",
    "ministry_teams",
    "leadership",
    "organization_leaders",
    "compliance_requirements",
    "governance_meetings",
    "governance_policies",
    "classes",
    "class_categories",
    "class_teachers",
    "students",
    "teachers",
    "enrollments",
    "payroll",
    "leave_requests",
    "staff_appraisals",
    "counselling_sessions",
    "counselling_types",
    "counsellors",
    "documents",
    "document_tags",
    "attachments",
    "alerts",
    "dashboards",
    "prayer_requests",
    "services",
    "sessions",
    "session_feedback",
    "activity_logs"
  ];

  for (const table of tables) {
    const exists = await knex.schema.hasTable(table);
    if (!exists) continue;

    const hasColumn = await knex.schema.hasColumn(table, "organization_id");
    if (!hasColumn) continue;

    await knex.schema.alterTable(table, (t) => {
      t.dropColumn("organization_id");
    });
  }
};
