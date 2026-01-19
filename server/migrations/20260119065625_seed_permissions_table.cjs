/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex('permissions').insert([
    // PRIVATE AUTH PAGES
    {
      name: 'Create Admin Account',
      path: '/admin/create-account',
      method: 'POST',
      description: 'Create a new admin account with full access rights to the system.'
    },

    // ORGANIZATION PAGES
    {
      name: 'View Organization Login',
      path: '/org-login',
      method: 'GET',
      description: 'View the login page for an organization, enabling users to authenticate into their account.'
    },
    {
      name: 'View Organization Registration',
      path: '/org-register',
      method: 'GET',
      description: 'View the registration page for creating a new organization.'
    },
    {
      name: 'View Organization Dashboard',
      path: '/org-dashboard',
      method: 'GET',
      description: 'View the dashboard containing vital statistics and data for the organization.'
    },

    // MAIN DASHBOARD
    {
      name: 'View Main Dashboard',
      path: '/dashboard',
      method: 'GET',
      description: 'Access and view the main dashboard with an overview of system activities and data.'
    },

    // DEPARTMENT DASHBOARDS
    {
      name: 'View Pastoral Dashboard',
      path: '/pastoral/dashboard',
      method: 'GET',
      description: 'View the dashboard for the pastoral department, displaying key metrics and activities.'
    },
    {
      name: 'View Programs Dashboard',
      path: '/programs/dashboard',
      method: 'GET',
      description: 'Access the programs dashboard to view and manage ongoing programs.'
    },
    {
      name: 'View Ministry Dashboard',
      path: '/ministry/dashboard',
      method: 'GET',
      description: 'View the dashboard that provides insights and metrics for ministry activities.'
    },
    {
      name: 'View HR Dashboard',
      path: '/hr/dashboard',
      method: 'GET',
      description: 'View the HR department dashboard with staff-related data and metrics.'
    },
    {
      name: 'View Governance Dashboard',
      path: '/governance/dashboard',
      method: 'GET',
      description: 'Access the governance dashboard displaying policies, compliance logs, and audit reports.'
    },
    {
      name: 'View Finance Dashboard',
      path: '/finance/dashboard',
      method: 'GET',
      description: 'View financial data and key performance indicators related to the organization’s finances.'
    },
    {
      name: 'View Donor Dashboard',
      path: '/donor/dashboard',
      method: 'GET',
      description: 'Access the donor dashboard displaying all donor-related information and stats.'
    },
    {
      name: 'View Congregation Dashboard',
      path: '/congregation/dashboard',
      method: 'GET',
      description: 'View an overview of the congregation’s attendance, conversions, and other key metrics.'
    },
    {
      name: 'View Class Dashboard',
      path: '/class/dashboard',
      method: 'GET',
      description: 'View the class dashboard showing class-specific data such as attendance and student performance.'
    },
    {
      name: 'View Asset Dashboard',
      path: '/assets/dashboard',
      method: 'GET',
      description: 'Access the asset management dashboard showing asset usage, depreciation, and maintenance information.'
    },

    // ASSETS MODULE
    {
      name: 'View All Assets',
      path: '/assets/assets',
      method: 'GET',
      description: 'View a list of all assets within the organization, with details like condition, category, and value.'
    },
    {
      name: 'Add Asset',
      path: '/assets/addAsset',
      method: 'POST',
      description: 'Add a new asset to the organization’s inventory.'
    },
    {
      name: 'View Detailed Info about an Asset',
      path: '/assets/viewAsset',
      method: 'GET',
      description: 'View detailed information about a specific asset, including usage and maintenance history.'
    },
    {
      name: 'View Asset Depreciation',
      path: '/assets/depreciation',
      method: 'GET',
      description: 'View the depreciation of assets, showing how their value decreases over time.'
    },
    {
      name: 'Manage Asset Maintenance',
      path: '/assets/maintenance',
      method: 'PUT',
      description: 'Manage maintenance schedules and logs for all assets to ensure they are operational.'
    },
    {
      name: 'View Categories',
      path: '/assets/categories',
      method: 'GET',
      description: 'View the various categories of assets, such as office equipment, machinery, etc.'
    },

    // DONOR MANAGEMENT
    {
      name: 'View All Donors',
      path: '/donor/donors',
      method: 'GET',
      description: 'View all donors who have contributed to the organization, with detailed contributions and history.'
    },
    {
      name: 'Add Donor',
      path: '/donor/addDonor',
      method: 'POST',
      description: 'Add a new donor to the system and associate their details with future donations.'
    },
    {
      name: 'View All Donations',
      path: '/donor/donations',
      method: 'GET',
      description: 'View all donations made by donors, including amounts, dates, and purposes.'
    },
    {
      name: 'Add Donation',
      path: '/donor/addDonation',
      method: 'POST',
      description: 'Add a donation record, specifying the donor, amount, and purpose of donation.'
    },
    {
      name: 'View Donor Categories',
      path: '/donor/donorCategories',
      method: 'GET',
      description: 'View categories of donors, such as individual, corporate, etc.'
    },
    {
      name: 'View Detailed Info about a Donor',
      path: '/donor/donorView',
      method: 'GET',
      description: 'View detailed information about a specific donor including past donations and contact information.'
    },
    {
      name: 'Edit Donor Info',
      path: '/donor/editDonor/:donorId',
      method: 'PATCH',
      description: 'Edit the information of a specific donor, such as contact details or donation history.'
    },
    {
      name: 'View Detailed Info about a Donation',
      path: '/donor/DonationViewPage/:id',
      method: 'GET',
      description: 'View detailed information about a specific donation, including donor details and the allocated fund.'
    },
    {
      name: 'Edit Donation Info',
      path: '/donor/EditDonationPage/:id',
      method: 'PATCH',
      description: 'Edit the details of a specific donation, including amount or purpose.'
    },

    // CONGREGATION MODULE
    {
      name: 'View Members Summary',
      path: '/congregation/members',
      method: 'GET',
      description: 'View an overview of congregation members, including demographics and participation.'
    },
    {
      name: 'Manage Congregation Attendance',
      path: '/congregation/attendance',
      method: 'POST',
      description: 'Manage attendance records for congregation members during services or events.'
    },
    {
      name: 'Record Congregation Attendance',
      path: '/congregation/recordAttendance',
      method: 'POST',
      description: 'Record attendance data for a specific congregation session.'
    },
    {
      name: 'View Congregation Follow-ups',
      path: '/congregation/followups',
      method: 'GET',
      description: 'View follow-up activities for congregation members, including past visits or meetings.'
    },
    {
      name: 'View Member Records',
      path: '/congregation/memberRecords',
      method: 'GET',
      description: 'View detailed records of each congregation member, including history, contributions, and participation.'
    },
    {
      name: 'Add Congregation Member',
      path: '/congregation/addMember',
      method: 'POST',
      description: 'Add a new member to the congregation database, including personal and contact information.'
    },
    {
      name: 'View Detailed Info about a Member',
      path: '/congregation/viewMember/:id',
      method: 'GET',
      description: 'View detailed information about a specific congregation member.'
    },
    {
      name: 'Edit Member Info',
      path: '/congregation/editMember/:memberId',
      method: 'PATCH',
      description: 'Edit the personal details or status of a congregation member.'
    },
    {
      name: 'View Detailed Info about a Visitor',
      path: '/congregation/viewVisitor/:id',
      method: 'GET',
      description: 'View detailed information about a visitor to the congregation, including visitation history.'
    },
    {
      name: 'Edit Visitor Info',
      path: '/congregation/editVisitor/:id',
      method: 'PATCH',
      description: 'Edit the information of a specific visitor.'
    },
    {
      name: 'View Converts Dashboard',
      path: '/congregation/converts',
      method: 'GET',
      description: 'View the dashboard showing the status of converts, including baptism and engagement.'
    },
    {
      name: 'View Convert Records',
      path: '/congregation/convertRecords',
      method: 'GET',
      description: 'View a list of records detailing individuals who have converted and their progress.'
    },
    {
      name: 'Add New Convert',
      path: '/congregation/addConvert',
      method: 'POST',
      description: 'Add a new convert to the congregation, capturing necessary personal details and conversion date.'
    },
    {
      name: 'View Visitor Dashboard',
      path: '/congregation/visitors',
      method: 'GET',
      description: 'View the dashboard displaying visitor metrics and activities.'
    },
    {
      name: 'Add New Visitor',
      path: '/congregation/addVisitors',
      method: 'POST',
      description: 'Add a new visitor to the congregation database.'
    },
    {
      name: 'View Visitor Records',
      path: '/congregation/visitorRecords',
      method: 'GET',
      description: 'View detailed records of congregation visitors and their participation.'
    },
    {
      name: 'View Convert Info',
      path: '/congregation/viewConvert/:id',
      method: 'GET',
      description: 'View detailed information about a specific convert, including their conversion journey.'
    },

    // FINANCE MODULE
    {
      name: 'View Finance Transactions',
      path: '/finance/transactions',
      method: 'GET',
      description: 'View all financial transactions, including payments, receipts, and transfers.'
    },
    {
      name: 'Manage Expense Tracker',
      path: '/finance/expensetracker',
      method: 'POST',
      description: 'Track and manage organizational expenses, including categorization and approval.'
    },
    {
      name: 'Manage Income Tracker',
      path: '/finance/incometracker',
      method: 'POST',
      description: 'Track and manage income streams, including donations, sponsorships, and other revenues.'
    },
    {
      name: 'View Expense Dashboard',
      path: '/finance/expenseDashboard',
      method: 'GET',
      description: 'View the dashboard summarizing all expenses for the organization.'
    },
    {
      name: 'View Income Dashboard',
      path: '/finance/incomeDashboard',
      method: 'GET',
      description: 'View the dashboard summarizing all income sources for the organization.'
    },
    {
      name: 'Add Expense',
      path: '/finance/addExpense',
      method: 'POST',
      description: 'Add an expense record, including the amount, category, and reason.'
    },
    {
      name: 'Add Income',
      path: '/finance/addIncome',
      method: 'POST',
      description: 'Add an income record, specifying source and amount.'
    },
    {
      name: 'Manage Payroll',
      path: '/finance/payroll',
      method: 'PUT',
      description: 'Manage and process payroll for staff and contractors within the organization.'
    },
    {
      name: 'View Finance Categories',
      path: '/finance/financeCategory',
      method: 'GET',
      description: 'View categories of financial transactions, such as expenses, income, and donations.'
    },
    {
      name: 'View Budgets Summary',
      path: '/finance/budgets',
      method: 'GET',
      description: 'View a summary of the organization’s budgets, including allocated funds for each department.'
    },
    {
      name: 'Set Budget',
      path: '/finance/setBudget',
      method: 'POST',
      description: 'Set a new budget for a specific department or category of expenses.'
    },
    {
      name: 'View Budget Breakdown',
      path: '/finance/budgetBreakdown',
      method: 'GET',
      description: 'View a breakdown of the organization’s budget allocation and expenditures.'
    },
    {
      name: 'View Detailed Payroll',
      path: '/finance/ViewPayrollPage/:payrollId',
      method: 'GET',
      description: 'View detailed payroll information for a specific pay cycle or staff member.'
    },
    {
      name: 'View Finance Reports',
      path: '/finance/reports',
      method: 'GET',
      description: 'View various financial reports, including profit and loss statements, tax filings, etc.'
    },

    // HR MODULE
    {
      name: 'View Staff Directory',
      path: '/hr/staffDirectory',
      method: 'GET',
      description: 'View a directory of all staff members, including their roles, departments, and contact information.'
    },
    {
      name: 'Manage Attendance',
      path: '/hr/attendance',
      method: 'POST',
      description: 'Record and manage attendance for all staff, tracking daily presence and absences.'
    },
    {
      name: 'Manage HR Payroll',
      path: '/hr/payroll',
      method: 'PUT',
      description: 'Process and manage payroll for all employees, ensuring timely payments and deductions.'
    },
    {
      name: 'Add Payroll',
      path: '/hr/addPayroll',
      method: 'POST',
      description: 'Add new payroll records, including salary details and payment methods for staff.'
    },
    {
      name: 'Manage Leave',
      path: '/hr/leave',
      method: 'PUT',
      description: 'Manage staff leave requests, including vacation, sick leave, and other types of absence.'
    },
    {
      name: 'View Departments',
      path: '/hr/departments',
      method: 'GET',
      description: 'View a list of all departments within the organization and their key personnel.'
    },
    {
      name: 'Add Staff',
      path: '/hr/addStaff',
      method: 'POST',
      description: 'Add new staff members to the system, capturing their personal details and job role.'
    },
    {
      name: 'Add Leave',
      path: '/hr/addLeave',
      method: 'POST',
      description: 'Add new leave records for employees, specifying type, dates, and approval status.'
    },
    {
      name: 'View Leave Applications',
      path: '/hr/leaveApplications',
      method: 'GET',
      description: 'View all leave applications submitted by staff, including approval status and type of leave.'
    },
    {
      name: 'View Detailed Info about a Payroll Record',
      path: '/hr/ViewPayroll/:payrollId',
      method: 'GET',
      description: 'View detailed information about a specific payroll record, including salaries and deductions.'
    },
    {
      name: 'Edit Payroll Record',
      path: '/hr/EditPayrollPage/:payrollId',
      method: 'PATCH',
      description: 'Edit details of a specific payroll record, such as salary or deductions.'
    },
    {
      name: 'View Detailed Info about a Staff Member',
      path: '/hr/viewStaff/:id',
      method: 'GET',
      description: 'View detailed information about a specific staff member, including personal details and job history.'
    },
    {
      name: 'Edit Staff Info',
      path: '/hr/editStaff/:id',
      method: 'PATCH',
      description: 'Edit personal details or employment information for a specific staff member.'
    },

    // PROGRAMS MODULE
    {
      name: 'View Donors',
      path: '/programs/donors',
      method: 'GET',
      description: 'View a list of donors specifically supporting programs within the organization.'
    },
    {
      name: 'View Registered Programs',
      path: '/programs/RegisteredPrograms',
      method: 'GET',
      description: 'View a list of all registered programs, including descriptions and statuses.'
    },
    {
      name: 'Manage Attendees',
      path: '/programs/attendeeManagement',
      method: 'POST',
      description: 'Manage attendee registration and attendance for programs and events.'
    },
    {
      name: 'Add Program',
      path: '/programs/addPrograms',
      method: 'POST',
      description: 'Add a new program to the system, including objectives, timeline, and funding requirements.'
    },
    {
      name: 'Add Attendees',
      path: '/programs/addAttendees/:programId',
      method: 'POST',
      description: 'Add attendees to a specific program, capturing their details and participation status.'
    },
    {
      name: 'Edit Attendee Info',
      path: '/programs/editAttendee/:attendeeId',
      method: 'PATCH',
      description: 'Edit information about a specific program attendee, including personal details and attendance record.'
    },
    {
      name: 'View Program Details',
      path: '/programs/viewProgram',
      method: 'GET',
      description: 'View detailed information about a specific program, including its goals and progress.'
    },
    {
      name: 'Edit Program Info',
      path: '/programs/editProgram/:id',
      method: 'PATCH',
      description: 'Edit details about a program, including its objectives, timeline, and status.'
    },

    // CLASS MODULE
    {
      name: 'View Classes',
      path: '/class/classes',
      method: 'GET',
      description: 'View a list of all classes offered, including descriptions, schedules, and instructors.'
    },
    {
      name: 'Add Class',
      path: '/class/add-class',
      method: 'POST',
      description: 'Add a new class to the system, specifying its schedule, teacher, and other relevant details.'
    },
    {
      name: 'View Teachers',
      path: '/class/teachers',
      method: 'GET',
      description: 'View a list of all teachers, including their classes, schedules, and contact information.'
    },
    {
      name: 'Manage Enrollments',
      path: '/class/enrollments',
      method: 'POST',
      description: 'Manage student enrollments in classes, including adding, removing, or modifying enrollment records.'
    },
    {
      name: 'Manage Student Attendance',
      path: '/class/attendance',
      method: 'POST',
      description: 'Record and manage class attendance, tracking student presence or absence in each session.'
    },
    {
      name: 'View Class Reports',
      path: '/class/reports',
      method: 'GET',
      description: 'View reports related to class performance, attendance, and other key metrics.'
    },

    // MINISTRY MODULE
    {
      name: 'View Ministry Teams',
      path: '/ministry/teams',
      method: 'GET',
      description: 'View all ministry teams within the organization, including team members and activities.'
    },
    {
      name: 'View Ministry Members',
      path: '/ministry/members',
      method: 'GET',
      description: 'View a list of all members in ministry teams, including roles and contact details.'
    },
    {
      name: 'View Ministry Reports',
      path: '/ministry/reports',
      method: 'GET',
      description: 'View reports on ministry activities, performance, and impact.'
    },
    {
      name: 'View Pastors Records',
      path: '/ministry/pastors',
      method: 'GET',
      description: 'View detailed records of pastors, including contact information and assignments.'
    },

    // PASTORAL MODULE
    {
      name: 'View Pastoral Donors',
      path: '/pastoral/donors',
      method: 'GET',
      description: 'View all donors supporting pastoral activities, including donation details.'
    },
    {
      name: 'Add Pastoral Donor',
      path: '/pastoral/add-donor',
      method: 'POST',
      description: 'Add a new donor supporting pastoral activities to the system.'
    },
    {
      name: 'View Pastoral Donations',
      path: '/pastoral/donations',
      method: 'GET',
      description: 'View donations specifically allocated for pastoral initiatives, including amounts and donor details.'
    },
    {
      name: 'View Pastoral Reports',
      path: '/pastoral/reports',
      method: 'GET',
      description: 'View reports on pastoral activities, donations, and program outcomes.'
    },

    // GOVERNANCE MODULE
    {
      name: 'View Policies',
      path: '/governance/policies',
      method: 'GET',
      description: 'View all governance policies and guidelines applicable within the organization.'
    },
    {
      name: 'View Audit Reports',
      path: '/governance/audit-reports',
      method: 'GET',
      description: 'Access detailed audit reports for organizational activities, financials, and compliance.'
    },
    {
      name: 'View Compliance Logs',
      path: '/governance/compliance-logs',
      method: 'GET',
      description: 'View logs of compliance activities, tracking adherence to policies and regulations.'
    },
    {
      name: 'View Documentation',
      path: '/governance/documentation',
      method: 'GET',
      description: 'View official documentation related to governance practices, policies, and procedures.'
    },
    {
      name: 'View Certificates',
      path: '/governance/certificates',
      method: 'GET',
      description: 'View various certificates related to the organization’s compliance and regulatory standards.'
    }
  ]);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex('permissions')
    .whereIn('path', [
      '/admin/create-account',
      '/org-login',
      '/org-register',
      '/org-dashboard',
      '/dashboard',
      '/pastoral/dashboard',
      '/programs/dashboard',
      '/ministry/dashboard',
      '/hr/dashboard',
      '/governance/dashboard',
      '/finance/dashboard',
      '/donor/dashboard',
      '/congregation/dashboard',
      '/class/dashboard',
      '/assets/dashboard',
      '/assets/assets',
      '/assets/addAsset',
      '/assets/viewAsset',
      '/assets/depreciation',
      '/assets/maintenance',
      '/assets/categories',
      '/donor/donors',
      '/donor/addDonor',
      '/donor/donations',
      '/donor/addDonation',
      '/donor/donorCategories',
      '/donor/donorView',
      '/donor/editDonor/:donorId',
      '/donor/DonationViewPage/:id',
      '/donor/EditDonationPage/:id',
      '/congregation/members',
      '/congregation/attendance',
      '/congregation/recordAttendance',
      '/congregation/followups',
      '/congregation/memberRecords',
      '/congregation/addMember',
      '/congregation/viewMember/:id',
      '/congregation/editMember/:memberId',
      '/congregation/viewVisitor/:id',
      '/congregation/editVisitor/:id',
      '/congregation/converts',
      '/congregation/convertRecords',
      '/congregation/addConvert',
      '/congregation/visitors',
      '/congregation/addVisitors',
      '/congregation/visitorRecords',
      '/congregation/viewConvert/:id',
      '/finance/transactions',
      '/finance/expensetracker',
      '/finance/incometracker',
      '/finance/expenseDashboard',
      '/finance/incomeDashboard',
      '/finance/addExpense',
      '/finance/addIncome',
      '/finance/payroll',
      '/finance/financeCategory',
      '/finance/budgets',
      '/finance/setBudget',
      '/finance/budgetBreakdown',
      '/finance/ViewPayrollPage/:payrollId',
      '/finance/reports',
      '/hr/staffDirectory',
      '/hr/attendance',
      '/hr/payroll',
      '/hr/addPayroll',
      '/hr/leave',
      '/hr/departments',
      '/hr/addStaff',
      '/hr/addLeave',
      '/hr/leaveApplications',
      '/hr/ViewPayroll/:payrollId',
      '/hr/EditPayrollPage/:payrollId',
      '/hr/viewStaff/:id',
      '/hr/editStaff/:id',
      '/programs/donors',
      '/programs/RegisteredPrograms',
      '/programs/attendeeManagement',
      '/programs/addPrograms',
      '/programs/addAttendees/:programId',
      '/programs/editAttendee/:attendeeId',
      '/programs/viewProgram',
      '/programs/editProgram/:id',
      '/class/classes',
      '/class/add-class',
      '/class/teachers',
      '/class/enrollments',
      '/class/attendance',
      '/class/reports',
      '/ministry/teams',
      '/ministry/members',
      '/ministry/reports',
      '/ministry/pastors',
      '/pastoral/donors',
      '/pastoral/add-donor',
      '/pastoral/donations',
      '/pastoral/reports',
      '/governance/policies',
      '/governance/audit-reports',
      '/governance/compliance-logs',
      '/governance/documentation',
      '/governance/certificates'
    ]);
};
