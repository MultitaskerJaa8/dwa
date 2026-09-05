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

    const actor = await User.findById(decoded.sub).populate("department");
    requireRole(actor, ["Supervisor", "Admin"]);

    const month = Number(req.query.month || new Date().getMonth() + 1);
    const year = Number(req.query.year || new Date().getFullYear());

    // filter department:
    // - Supervisor: only their department if present
    // - Admin: can pass departmentId or all
    const departmentId = req.query.departmentId || (actor.role === "Supervisor" ? actor.department?._id?.toString() : null);

    const match = {
      periodMonth: month,
      periodYear: year,
      status: "Approved"
    };

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "employee",
          foreignField: "_id",
          as: "emp"
        }
      },
      { $unwind: "$emp" },
      ...(departmentId ? [{ $match: { "emp.department": { $eq: (await (await import("mongoose")).default).Types.ObjectId.createFromHexString(departmentId) } } }] : []),
      {
        $group: {
          _id: "$emp.department",
          avgScore: { $avg: "$approvedScore" },
          approvedSubmissions: { $sum: 1 }
        }
      }
    ];

    const rows = await WorkLog.aggregate(pipeline);
    return res.json({ period: { month, year }, rows });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}