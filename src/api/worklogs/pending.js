import dbConnect from "@/lib/db";
import WorkLog from "@/models/WorkLog";
import User from "@/models/User";
import { getTokenFromReq, verifyToken, requireRole } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub);
    requireRole(actor, ["Supervisor", "Admin"]);

    // Supervisor: only team (users whose managerId = supervisor)
    let employeeIds = [];
    if (actor.role === "Supervisor") {
      const team = await User.find({ managerId: actor._id }).select("_id");
      employeeIds = team.map((u) => u._id);
    }

    const filter = { status: "Pending" };
    if (actor.role === "Supervisor") filter.employee = { $in: employeeIds };

    const pending = await WorkLog.find(filter)
      .populate("employee", "employeeId name email role")
      .populate({ path: "kpi", populate: { path: "department" } })
      .sort({ createdAt: -1 });

    return res.json({ pending });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}