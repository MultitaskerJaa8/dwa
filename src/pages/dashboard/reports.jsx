import { useEffect, useMemo, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { api } from "@/lib/apiClient";

export default function Reports() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [err, setErr] = useState("");

  const rows = report?.rows || [];
  const labels = useMemo(() => rows.map((r, idx) => `#${idx + 1}`), [rows]);
  const scores = useMemo(() => rows.map((r) => r.approvedScore || 0), [rows]);

  async function load() {
    setErr("");
    const data = await api(`/api/reports/individual?month=${month}&year=${year}`);
    setReport(data);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Protected>
      <Layout>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black">Performance Reports</h1>
            <p className="text-white/60 text-sm mt-1">Download CSV/PDF for appraisal & audit.</p>
          </div>

          <div className="flex items-center gap-2">
            <input className="input w-[90px]" type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} />
            <input className="input w-[110px]" type="number" min="2020" max="2100" value={year} onChange={(e) => setYear(e.target.value)} />
            <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>Load</button>
          </div>
        </div>

        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          <StatCard label="Final Score" value={`${report?.summary?.finalScore || 0}/100`} hint="Weighted KPI score" />
          <StatCard label="Submissions" value={report?.summary?.submissions || 0} />
          <StatCard label="Total Weight" value={`${report?.summary?.totalWeight || 0}%`} />
        </div>

        <div className="card mt-4 flex flex-col sm:flex-row gap-2">
          <a className="btn btn-primary" href={`/api/reports/export?type=csv&month=${month}&year=${year}`}>Download CSV</a>
          <a className="btn btn-ghost" href={`/api/reports/export?type=pdf&month=${month}&year=${year}`}>Download PDF</a>
        </div>

        <div className="card mt-4 overflow-x-auto">
          <div className="font-bold mb-3">Detailed Rows</div>
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-white/70">
                <th className="text-left py-2">KPI</th>
                <th className="text-left py-2">Task</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Score</th>
                <th className="text-left py-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-t border-white/10">
                  <td className="py-3">
                    <div className="font-semibold">{r.kpi?.title}</div>
                    <div className="text-xs text-white/50">{r.kpi?.weightage}%</div>
                  </td>
                  <td className="py-3">
                    <div className="font-semibold">{r.taskTitle}</div>
                    <div className="text-xs text-white/60">{r.taskDetails}</div>
                  </td>
                  <td className="py-3">{r.status}</td>
                  <td className="py-3">{r.approvedScore}</td>
                  <td className="py-3 text-white/70">{r.supervisorRemarks || "—"}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan="5" className="py-6 text-center text-white/60">No rows for selected period.</td></tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 text-xs text-white/50">
            Tip: Approvals ke baad “Approved” rows performance score me count hote hain.
          </div>
        </div>
      </Layout>
    </Protected>
  );
}