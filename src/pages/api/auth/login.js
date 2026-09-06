import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { required } from "@/lib/validators";
import { signToken, setAuthCookie } from "@/lib/auth";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { email, password } = body;

    required(email, "email");
    required(password, "password");

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing in environment" });
    }

    await dbConnect();

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).populate("department");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status !== "Active") return res.status(403).json({ message: "Account inactive" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ sub: user._id.toString(), role: user.role });
    setAuthCookie(res, token);

    return res.status(200).json({
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
  } catch (e) {
    console.error("AUTH_LOGIN_ERROR:", e);
    return res.status(500).json({ message: e.message || "Server error" });
  }
}
