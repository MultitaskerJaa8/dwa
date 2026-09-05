import { clearAuthCookie } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  clearAuthCookie(res);
  return res.json({ ok: true });
}