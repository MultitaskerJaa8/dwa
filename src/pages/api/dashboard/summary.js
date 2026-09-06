import dbConnect from "@/lib/db";
import User from "@/models/User";
import Department from "@/models/Department";
import KPI from "@/models/KPI";
import WorkLog from "@/models/WorkLog";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub).populate("department");
    if (!actor) return res.status(401).json({ message: "Unauthorized" });

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    if (actor.role === "Admin") {
      const [users, departments, kpis, pending] = await Promise.all([
        User.countDocuments({}),
        Department.countDocuments({}),
        KPI.countDocuments({}),
        WorkLog.countDocuments({ status: "Pending" })
      ]);

      return res.json({
        role: "Admin",
        cards: [
          { label: "Total Users", value: String(users), hint: "All roles" },
          { label: "Departments", value: String(departments), hint: "Configured units" },
          { label: "KPIs", value: String(kpis), hint: "Active catalog" },
          { label: "Pending Approvals", value: String(pending), hint: "Across system" }
        ]
      });
    }

    if (actor.role === "Supervisor") {
      const team = await User.find({ managerId: actor._id }).select("_id");
      const teamIds = team.map((t) => t._id);

      const [pending, approvedThisMonth] = await Promise.all([
        WorkLog.countDocuments({ status: "Pending", employee: { $in: teamIds } }),
        WorkLog.countDocuments({
          status: "Approved",
          employee: { $in: teamIds },
          periodMonth: month,
          periodYear: year
        })
      ]);

      return res.json({
        role: "Supervisor",
        cards: [
          { label: "Team Size", value: String(teamIds.length), hint: "Direct reports" },
          { label: "Pending Approvals", value: String(pending), hint: "Needs review" },
          { label: "Approved (This Month)", value: String(approvedThisMonth), hint: `${month}/${year}` }
        ]
      });
    }

    const deptId = actor.department?._id || null;

    const [deptKpis, myPending, myApproved] = await Promise.all([
      deptId ? KPI.countDocuments({ department: deptId, isActive: true }) : 0,
      WorkLog.countDocuments({ employee: actor._id, status: "Pending" }),
      WorkLog.countDocuments({ employee: actor._id, status: "Approved", periodMonth: month, periodYear: year })
    ]);

    return res.json({
      role: "Employee",
      cards: [
        { label: "Department KPIs", value: String(deptKpis), hint: deptId ? "Assigned to your dept" : "Department not assigned" },
        { label: "My Pending", value: String(myPending), hint: "Awaiting approval" },
        { label: "Approved (This Month)", value: String(myApproved), hint: `${month}/${year}` }
      ]
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}