import dbConnect from "@/lib/db";
import KPI from "@/models/KPI";
import User from "@/models/User";
import Department from "@/models/Department";
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
      const filter = {};
      // Employees/Supervisors: only their department KPIs
      if (actor.role !== "Admin") {
        if (!actor.department?._id) return res.json({ kpis: [], departments: [] });
        filter.department = actor.department._id;
      }

      const kpis = await KPI.find(filter).populate("department").sort({ createdAt: -1 });
      const departments = actor.role === "Admin" ? await Department.find({}).sort({ name: 1 }) : [];
      return res.json({ kpis, departments });
    }

    // Admin only create KPI
    requireRole(actor, ["Admin"]);

    if (req.method === "POST") {
      const { title, category, description, departmentId, targetValue, weightage, cycle } = req.body || {};
      required(title, "title");
      required(departmentId, "departmentId");
      required(weightage, "weightage");

      const kpi = await KPI.create({
        title: String(title).trim(),
        category: String(category || "General").trim(),
        description: String(description || "").trim(),
        department: departmentId,
        targetValue: Number(targetValue || 100),
        weightage: Number(weightage),
        cycle: cycle || "Monthly"
      });

      await writeAudit({
        actorId: actor._id,
        action: "KPI_CREATE",
        entityType: "KPI",
        entityId: kpi._id.toString(),
        meta: { title: kpi.title, departmentId },
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        ua: req.headers["user-agent"]
      });

      return res.status(201).json({ kpi });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}