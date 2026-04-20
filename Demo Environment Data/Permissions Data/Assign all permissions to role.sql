INSERT INTO role_permissions (role_id, permission_id, organization_id)
SELECT
  90,
  p.id,
  33
FROM permissions p
ON CONFLICT DO NOTHING;