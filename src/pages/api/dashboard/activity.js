import dbConnect from "@/lib/db";
import User from "@/models/User";
import WorkLog from "@/models/WorkLog";
import { getTokenFromReq, verifyToken, requireRole } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub).populate("department");
    if (!actor) return res.status(401).json({ message: "Unauthorized" });

    // Employee: show own recent logs
    if (actor.role === "Employee") {
      const recent = await WorkLog.find({ employee: actor._id })
        .populate("kpi")
        .sort({ createdAt: -1 })
        .limit(6);

      return res.json({
        type: "employee",
        recentSubmissions: recent
      });
    }

    // Supervisor/Admin: show pending approvals
    if (actor.role === "Supervisor") {
      const team = await User.find({ managerId: actor._id }).select("_id");
      const teamIds = team.map((t) => t._id);

      const pending = await WorkLog.find({
        status: "Pending",
        employee: { $in: teamIds }
      })
        .populate("employee", "name employeeId email")
        .populate("kpi")
        .sort({ createdAt: -1 })
        .limit(6);

      return res.json({
        type: "supervisor",
        pendingApprovals: pending,
        teamSize: teamIds.length
      });
    }

    // Admin
    requireRole(actor, ["Admin"]);

    const pending = await WorkLog.find({ status: "Pending" })
      .populate("employee", "name employeeId email")
      .populate("kpi")
      .sort({ createdAt: -1 })
      .limit(6);

    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name employeeId email role createdAt");

    return res.json({
      type: "admin",
      pendingApprovals: pending,
      recentUsers
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
}
