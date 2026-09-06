import dbConnect from "@/lib/db";
import User from "@/models/User";
import WorkLog from "@/models/WorkLog";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub);
    if (!actor) return res.status(401).json({ message: "Unauthorized" });

    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));

    const keys = months.map(monthKey);
    const labels = months.map((d) => `${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()}`);

    // Decide scope
    let employeeFilter = null;
    if (actor.role === "Employee") employeeFilter = { employee: actor._id };
    if (actor.role === "Supervisor") {
      const team = await User.find({ managerId: actor._id }).select("_id");
      employeeFilter = { employee: { $in: team.map((t) => t._id) } };
    }
    // Admin: all approved logs (org-level)

    const logs = await WorkLog.find({
      status: "Approved",
      ...(employeeFilter || {})
    }).select("approvedScore periodMonth periodYear");

    const map = new Map(keys.map((k) => [k, { sum: 0, count: 0 }]));
    for (const r of logs) {
      const k = `${r.periodYear}-${String(r.periodMonth).padStart(2, "0")}`;
      if (!map.has(k)) continue;
      const obj = map.get(k);
      obj.sum += Number(r.approvedScore || 0);
      obj.count += 1;
      map.set(k, obj);
    }

    const series = keys.map((k) => {
      const v = map.get(k);
      return v.count ? Math.round(v.sum / v.count) : 0;
    });

    const scope =
      actor.role === "Admin" ? "Organization" : actor.role === "Supervisor" ? "Team" : "Individual";

    return res.json({ scope, labels, series });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}