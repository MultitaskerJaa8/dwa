import dbConnect from "@/lib/db";

export default async function handler(req, res) {
  try {
    const hasMongo = !!process.env.MONGODB_URI;
    const hasJwt = !!process.env.JWT_SECRET;

    let db = "not-tested";
    if (hasMongo) {
      await dbConnect();
      db = "connected";
    }

    return res.status(200).json({
      ok: true,
      env: { hasMongo, hasJwt, nodeEnv: process.env.NODE_ENV || "unknown" },
      db
    });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      env: {
        hasMongo: !!process.env.MONGODB_URI,
        hasJwt: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV || "unknown"
      },
      error: e.message
    });
  }
}
