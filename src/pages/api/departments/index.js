import dbConnect from "@/lib/db";
import Department from "@/models/Department";
import User from "@/models/User";
import { getTokenFromReq, verifyToken, requireRole } from "@/lib/auth";
import { required } from "@/lib/validators";
import { writeAudit } from "@/lib/audit";

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const list = await Department.find({}).sort({ name: 1 });
      return res.json({ departments: list });
    }

    // POST (Admin only)
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub);
    requireRole(actor, ["Admin"]);

    if (req.method === "POST") {
      const { name, code } = req.body || {};
      required(name, "name");
      required(code, "code");

      const dep = await Department.create({
        name: String(name).trim(),
        code: String(code).trim().toUpperCase()
      });

      await writeAudit({
        actorId: actor._id,
        action: "DEPARTMENT_CREATE",
        entityType: "Department",
        entityId: dep._id.toString(),
        meta: { name: dep.name, code: dep.code },
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        ua: req.headers["user-agent"]
      });

      return res.status(201).json({ department: dep });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}