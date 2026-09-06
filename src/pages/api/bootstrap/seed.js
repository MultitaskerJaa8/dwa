import dbConnect from "@/lib/db";
import { seedDemo } from "@/lib/seed";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { key, resetPasswords = true } = req.body || {};
    if (!key || key !== process.env.ADMIN_BOOTSTRAP_KEY) {
      return res.status(403).json({ message: "Invalid seed key" });
    }

    await dbConnect();
    const result = await seedDemo({ resetPasswords: !!resetPasswords });

    return res.status(200).json({ ok: true, result });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Server error" });
  }
}