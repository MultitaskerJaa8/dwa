import PDFDocument from "pdfkit";
import dbConnect from "@/lib/db";
import WorkLog from "@/models/WorkLog";
import User from "@/models/User";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

function toCSV(rows) {
  const header = ["KPI", "TaskTitle", "Status", "ApprovedScore", "Month", "Year", "EvidenceUrl"];
  const lines = [header.join(",")];

  for (const r of rows) {
    const kpi = (r.kpi?.title || "").replaceAll(",", " ");
    const task = (r.taskTitle || "").replaceAll(",", " ");
    const status = r.status || "";
    const score = r.approvedScore || 0;
    const ev = (r.evidenceUrl || "").replaceAll(",", " ");
    lines.push([kpi, task, status, score, r.periodMonth, r.periodYear, ev].join(","));
  }
  return lines.join("\n");
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token);

    const actor = await User.findById(decoded.sub);
    if (!actor) return res.status(401).json({ message: "Unauthorized" });

    const month = Number(req.query.month || new Date().getMonth() + 1);
    const year = Number(req.query.year || new Date().getFullYear());
    const type = String(req.query.type || "csv").toLowerCase();

    const rows = await WorkLog.find({ employee: actor._id, periodMonth: month, periodYear: year })
      .populate("kpi")
      .sort({ createdAt: -1 });

    if (type === "csv") {
      const csv = toCSV(rows);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="report_${month}_${year}.csv"`);
      return res.status(200).send(csv);
    }

    if (type === "pdf") {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];

      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="report_${month}_${year}.pdf"`);
        res.status(200).send(pdfBuffer);
      });

      doc.fontSize(18).text("Digital Workforce Performance Report", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Employee: ${actor.name} (${actor.employeeId})`);
      doc.text(`Period: ${month}/${year}`);
      doc.moveDown(1);

      rows.forEach((r, idx) => {
        doc.fontSize(12).text(`${idx + 1}. KPI: ${r.kpi?.title || "-"}`);
        doc.fontSize(10).fillColor("#444").text(`Task: ${r.taskTitle}`);
        doc.text(`Status: ${r.status} | Score: ${r.approvedScore}`);
        doc.text(`Evidence: ${r.evidenceUrl || "-"}`);
        doc.fillColor("#000").moveDown(0.8);
      });

      doc.end();
      return;
    }

    return res.status(400).json({ message: "type must be csv or pdf" });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}