-- This deletes all rows and resets the ID sequence
--TRUNCATE TABLE maintenance_categories RESTART IDENTITY;
INSERT INTO maintenance_categories (name, description, organization_id)
VALUES
('Cleaning & Calibration', 'Regular cleaning and calibration of equipment to maintain accuracy and hygiene.', 33),
('Repair', 'Repair works for malfunctioning or damaged equipment or systems.', 33),
('Inspection', 'Routine inspections to check the condition of equipment, systems, or facilities.', 33),
('Preventive Maintenance', 'Scheduled maintenance to prevent equipment failure before it occurs.', 33),
('Predictive Maintenance', 'Maintenance based on data, monitoring, and predictive analytics.', 33),
('Overhaul', 'Comprehensive disassembly and refurbishment of equipment to restore it to like-new condition.', 33),
('Lubrication', 'Regular application of lubricants to reduce friction and wear on moving parts.', 33),
('Replacement', 'Replacing worn-out or obsolete parts, components, or systems.', 33),
('Testing & Validation', 'Performing tests to ensure systems and equipment meet operational standards.', 33),
('Software & Firmware Updates', 'Updating software or firmware to improve performance or security.', 33),
('Safety Checks', 'Maintenance to ensure compliance with safety regulations and standards.', 33),
('Environmental & Waste Management', 'Maintenance related to environmental compliance, waste disposal, and sustainability.', 33),
('Emergency Maintenance', 'Unplanned maintenance due to unexpected failure or hazard.', 33),
('Documentation & Record Keeping', 'Maintenance related to updating logs, manuals, and compliance records.', 33);