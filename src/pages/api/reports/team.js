import dbConnect from "@/lib/db";
import User from "@/models/User";
import WorkLog from "@/models/WorkLog";
import { getTokenFromReq, verifyToken, requireRole } from "@/lib/auth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub);
    requireRole(actor, ["Supervisor", "Admin"]);

    const month = Number(req.query.month || new Date().getMonth() + 1);
    const year = Number(req.query.year || new Date().getFullYear());

    // Scope: supervisor -> only team, admin -> all employees
    let employeeIds = null;
    if (actor.role === "Supervisor") {
      const team = await User.find({ managerId: actor._id }).select("_id");
      employeeIds = team.map((t) => t._id);
    }

    const match = {
      status: "Approved",
      periodMonth: month,
      periodYear: year,
      ...(employeeIds ? { employee: { $in: employeeIds } } : {})
    };

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "kpis",
          localField: "kpi",
          foreignField: "_id",
          as: "k"
        }
      },
      { $unwind: "$k" },

      // KPI-level average per employee for the period
      {
        $group: {
          _id: { employee: "$employee", kpi: "$kpi" },
          avgScore: { $avg: "$approvedScore" },
          weightage: { $first: "$k.weightage" }
        }
      },

      // weighted score per employee
      {
        $group: {
          _id: "$_id.employee",
          sumWeight: { $sum: "$weightage" },
          weighted: { $sum: { $multiply: ["$weightage", "$avgScore"] } },
          kpiCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          finalScore: {
            $cond: [
              { $gt: ["$sumWeight", 0] },
              { $round: [{ $divide: ["$weighted", "$sumWeight"] }, 0] },
              0
            ]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "u"
        }
      },
      { $unwind: "$u" },
      {
        $project: {
          _id: 0,
          userId: "$u._id",
          name: "$u.name",
          employeeId: "$u.employeeId",
          finalScore: 1,
          kpiCount: 1
        }
      },
      { $sort: { finalScore: -1 } },
      { $limit: 15 }
    ];

    const rows = await WorkLog.aggregate(pipeline);
    return res.json({ period: { month, year }, rows });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}