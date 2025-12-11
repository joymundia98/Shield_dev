/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // Drop existing payroll table if it exists
  const hasPayroll = await knex.schema.hasTable('payroll');
  if (hasPayroll) {
    await knex.schema.dropTable('payroll');
  }

  // Create new payroll table with updated fields
  await knex.schema.createTable('payroll', (table) => {
    table.increments('payroll_id').primary();

    table.integer('staff_id').notNullable().references('id').inTable('staff');
    table.integer('department_id').notNullable().references('department_id').inTable('departments');
    table.integer('role_id').notNullable().references('id').inTable('roles');

    table.integer('year').notNullable();
    table.integer('month').notNullable(); // 1-12

    // Salary & allowances
    table.decimal('salary', 10, 2).notNullable();
    table.decimal('housing_allowance', 10, 2).defaultTo(0);
    table.decimal('transport_allowance', 10, 2).defaultTo(0);
    table.decimal('medical_allowance', 10, 2).defaultTo(0);
    table.decimal('overtime', 10, 2).defaultTo(0);
    table.decimal('bonus', 10, 2).defaultTo(0);
    table.decimal('total_gross', 10, 2).notNullable();

    // Deductions
    table.decimal('paye_tax_percentage', 5, 2).defaultTo(0);
    table.decimal('paye_tax_amount', 10, 2).defaultTo(0);

    table.decimal('napsa_contribution_percentage', 5, 2).defaultTo(0);
    table.decimal('napsa_contribution_amount', 10, 2).defaultTo(0);

    table.decimal('loan_deduction', 10, 2).defaultTo(0);
    table.decimal('union_dues', 10, 2).defaultTo(0);
    table.decimal('health_insurance', 10, 2).defaultTo(0);

    // NHIMA (Percentage + Amount)
    table.decimal('nhima_contribution_percentage', 5, 2).defaultTo(0);
    table.decimal('nhima_contribution_amount', 10, 2).defaultTo(0);

    table.decimal('wcif', 10, 2).defaultTo(0);

    table.decimal('total_deductions', 10, 2).defaultTo(0);
    table.decimal('net_salary', 10, 2).defaultTo(0);

    // Gratuity (Percentage + Amount)
    table.decimal('gratuity_percentage', 5, 2).defaultTo(0);
    table.decimal('gratuity_amount', 10, 2).defaultTo(0);

    table.string('status', 50).defaultTo('Pending');

    table.timestamps(true, true);

    // Unique constraint: one payroll record per staff per month
    table.unique(['staff_id', 'year', 'month']);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  const hasPayroll = await knex.schema.hasTable('payroll');
  if (hasPayroll) {
    await knex.schema.dropTable('payroll');
  }
};
