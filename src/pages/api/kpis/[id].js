import dbConnect from "@/lib/db";
import KPI from "@/models/KPI";
import User from "@/models/User";
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

    const { id } = req.query;

    if (req.method === "PATCH") {
      const update = req.body || {};
      const kpi = await KPI.findByIdAndUpdate(id, update, { new: true }).populate("department");

      await writeAudit({
        actorId: actor._id,
        action: "KPI_UPDATE",
        entityType: "KPI",
        entityId: String(id),
        meta: update,
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        ua: req.headers["user-agent"]
      });

      return res.json({ kpi });
    }

    if (req.method === "DELETE") {
      await KPI.findByIdAndDelete(id);

      await writeAudit({
        actorId: actor._id,
        action: "KPI_DELETE",
        entityType: "KPI",
        entityId: String(id),
        meta: {},
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        ua: req.headers["user-agent"]
      });

      return res.json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}