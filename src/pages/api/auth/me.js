import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const token = getTokenFromReq(req);
    if (!token) return res.status(200).json({ user: null });

    const decoded = verifyToken(token);
    await dbConnect();

    const user = await User.findById(decoded.sub).populate("department");
    if (!user) return res.status(200).json({ user: null });

    return res.json({
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
          ? { id: user.department._id, name: user.department.name, code: user.department.code }
          : null,
        designation: user.designation || ""
      }
    });
  } catch {
    return res.status(200).json({ user: null });
  }
}