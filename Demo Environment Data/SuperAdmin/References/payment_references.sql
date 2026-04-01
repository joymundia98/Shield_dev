--Select * from payment_references;
INSERT INTO payment_references (type, created_at, updated_at)
VALUES
  ('Base / Ordinary Package', NOW(), NOW()),
  ('Add-ons / Extra Features', NOW(), NOW()),
  ('Customization / Development Requests', NOW(), NOW()),
  ('Upgrades / Plan Changes', NOW(), NOW()),
  ('Support / Maintenance Fees', NOW(), NOW()),
  ('One-time Charges', NOW(), NOW()),
  ('Discounts / Adjustments', NOW(), NOW());