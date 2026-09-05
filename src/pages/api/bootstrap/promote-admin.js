import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { key, email, password, name, employeeId } = req.body || {};
    if (!key || key !== process.env.ADMIN_BOOTSTRAP_KEY) {
      return res.status(403).json({ message: "Invalid bootstrap key" });
    }
    if (!email) return res.status(400).json({ message: "email required" });

    await dbConnect();

    const normalizedEmail = String(email).toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      if (!password) return res.status(400).json({ message: "password required to create new admin" });

      const passwordHash = await bcrypt.hash(String(password), 10);
      user = await User.create({
        employeeId: String(employeeId || "ADM001").trim(),
        name: String(name || "System Admin").trim(),
        email: normalizedEmail,
        passwordHash,
        role: "Admin",
        status: "Active"
      });
    } else {
      user.role = "Admin";
      user.status = "Active";
      if (name) user.name = String(name).trim();
      if (employeeId) user.employeeId = String(employeeId).trim();
      if (password) user.passwordHash = await bcrypt.hash(String(password), 10);
      await user.save();
    }

    return res.json({ ok: true, admin: { email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
}
