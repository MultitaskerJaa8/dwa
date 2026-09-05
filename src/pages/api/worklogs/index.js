import dbConnect from "@/lib/db";
import WorkLog from "@/models/WorkLog";
import KPI from "@/models/KPI";
import User from "@/models/User";
import { getTokenFromReq, verifyToken, requireRole } from "@/lib/auth";
import { required } from "@/lib/validators";
import { writeAudit } from "@/lib/audit";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub).populate("department");
    if (!actor) return res.status(401).json({ message: "Unauthorized" });

    if (req.method === "GET") {
      // employee: own logs, supervisor/admin: can still view own logs here
      const logs = await WorkLog.find({ employee: actor._id })
        .populate({ path: "kpi", populate: { path: "department" } })
        .sort({ createdAt: -1 });

      return res.json({ logs });
    }

    if (req.method === "POST") {
      requireRole(actor, ["Employee", "Supervisor", "Admin"]); // any logged-in can submit for self; you can restrict to Employee

      const { kpiId, periodMonth, periodYear, taskTitle, taskDetails, evidenceUrl } = req.body || {};
      required(kpiId, "kpiId");
      required(periodMonth, "periodMonth");
      required(periodYear, "periodYear");
      required(taskTitle, "taskTitle");
      required(taskDetails, "taskDetails");

      const kpi = await KPI.findById(kpiId).populate("department");
      if (!kpi) return res.status(404).json({ message: "KPI not found" });

      // non-admin must match department
      if (actor.role !== "Admin") {
        if (!actor.department?._id || actor.department._id.toString() !== kpi.department._id.toString()) {
          return res.status(403).json({ message: "KPI not allowed for your department" });
        }
      }

      const log = await WorkLog.create({
        employee: actor._id,
        kpi: kpi._id,
        periodMonth: Number(periodMonth),
        periodYear: Number(periodYear),
        taskTitle: String(taskTitle).trim(),
        taskDetails: String(taskDetails).trim(),
        evidenceUrl: String(evidenceUrl || "").trim(),
        status: "Pending"
      });

      await writeAudit({
        actorId: actor._id,
        action: "WORKLOG_SUBMIT",
        entityType: "WorkLog",
        entityId: log._id.toString(),
        meta: { kpiId: kpi._id.toString(), periodMonth, periodYear },
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        ua: req.headers["user-agent"]
      });

      return res.status(201).json({ log });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}