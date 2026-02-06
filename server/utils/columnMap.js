// utils/columnMap.js

export const USER_COLUMNS = {
  "First Name": "first_name",
  "Last Name": "last_name",
  "Email": "email",
  "Password": "password",
  "Phone": "phone",
  "Position": "position",
  "Organization ID": "organization_id",
  "Status": "status",
  "Photo URL": "photo_url"
};

export const MEMBER_COLUMNS = {
  "Full Name": "full_name",
  "Email": "email",
  "Phone": "phone",
  "Gender": "gender",
  "Date of Birth": "date_of_birth",
  "Date Joined": "date_joined",
  "User ID": "user_id",
  "Age": "age",
  "Disabled": "disabled",
  "Orphan": "orphan",
  "Widowed": "widowed",
  "NRC": "nrc",
  "Guardian Name": "guardian_name",
  "Guardian Phone": "guardian_phone",
  "Status": "status",
  "Organization ID": "organization_id"
};

export const PROGRAM_COLUMNS = {
  "Program Name": "name",
  "Description": "description",
  "Department": "department",
  "Department ID": "department_id",
  "Category ID": "category_id",
  "Organization ID": "organization_id",
  "Date": "date",
  "Time": "time",
  "Venue": "venue",
  "Agenda": "agenda",
  "Status": "status",
  "Event Type": "event_type",
  "Notes": "notes"
};

// ================================
// NEW TABLES / MODELS
// ================================

export const ORGANIZATION_COLUMNS = {
  "Organization ID": "id",
  "Account ID": "organization_account_id",
  "Name": "name",
  "Denomination": "denomination",
  "Address": "address",
  "Region": "region",
  "District": "district",
  "Email": "organization_email",
  "Type ID": "org_type_id",
  "Headquarters ID": "headquarters_id",
  "Status": "status",
  "Password": "password",
  "Created At": "created_at",
  "Updated At": "updated_at"
};

export const DEPARTMENT_COLUMNS = {
  "Department ID": "id",
  "Name": "name",
  "Description": "description",
  "Category": "category",
  "Organization ID": "organization_id"
};

export const FOLLOWUP_COLUMNS = {
  "FollowUp ID": "followup_id",
  "Visitor ID": "visitor_id",
  "FollowUp Date": "followup_date",
  "Type": "type",
  "Notes": "notes",
  "Organization ID": "organization_id",
  "Created At": "created_at",
  "Updated At": "updated_at"
};

export const FOLLOWUP_SESSION_COLUMNS = {
  "FollowUp Session ID": "follow_up_id",
  "Session ID": "session_id",
  "Counsellor ID": "counsellor_id",
  "Follow Up Date": "follow_up_date",
  "Notes": "notes",
  "Status": "status",
  "Organization ID": "organization_id",
  "Created At": "created_at",
  "Updated At": "updated_at"
};

export const INCOME_COLUMNS = {
  "Income ID": "id",
  "Organization ID": "organization_id",
  "Subcategory ID": "subcategory_id",
  "User ID": "user_id",
  "Donor ID": "donor_id",
  "Date": "date",
  "Giver": "giver",
  "Description": "description",
  "Amount": "amount",
  "Status": "status",
  "Created At": "created_at"
};

export const EXPENSE_COLUMNS = {
  "Expense ID": "id",
  "Organization ID": "organization_id",
  "Department ID": "department_id",
  "Subcategory ID": "subcategory_id",
  "User ID": "user_id",
  "Date": "date",
  "Description": "description",
  "Amount": "amount",
  "Status": "status",
  "Created At": "created_at"
};

export const BUDGET_COLUMNS = {
  "Budget ID": "id",
  "Title": "title",
  "Amount": "amount",
  "Year": "year",
  "Month": "month",
  "Category ID": "category_id",
  "Expense Subcategory ID": "expense_subcategory_id",
  "Organization ID": "organization_id",
  "Created At": "created_at"
};

export const CONVERTS_COLUMNS = {
  "Convert ID": "id",
  "Convert Type": "convert_type",
  "Convert Date": "convert_date",
  "Member ID": "member_id",
  "Visitor ID": "visitor_id",
  "Follow Up Status": "follow_up_status",
  "Organization ID": "organization_id",
  "Created At": "created_at",
  "Updated At": "updated_at"
};

export const ATTENDANCE_COLUMNS = {
  "Record ID": "record_id",
  "Status": "status",
  "Attendance Date": "attendance_date",
  "Service ID": "service_id",
  "Member ID": "member_id",
  "Visitor ID": "visitor_id",
  "Organization ID": "organization_id",
  "Created At": "created_at",
  "Updated At": "updated_at"
};

export const CONGREGANT_COLUMNS = {
  "Congregant ID": "id",
  "Name": "name",
  "Gender": "gender",
  "Category ID": "category_id",
  "Organization ID": "organization_id",
  "Created At": "created_at",
  "Updated At": "updated_at"
};

export const SESSION_COLUMNS = {
  "Session ID": "id",
  "Name": "name",
  "Date": "date",
  "Description": "description",
  "Organization ID": "organization_id",
  "Created At": "created_at",
  "Updated At": "updated_at"
};

export const SERVICE_COLUMNS = {
  "Service ID": "id",
  "Name": "name",
  "Description": "description",
  "Organization ID": "organization_id",
  "Created At": "created_at",
  "Updated At": "updated_at"
};

export const VISITOR_COLUMNS = {
  "Visitor ID": "id",
  "Name": "name",
  "Gender": "gender",
  "Age": "age",
  "Visit Date": "visit_date",
  "Address": "address",
  "Phone": "phone",
  "Email": "email",
  "Invited By": "invited_by",
  "Photo URL": "photo_url",
  "First Time": "first_time",
  "Needs Follow Up": "needs_follow_up",
  "Service ID": "service_id",
  "Church Find Out": "church_find_out",
  "Organization ID": "organization_id",
  "Created At": "created_at",
  "Updated At": "updated_at"
};
