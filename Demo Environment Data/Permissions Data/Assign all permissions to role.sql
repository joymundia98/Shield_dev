INSERT INTO role_permissions (role_id, permission_id, organization_id)
SELECT
  63,
  p.id,
  56
FROM permissions p
ON CONFLICT DO NOTHING;