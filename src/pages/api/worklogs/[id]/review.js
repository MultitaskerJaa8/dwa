import dbConnect from "@/lib/db";
import WorkLog from "@/models/WorkLog";
import User from "@/models/User";
import { getTokenFromReq, verifyToken, requireRole } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub);
    requireRole(actor, ["Supervisor", "Admin"]);

    const { id } = req.query;
    const { decision, remarks, approvedScore } = req.body || {};

    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({ message: "decision must be Approved/Rejected" });
    }

    const log = await WorkLog.findById(id).populate("employee");
    if (!log) return res.status(404).json({ message: "WorkLog not found" });

    // Supervisor can only review own team
    if (actor.role === "Supervisor") {
      if (!log.employee?.managerId || log.employee.managerId.toString() !== actor._id.toString()) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    log.status = decision;
    log.supervisorRemarks = String(remarks || "").trim();
    log.approvedScore = decision === "Approved" ? Math.max(0, Math.min(100, Number(approvedScore || 0))) : 0;
    log.reviewedBy = actor._id;
    log.reviewedAt = new Date();
    await log.save();

    await writeAudit({
      actorId: actor._id,
      action: "WORKLOG_REVIEW",
      entityType: "WorkLog",
      entityId: log._id.toString(),
      meta: { decision, approvedScore: log.approvedScore },
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      ua: req.headers["user-agent"]
    });

    return res.json({ log });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}