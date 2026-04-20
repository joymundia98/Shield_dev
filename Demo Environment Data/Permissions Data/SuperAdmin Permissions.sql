INSERT INTO permissions (name, path, method, description) VALUES
('Super Admin Login', '/SuperAdmin', 'GET', 'Access the Super Admin login page.'),

('View Super Admin Dashboard', '/SuperAdmin/dashboard', 'GET', 'Access the Super Admin dashboard with system-wide analytics and controls.'),

('View Registered Organizations', '/SuperAdmin/RegisteredOrganizations', 'GET', 'View all organizations registered in the system with their details and status.'),
('Manage Registered Organizations', '/SuperAdmin/RegisteredOrganizations', 'PUT', 'Approve, suspend, or manage registered organizations.'),

('View Registered Admins', '/SuperAdmin/RegisteredAdmins', 'GET', 'View all admin accounts across organizations.'),
('Manage Registered Admins', '/SuperAdmin/RegisteredAdmins', 'PUT', 'Edit, activate, deactivate, or delete admin accounts.'),

('View Subscriptions', '/SuperAdmin/Subscriptions', 'GET', 'View all subscription plans and their details.'),
('Add Subscription', '/SuperAdmin/AddSubscription', 'POST', 'Create a new subscription plan.'),
('Edit Subscription', '/SuperAdmin/Subscriptions/:id', 'PATCH', 'Modify an existing subscription plan.'),

('View Payments', '/SuperAdmin/Payments', 'GET', 'View all payments made by organizations.'),
('Add Payment', '/SuperAdmin/AddPayment', 'POST', 'Record a new payment transaction.'),
('Verify Payment', '/SuperAdmin/Payments/:id', 'PATCH', 'Verify or update payment status.'),

('Register Super Admin', '/SuperAdmin/RegisterAdmin', 'POST', 'Register a new Super Admin account.'),

('System Overview Reports', '/SuperAdmin/reports', 'GET', 'View global system reports including revenue, usage, and performance.'),

('Manage System Settings', '/SuperAdmin/settings', 'PUT', 'Configure global system settings and platform-wide rules.');