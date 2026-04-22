export function formatAuditLog(log) {
  return {
    id: log.id,
    user: log.user_name || "System",
    action: log.action,
    module: log.module,
    record_id: log.record_id,
    time: log.created_at,

    changes: buildChanges(log.old_values, log.new_values)
  };
}

function buildChanges(oldData, newData) {
  if (!oldData && !newData) return [];

  const oldObj = parseJSON(oldData);
  const newObj = parseJSON(newData);

  const changes = [];

  const keys = new Set([
    ...Object.keys(oldObj || {}),
    ...Object.keys(newObj || {})
  ]);

  for (const key of keys) {
    if ((oldObj?.[key]) !== (newObj?.[key])) {
      changes.push({
        field: key,
        old: oldObj?.[key] ?? null,
        new: newObj?.[key] ?? null
      });
    }
  }

  return changes;
}

function parseJSON(data) {
  if (!data) return null;
  if (typeof data === "object") return data;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}