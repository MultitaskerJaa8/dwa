import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { required, isEmail } from "@/lib/validators";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { key, employeeId, name, email, password } = req.body || {};
    required(key, "key");
    if (key !== process.env.ADMIN_BOOTSTRAP_KEY) return res.status(403).json({ message: "Invalid bootstrap key" });

    required(employeeId, "employeeId");
    required(name, "name");
    required(email, "email");
    required(password, "password");
    if (!isEmail(email)) return res.status(400).json({ message: "Invalid email" });

    await dbConnect();

    const anyAdmin = await User.findOne({ role: "Admin" });
    if (anyAdmin) return res.status(409).json({ message: "Admin already exists" });

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(String(password), 10);

    const admin = await User.create({
      employeeId: String(employeeId).trim(),
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: "Admin",
      status: "Active"
    });

    return res.status(201).json({ ok: true, admin: { id: admin._id, email: admin.email } });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}