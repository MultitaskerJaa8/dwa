import dbConnect from "@/lib/db";
import User from "@/models/User";
import Department from "@/models/Department";
import { getTokenFromReq, verifyToken, requireRole } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub);
    requireRole(actor, ["Admin"]);

    if (req.method === "GET") {
      const users = await User.find({})
        .populate("department")
        .sort({ createdAt: -1 })
        .select("-passwordHash");

      const departments = await Department.find({}).sort({ name: 1 });

      return res.json({ users, departments });
    }

    if (req.method === "PATCH") {
      const { userId, role, departmentId, managerId, designation, status } = req.body || {};
      if (!userId) return res.status(400).json({ message: "userId required" });

      const update = {};
      if (role) update.role = role;
      if (typeof designation === "string") update.designation = designation;
      if (status) update.status = status;
      if (departmentId !== undefined) update.department = departmentId || null;
      if (managerId !== undefined) update.managerId = managerId || null;

      const user = await User.findByIdAndUpdate(userId, update, { new: true })
        .populate("department")
        .select("-passwordHash");

      await writeAudit({
        actorId: actor._id,
        action: "USER_UPDATE",
        entityType: "User",
        entityId: String(userId),
        meta: update,
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        ua: req.headers["user-agent"]
      });

      return res.json({ user });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}