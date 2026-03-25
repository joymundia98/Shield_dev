-- This deletes all rows and resets the ID sequence
--TRUNCATE TABLE maintenance_categories RESTART IDENTITY;
INSERT INTO maintenance_categories (name, description)
VALUES
('Cleaning & Calibration', 'Regular cleaning and calibration of equipment to maintain accuracy and hygiene.'),
('Repair', 'Repair works for malfunctioning or damaged equipment or systems.'),
('Inspection', 'Routine inspections to check the condition of equipment, systems, or facilities.'),
('Preventive Maintenance', 'Scheduled maintenance to prevent equipment failure before it occurs.'),
('Predictive Maintenance', 'Maintenance based on data, monitoring, and predictive analytics.'),
('Overhaul', 'Comprehensive disassembly and refurbishment of equipment to restore it to like-new condition.'),
('Lubrication', 'Regular application of lubricants to reduce friction and wear on moving parts.'),
('Replacement', 'Replacing worn-out or obsolete parts, components, or systems.'),
('Testing & Validation', 'Performing tests to ensure systems and equipment meet operational standards.'),
('Software & Firmware Updates', 'Updating software or firmware to improve performance or security.'),
('Safety Checks', 'Maintenance to ensure compliance with safety regulations and standards.'),
('Environmental & Waste Management', 'Maintenance related to environmental compliance, waste disposal, and sustainability.'),
('Emergency Maintenance', 'Unplanned maintenance due to unexpected failure or hazard.'),
('Documentation & Record Keeping', 'Maintenance related to updating logs, manuals, and compliance records.');