import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { isEmail, required } from "@/lib/validators";
import { signToken, setAuthCookie } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    if (process.env.ALLOW_PUBLIC_REGISTER !== "true") {
      return res.status(403).json({ message: "Public register disabled" });
    }

    const { employeeId, name, email, password } = req.body || {};
    required(employeeId, "employeeId");
    required(name, "name");
    required(email, "email");
    required(password, "password");
    if (!isEmail(email)) return res.status(400).json({ message: "Invalid email" });
    if (String(password).length < 6) return res.status(400).json({ message: "Password min 6 chars" });

    await dbConnect();

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      employeeId: String(employeeId).trim(),
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: "Employee",
      status: "Active"
    });

    const token = signToken({ sub: user._id.toString(), role: user.role });
    setAuthCookie(res, token);

    await writeAudit({
      actorId: user._id,
      action: "AUTH_REGISTER",
      entityType: "User",
      entityId: user._id.toString(),
      meta: { email: user.email },
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      ua: req.headers["user-agent"]
    });

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}