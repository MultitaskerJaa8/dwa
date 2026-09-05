import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { required } from "@/lib/validators";
import { signToken, setAuthCookie } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { email, password } = req.body || {};
    required(email, "email");
    required(password, "password");

    await dbConnect();

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).populate("department");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status !== "Active") return res.status(403).json({ message: "Account inactive" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ sub: user._id.toString(), role: user.role });
    setAuthCookie(res, token);

    await writeAudit({
      actorId: user._id,
      action: "AUTH_LOGIN",
      entityType: "User",
      entityId: user._id.toString(),
      meta: { email: user.email },
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      ua: req.headers["user-agent"]
    });

    return res.json({
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department ? { id: user.department._id, name: user.department.name, code: user.department.code } : null,
        designation: user.designation || ""
      }
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}