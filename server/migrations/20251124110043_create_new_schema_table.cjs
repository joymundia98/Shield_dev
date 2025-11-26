/**
 * Full schema migration (Option B — full asset management + all extra modules)
 * NO ENUMS anywhere (all enum columns replaced with string())
 *
 * Run with: npx knex migrate:latest
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
//   // Enable required extensions
//   await knex.raw(`CREATE EXTENSION IF NOT EXISTS postgis`);

  // ----------------
  // CORE: RBAC + ORG + USERS
  // ----------------
  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

    await knex.schema.createTable('permissions', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.string('path').notNullable().unique();
    table.string('method').notNullable();
    table.text('description');
    });


  await knex.schema.createTable('organizations', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('denomination');
    table.text('address');
    table.string('region');
    table.string('district');
    table.string('status').defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("denominations", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.text("description");
    table.string("status").defaultTo("active");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('phone');
    table.string('position');
    table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL');
    table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('status').defaultTo('active');
    table.timestamp('last_login');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Many-to-many user <-> role (optional, we keep both role_id on users for single-role quick access,
  // plus user_roles for multi-role support)
  await knex.schema.createTable('user_roles', (table) => {
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
    table.primary(['user_id', 'role_id']);
  });

  await knex.schema.createTable('role_permissions', (table) => {
    table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
    table.integer('permission_id').unsigned().notNullable().references('id').inTable('permissions').onDelete('CASCADE');
    table.primary(['role_id', 'permission_id']);
  });

  // ----------------
  // MEMBERSHIP & REGISTRATION
  // ----------------
  await knex.schema.createTable('organization_leaders', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('title');
    table.string('phone');
    table.string('email');
    table.date('start_date');
    table.date('end_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('membership_certificates', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.integer('issued_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.text('certificate_file');
    table.date('issued_date').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // PROGRAMS & REPORTING
  // ----------------
  await knex.schema.createTable('programs', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('department');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('program_reports', (table) => {
    table.increments('id').primary();
    table.integer('program_id').unsigned().references('id').inTable('programs').onDelete('CASCADE');
    table.string('reporting_period');
    table.integer('submitted_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.text('narrative_report');
    table.jsonb('indicators_data').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('dashboards', (table) => {
    table.increments('id').primary();
    table.string('module');
    table.jsonb('data').defaultTo('{}');
    table.timestamp('last_updated').defaultTo(knex.fn.now());
  });

  // ----------------
  // FINANCIAL MODULE & DONORS
  // ----------------
  await knex.schema.createTable('donors', (table) => {
    table.increments('id').primary();
    table.string('donor_type');
    table.string('name');
    table.jsonb('contact_info').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('grants', (table) => {
    table.increments('id').primary();
    table.integer('donor_id').unsigned().references('id').inTable('donors').onDelete('SET NULL');
    table.integer('program_id').unsigned().references('id').inTable('programs').onDelete('SET NULL');
    table.decimal('grant_amount', 14, 2);
    table.date('start_date');
    table.date('end_date');
    table.jsonb('restrictions').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('grant_disbursements', (table) => {
    table.increments('id').primary();
    table.integer('grant_id').unsigned().references('id').inTable('grants').onDelete('CASCADE');
    table.decimal('amount', 14, 2);
    table.date('disbursement_date');
    table.string('reference');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('digital_giving', (table) => {
    table.increments('id').primary();
    table.integer('giver_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('CASCADE');
    table.integer('program_id').unsigned().references('id').inTable('programs').onDelete('SET NULL');
    table.decimal('amount', 14, 2);
    table.string('payment_channel');
    table.string('transaction_reference');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // COMPLIANCE & GOVERNANCE
  // ----------------
  await knex.schema.createTable('complaints', (table) => {
    table.increments('id').primary();
    table.integer('submitted_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('SET NULL');
    table.string('category');
    table.text('description');
    table.string('status').defaultTo('open');
    table.text('resolution_notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('compliance_requirements', (table) => {
    table.increments('id').primary();
    table.string('requirement_name');
    table.text('description');
    table.string('frequency');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('compliance_submissions', (table) => {
    table.increments('id').primary();
    table.integer('requirement_id').unsigned().references('id').inTable('compliance_requirements').onDelete('CASCADE');
    table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('CASCADE');
    table.date('due_date');
    table.date('submitted_date');
    table.jsonb('attachments').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // HR MANAGEMENT
  // ----------------
  await knex.schema.createTable('staff', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().unique().references('id').inTable('users').onDelete('CASCADE');
    table.string('department');
    table.string('position');
    table.date('start_date');
    table.string('contract_type');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('leave_requests', (table) => {
    table.increments('id').primary();
    table.integer('staff_id').unsigned().references('id').inTable('staff').onDelete('CASCADE');
    table.string('leave_type');
    table.date('start_date');
    table.date('end_date');
    table.string('approval_status').defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('staff_appraisals', (table) => {
    table.increments('id').primary();
    table.integer('staff_id').unsigned().references('id').inTable('staff').onDelete('CASCADE');
    table.integer('evaluator_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.string('period');
    table.jsonb('performance_scores').defaultTo('{}');
    table.text('comments');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // ASSET MANAGEMENT (Option B)
  // ----------------
  await knex.schema.createTable('departments', (table) => {
    table.increments('department_id').primary();
    table.string('name').notNullable();
    table.text('description');
  });

  await knex.schema.createTable('asset_categories', (table) => {
    table.increments('category_id').primary();
    table.string('name').notNullable();
    table.text('description');
  });

  await knex.schema.createTable('asset_locations', (table) => {
    table.increments('location_id').primary();
    table.string('name').notNullable();
    table.text('description');
  });

  await knex.schema.createTable('assets', (table) => {
    table.increments('asset_id').primary();
    table.string('name').notNullable();
    table.integer('category_id').unsigned().references('category_id').inTable('asset_categories').onDelete('SET NULL');
    table.integer('location_id').unsigned().references('location_id').inTable('asset_locations').onDelete('SET NULL');
    table.integer('department_id').unsigned().references('department_id').inTable('departments').onDelete('SET NULL');
    table.date('acquisition_date');
    table.decimal('purchase_cost', 12, 2);
    table.decimal('current_value', 12, 2);
    table.string('condition_status').defaultTo('Good'); // enum removed
    table.string('status').defaultTo('Active');         // enum removed
    table.string('serial_number');
    table.text('description');
    // geometry point (x,y) - use geometry for local coords (faster), SRID 4326
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('asset_assignments', (table) => {
    table.increments('assignment_id').primary();
    table.integer('asset_id').unsigned().notNullable().references('asset_id').inTable('assets').onDelete('CASCADE');
    table.integer('assigned_to_user').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.integer('assigned_to_department').unsigned().references('department_id').inTable('departments').onDelete('SET NULL');
    table.date('assignment_date').notNullable();
    table.date('return_date');
    table.string('status').defaultTo('Assigned'); // enum removed
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('asset_requests', (table) => {
    table.increments('request_id').primary();
    table.integer('asset_id').unsigned().references('asset_id').inTable('assets').onDelete('SET NULL');
    table.integer('requested_by').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('request_type').notNullable(); // enum removed
    table.date('request_date').defaultTo(knex.fn.now());
    table.string('status').defaultTo('Pending'); // enum removed
    table.text('notes');
  });

  await knex.schema.createTable('asset_depreciation', (table) => {
    table.increments('depreciation_id').primary();
    table.integer('asset_id').unsigned().notNullable().references('asset_id').inTable('assets').onDelete('CASCADE');
    table.integer('fiscal_year').notNullable();
    table.decimal('opening_value', 12, 2);
    table.decimal('depreciation_rate', 5, 2);
    table.decimal('depreciation_amount', 12, 2);
    table.decimal('closing_value', 12, 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('asset_warranty', (table) => {
    table.increments('warranty_id').primary();
    table.integer('asset_id').unsigned().notNullable().references('asset_id').inTable('assets').onDelete('CASCADE');
    table.string('vendor');
    table.date('start_date');
    table.date('end_date');
    table.string('support_contact');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('activity_logs', (table) => {
    table.increments('activity_id').primary();
    table.integer('asset_id').unsigned().references('asset_id').inTable('assets').onDelete('SET NULL');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.string('activity_type');
    table.text('activity_details');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // PROPERTIES (real estate)
  // ----------------
  await knex.schema.createTable('properties', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.text('title_deed_document');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // DOCUMENT MANAGEMENT
  // ----------------
  await knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();
    table.string('category');
    table.string('title');
    table.integer('uploaded_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.text('file_path');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('document_tags', (table) => {
    table.increments('id').primary();
    table.integer('document_id').unsigned().references('id').inTable('documents').onDelete('CASCADE');
    table.string('tag');
  });

  // ----------------
  // COMMUNICATION & PORTALS
  // ----------------

  await knex.schema.createTable('alerts', (table) => {
    table.increments('id').primary();
    table.string('alert_type');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.text('message');
    table.string('status').defaultTo('sent');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // MINISTRY TEAMS + TEAM ACTIVITIES (support table)
  // ----------------
  await knex.schema.createTable('ministry_teams', (table) => {
    table.increments('team_id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('team_activities', (table) => {
    table.increments('activity_id').primary();
    table.integer('team_id').unsigned().references('team_id').inTable('ministry_teams').onDelete('CASCADE');
    table.string('activity_name', 150);
    table.date('activity_date');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // PROGRAM & EVENT MANAGEMENT
  // ----------------
  await knex.schema.createTable('event_categories', (table) => {
    table.increments('category_id').primary();
    table.string('name', 50).notNullable().unique();
    table.text('description');
  });

  await knex.schema.createTable('events', (table) => {
    table.increments('event_id').primary();
    table.integer('category_id').unsigned().notNullable().references('category_id').inTable('event_categories').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.time('start_time').notNullable();
    table.string('venue', 150).notNullable();
    table.text('guest_ministers');
    table.string('theme', 150);
    table.text('instructions');
    table.string('status').defaultTo('Upcoming'); // enum removed -> string
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('participants', (table) => {
    table.increments('participant_id').primary();
    table.integer('event_id').unsigned().notNullable().references('event_id').inTable('events').onDelete('CASCADE');
    table.string('full_name', 100).notNullable();
    table.string('email', 100);
    table.string('phone', 20);
    table.integer('age').unsigned();
    table.string('gender').notNullable();        // enum removed -> string
    table.string('participant_type').notNullable(); // enum removed -> string
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // DOCUMENTS & RECORDS: Members
  // ----------------
  await knex.schema.createTable('members', (table) => {
    table.increments('member_id').primary();
    table.string('full_name', 100).notNullable();
    table.string('email', 100);
    table.string('phone', 20);
    table.string('gender', 10);
    table.date('date_of_birth');
    table.date('date_joined').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // CLASS MANAGEMENT
  // ----------------
  await knex.schema.createTable('classes', (table) => {
    table.increments('class_id').primary();
    table.string('name', 150).notNullable();
    table.string('category', 80);
    table.string('schedule', 120);
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('teachers', (table) => {
    table.increments('teacher_id').primary();
    table.string('full_name', 150).notNullable();
    table.string('email', 150);
    table.string('phone', 30);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('class_teachers', (table) => {
    table.increments('id').primary();
    table.integer('class_id').unsigned().references('class_id').inTable('classes').onDelete('CASCADE');
    table.integer('teacher_id').unsigned().references('teacher_id').inTable('teachers').onDelete('CASCADE');
  });

  await knex.schema.createTable('students', (table) => {
    table.increments('student_id').primary();
    table.string('full_name', 150).notNullable();
    table.integer('age').unsigned();
    table.string('contact', 100);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('enrollments', (table) => {
    table.increments('enrollment_id').primary();
    table.integer('class_id').unsigned().references('class_id').inTable('classes').onDelete('CASCADE');
    table.integer('student_id').unsigned().references('student_id').inTable('students').onDelete('CASCADE');
    table.date('enrolled_on').defaultTo(knex.fn.now());
    table.string('status').defaultTo('Active'); // enum removed
  });

  await knex.schema.createTable('attendance_sessions', (table) => {
    table.increments('session_id').primary();
    table.integer('class_id').unsigned().references('class_id').inTable('classes').onDelete('CASCADE');
    table.date('date').notNullable();
    table.text('notes');
  });

  await knex.schema.createTable('attendance_records', (table) => {
    table.increments('record_id').primary();
    table.integer('session_id').unsigned().references('session_id').inTable('attendance_sessions').onDelete('CASCADE');
    table.integer('student_id').unsigned().references('student_id').inTable('students').onDelete('CASCADE');
    table.string('status').defaultTo('Present'); // enum removed
  });

  // ----------------
  // CONGREGATION MANAGEMENT
  // ----------------
  await knex.schema.createTable('families', (table) => {
    table.increments('family_id').primary();
    table.string('family_name', 100).notNullable();
    table.string('head_of_family', 100).notNullable();
    table.integer('members_count').defaultTo(0);
    table.string('address', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('attendance', (table) => {
    table.increments('attendance_id').primary();
    table.integer('member_id').unsigned().references('member_id').inTable('members').onDelete('CASCADE');
    table.date('attendance_date').notNullable();
    table.string('status').defaultTo('Present'); // enum removed
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('follow_ups', (table) => {
    table.increments('followup_id').primary();
    table.integer('member_id').unsigned().references('member_id').inTable('members').onDelete('CASCADE');
    table.date('followup_date').notNullable();
    table.string('type').notNullable(); // enum removed
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('congregation_settings', (table) => {
    table.increments('setting_id').primary();
    table.string('default_attendance').defaultTo('Present'); // enum removed
    table.string('notifications').defaultTo('Yes');           // enum removed
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // DONOR MANAGEMENT: Campaigns
  // ----------------
  await knex.schema.createTable('campaigns', (table) => {
    table.increments('campaign_id').primary();
    table.string('campaign_name', 100).notNullable();
    table.text('description');
    table.date('start_date');
    table.date('end_date');
    table.decimal('target_amount', 12, 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // FINANCE SUBSYSTEM
  // ----------------
  await knex.schema.createTable('finance_categories', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('type').notNullable(); // enum removed
  });

  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.integer('category_id').unsigned().references('id').inTable('finance_categories').onDelete('SET NULL');
    table.string('type').notNullable(); // enum removed
    table.decimal('amount', 12, 2).notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('payroll', (table) => {
    table.increments('id').primary();
    table.integer('staff_id').unsigned();
    table.foreign('staff_id').references('id').inTable('staff').onDelete('CASCADE');
    table.date('month').notNullable();
    table.decimal('salary', 12, 2).notNullable();
    table.decimal('deductions', 12, 2).defaultTo(0);
    table.boolean('paid').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('budgets', (table) => {
    table.increments('id').primary();
    table.integer('category_id').unsigned().references('id').inTable('finance_categories').onDelete('SET NULL');
    table.integer('year').notNullable();
    table.integer('month').notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // GOVERNANCE + AUDIT
  // ----------------
  await knex.schema.createTable('governance_policies', (table) => {
    table.increments('policy_id').primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.string('category', 100);
    table.string('created_by', 100);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('audit_logs', (table) => {
    table.increments('log_id').primary();
    table.string('action_type', 50);
    table.string('table_name', 50);
    table.integer('record_id');
    table.string('performed_by', 100);
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.text('details');
  });

  await knex.schema.createTable('governance_meetings', (table) => {
    table.increments('meeting_id').primary();
    table.string('meeting_title', 255);
    table.date('meeting_date');
    table.string('venue', 255);
    table.text('agenda');
    table.string('created_by', 100);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // COUNSELLING MODULE
  // ----------------
  await knex.schema.createTable('counsellors', (table) => {
    table.increments('counsellor_id').primary();
    table.string('full_name', 100);
    table.string('specialty', 50);
    table.string('contact_number', 20);
    table.string('email', 100);
  });

  await knex.schema.createTable('counselling_types', (table) => {
    table.increments('type_id').primary();
    table.string('type_name', 50);
  });

  await knex.schema.createTable('counselling_sessions', (table) => {
    table.increments('session_id').primary();
    table.integer('member_id').unsigned().references('member_id').inTable('members').onDelete('SET NULL');
    table.integer('counsellor_id').unsigned().references('counsellor_id').inTable('counsellors').onDelete('SET NULL');
    table.integer('type_id').unsigned().references('type_id').inTable('counselling_types').onDelete('SET NULL');
    table.date('session_date');
    table.time('session_time');
    table.integer('duration_minutes');
    table.text('notes');
    table.boolean('follow_up_required').defaultTo(false);
    table.date('follow_up_date');
    table.string('status', 20);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('follow_up_sessions', (table) => {
    table.increments('follow_up_id').primary();
    table.integer('session_id').unsigned().references('session_id').inTable('counselling_sessions').onDelete('CASCADE');
    table.integer('counsellor_id').unsigned().references('counsellor_id').inTable('counsellors').onDelete('SET NULL');
    table.date('follow_up_date');
    table.text('notes');
    table.string('status', 20);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // PRAYER REQUESTS & SESSION FEEDBACK
  // ----------------
  await knex.schema.createTable('prayer_requests', (table) => {
    table.increments('request_id').primary();
    table.integer('member_id').unsigned().references('member_id').inTable('members').onDelete('SET NULL');
    table.string('request_title', 100);
    table.text('request_details');
    table.date('request_date');
    table.string('priority', 20);
    table.string('status', 20);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('session_feedback', (table) => {
    table.increments('feedback_id').primary();
    table.integer('session_id').unsigned().references('session_id').inTable('counselling_sessions').onDelete('CASCADE');
    table.integer('member_rating').unsigned();
    table.text('comments');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ----------------
  // Final housekeeping indexes (examples)
  // ----------------
  await knex.schema.alterTable('users', (table) => {
    table.index(['email']);
    table.index(['organization_id']);
  });

  await knex.schema.alterTable('events', (table) => {
    table.index(['start_date']);
  });

  // Done
};

/**
 * Drop everything in reverse order
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Drop tables in reverse creation order to respect FKs
  await knex.schema.dropTableIfExists('session_feedback');
  await knex.schema.dropTableIfExists('prayer_requests');

  await knex.schema.dropTableIfExists('follow_up_sessions');
  await knex.schema.dropTableIfExists('counselling_sessions');
  await knex.schema.dropTableIfExists('counselling_types');
  await knex.schema.dropTableIfExists('counsellors');

  await knex.schema.dropTableIfExists('governance_meetings');
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('governance_policies');

  await knex.schema.dropTableIfExists('budgets');
  await knex.schema.dropTableIfExists('payroll');
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('finance_categories');

  await knex.schema.dropTableIfExists('campaigns');

  await knex.schema.dropTableIfExists('congregation_settings');
  await knex.schema.dropTableIfExists('follow_ups');
  await knex.schema.dropTableIfExists('attendance');

  await knex.schema.dropTableIfExists('families');

  await knex.schema.dropTableIfExists('attendance_records');
  await knex.schema.dropTableIfExists('attendance_sessions');
  await knex.schema.dropTableIfExists('enrollments');
  await knex.schema.dropTableIfExists('students');
  await knex.schema.dropTableIfExists('class_teachers');
  await knex.schema.dropTableIfExists('teachers');
  await knex.schema.dropTableIfExists('classes');

  await knex.schema.dropTableIfExists('members');

  await knex.schema.dropTableIfExists('participants');
  await knex.schema.dropTableIfExists('events');
  await knex.schema.dropTableIfExists('event_categories');

  await knex.schema.dropTableIfExists('team_activities');
  await knex.schema.dropTableIfExists('ministry_teams');

  await knex.schema.dropTableIfExists('alerts');

  await knex.schema.dropTableIfExists('document_tags');
  await knex.schema.dropTableIfExists('documents');
  await knex.schema.dropTableIfExists('properties');

  // Asset-related
  await knex.schema.dropTableIfExists('activity_logs');
  await knex.schema.dropTableIfExists('asset_warranty');
  await knex.schema.dropTableIfExists('asset_depreciation');
  await knex.schema.dropTableIfExists('asset_requests');
  await knex.schema.dropTableIfExists('asset_assignments');
  await knex.schema.dropTableIfExists('assets');
  await knex.schema.dropTableIfExists('asset_locations');
  await knex.schema.dropTableIfExists('asset_categories');
  await knex.schema.dropTableIfExists('departments');

  // HR & compliance
  await knex.schema.dropTableIfExists('staff_appraisals');
  await knex.schema.dropTableIfExists('leave_requests');
  await knex.schema.dropTableIfExists('staff');

  await knex.schema.dropTableIfExists('compliance_submissions');
  await knex.schema.dropTableIfExists('compliance_requirements');
  await knex.schema.dropTableIfExists('complaints');

  // Financial & donors
  await knex.schema.dropTableIfExists('digital_giving');
  await knex.schema.dropTableIfExists('grant_disbursements');
  await knex.schema.dropTableIfExists('grants');
  await knex.schema.dropTableIfExists('donors');

  // Programs & dashboards
  await knex.schema.dropTableIfExists('dashboards');
  await knex.schema.dropTableIfExists('program_reports');
  await knex.schema.dropTableIfExists('programs');

  await knex.schema.dropTableIfExists('membership_certificates');
  await knex.schema.dropTableIfExists('organization_leaders');

  // user/role/perms
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('organizations');
  await knex.schema.dropTableIfExists('denominations');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('roles');

  // Note: PostGIS extension left in place (system-level)
};
