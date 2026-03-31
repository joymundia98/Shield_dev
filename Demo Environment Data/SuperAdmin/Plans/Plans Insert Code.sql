--SELECT * FROM plans;
-- Insert plans with different billing cycles
INSERT INTO plans (name, price, billing_cycle, created_at, updated_at) VALUES
-- Single Church Plan
('Single Church Plan (Independent Churches)', 500, 'Monthly', NOW(), NOW()),
('Single Church Plan (Independent Churches)', 500 * 3, 'Quarterly', NOW(), NOW()),
('Single Church Plan (Independent Churches)', 500 * 6, 'Semi-Annually', NOW(), NOW()),
('Single Church Plan (Independent Churches)', 500 * 12, 'Annually', NOW(), NOW()),

-- Multiple Church (Head Office) Plan
('Multiple Church (Head Office) Plan', 800, 'Monthly', NOW(), NOW()),
('Multiple Church (Head Office) Plan', 800 * 3, 'Quarterly', NOW(), NOW()),
('Multiple Church (Head Office) Plan', 800 * 6, 'Semi-Annually', NOW(), NOW()),
('Multiple Church (Head Office) Plan', 800 * 12, 'Annually', NOW(), NOW()),

-- Branch Church Plan
('Branch Church Plan', 500, 'Monthly', NOW(), NOW()),
('Branch Church Plan', 500 * 3, 'Quarterly', NOW(), NOW()),
('Branch Church Plan', 500 * 6, 'Semi-Annually', NOW(), NOW()),
('Branch Church Plan', 500 * 12, 'Annually', NOW(), NOW()),

-- Mother Body / Oversight Plan
('Mother Body / Oversight Plan', 1200, 'Monthly', NOW(), NOW()),
('Mother Body / Oversight Plan', 1200 * 3, 'Quarterly', NOW(), NOW()),
('Mother Body / Oversight Plan', 1200 * 6, 'Semi-Annually', NOW(), NOW()),
('Mother Body / Oversight Plan', 1200 * 12, 'Annually', NOW(), NOW()),

-- NGO & Donor-Funded Projects
('NGO & Donor-Funded Projects', 1200, 'Monthly', NOW(), NOW()),
('NGO & Donor-Funded Projects', 1200 * 3, 'Quarterly', NOW(), NOW()),
('NGO & Donor-Funded Projects', 1200 * 6, 'Semi-Annually', NOW(), NOW()),
('NGO & Donor-Funded Projects', 1200 * 12, 'Annually', NOW(), NOW());