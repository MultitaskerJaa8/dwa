import AuditLog from "@/models/AuditLog";

export async function writeAudit({
  actorId,
  action,
  entityType,
  entityId,
  meta,
  ip,
  ua
}) {
  try {
    await AuditLog.create({
      actorId,
      action,
      entityType,
      entityId,
      meta: meta || {},
      ip: ip || "",
      ua: ua || ""
    });
  } catch (e) {
    // audit fail should not break core flow
  }
}