import dbConnect from "@/lib/db";
import WorkLog from "@/models/WorkLog";
import User from "@/models/User";
import KPI from "@/models/KPI";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

function computeScore(rows) {
  let totalWeight = 0;
  let weighted = 0;

  for (const r of rows) {
    const w = Number(r.kpi?.weightage || 0);
    totalWeight += w;
    weighted += (w * Number(r.approvedScore || 0)) / 100;
  }

  const finalScore = totalWeight ? Math.round((weighted / totalWeight) * 100) : 0;
  return { totalWeight, finalScore };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub).populate("department");
    if (!actor) return res.status(401).json({ message: "Unauthorized" });

    const month = Number(req.query.month || new Date().getMonth() + 1);
    const year = Number(req.query.year || new Date().getFullYear());

    const rows = await WorkLog.find({
      employee: actor._id,
      periodMonth: month,
      periodYear: year,
      status: { $in: ["Approved", "Rejected"] }
    })
      .populate("kpi")
      .sort({ createdAt: -1 });

    // ensure kpi populated properly for score
    const populated = await KPI.populate(rows, { path: "kpi" });

    const { totalWeight, finalScore } = computeScore(populated);

    return res.json({
      period: { month, year },
      summary: { finalScore, totalWeight, submissions: rows.length },
      rows: populated
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}