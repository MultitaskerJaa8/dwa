import { useEffect, useMemo, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import BarChart from "@/components/BarChart";

export default function Reports() {
  const { user } = useAuth();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [team, setTeam] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    const data = await api(`/api/reports/individual?month=${month}&year=${year}`);
    setReport(data);

    if (user?.role === "Supervisor" || user?.role === "Admin") {
      const t = await api(`/api/reports/team?month=${month}&year=${year}`);
      setTeam(t);
    } else {
      setTeam(null);
    }
  }

  useEffect(() => {
    if (!user) return;
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const teamLabels = useMemo(() => (team?.rows || []).map((r) => r.employeeId), [team]);
  const teamScores = useMemo(() => (team?.rows || []).map((r) => r.finalScore), [team]);

  return (
    <Protected>
      <Layout>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Performance Reports</h1>
            <p className="text-sm muted mt-1">Individual reports + exports (CSV/PDF). Supervisors/Admins can view team performance.</p>
          </div>

          <div className="flex items-center gap-2">
            <input className="input w-[90px]" type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} />
            <input className="input w-[110px]" type="number" min="2020" max="2100" value={year} onChange={(e) => setYear(e.target.value)} />
            <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>Load</button>
          </div>
        </div>

        {err ? <div className="mt-3 text-sm text-red-600 font-semibold">{err}</div> : null}

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          <StatCard label="Final Score" value={`${report?.summary?.finalScore || 0}/100`} hint="Weighted KPI score (Approved only)" />
          <StatCard label="Submissions" value={report?.summary?.submissions || 0} hint="Approved + Rejected rows" />
          <StatCard label="Total Weight" value={`${report?.summary?.totalWeight || 0}%`} hint="Based on submitted KPIs" />
        </div>

        <div className="card mt-4">
          <div className="card-hd flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="font-extrabold tracking-tight text-slate-900">Exports</div>
              <div className="text-xs muted mt-1">Download audit-ready reports for the selected period.</div>
            </div>
            <div className="flex gap-2">
              <a className="btn btn-primary" href={`/api/reports/export?type=csv&month=${month}&year=${year}`}>Download CSV</a>
              <a className="btn btn-ghost" href={`/api/reports/export?type=pdf&month=${month}&year=${year}`}>Download PDF</a>
            </div>
          </div>

          <div className="card-bd overflow-x-auto">
            <div className="font-bold text-slate-900 mb-3">Detailed Rows</div>
            <table className="table min-w-[900px]">
              <thead>
                <tr>
                  <th>KPI</th>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {(report?.rows || []).map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div className="font-semibold text-slate-900">{r.kpi?.title}</div>
                      <div className="text-xs muted2">{r.kpi?.weightage}% weight</div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900">{r.taskTitle}</div>
                      <div className="text-xs muted">{r.taskDetails}</div>
                    </td>
                    <td>
                      <span className={`badge ${r.status === "Approved" ? "badge-ok" : r.status === "Rejected" ? "badge-bad" : "badge-warn"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="font-bold">{r.approvedScore}</td>
                    <td className="muted">{r.supervisorRemarks || "—"}</td>
                  </tr>
                ))}

                {!report?.rows?.length && (
                  <tr>
                    <td colSpan="5" className="py-10 text-center muted">
                      No rows for selected period. (Try seeding or submit work logs first.)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {(user?.role === "Supervisor" || user?.role === "Admin") && (
          <div className="grid lg:grid-cols-2 gap-3 mt-4">
            <BarChart title="Team Performance Leaderboard" labels={teamLabels} data={teamScores} />

            <div className="card">
              <div className="card-hd">
                <div className="font-extrabold tracking-tight text-slate-900">Team Summary</div>
                <div className="text-xs muted mt-1">Top 15 employees for selected period</div>
              </div>

              <div className="card-bd overflow-x-auto">
                <table className="table min-w-[520px]">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>KPI Count</th>
                      <th>Final Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(team?.rows || []).map((r) => (
                      <tr key={r.userId}>
                        <td>
                          <div className="font-semibold text-slate-900">{r.name}</div>
                          <div className="text-xs muted2">{r.employeeId}</div>
                        </td>
                        <td className="font-semibold">{r.kpiCount}</td>
                        <td className="font-black">{r.finalScore}/100</td>
                      </tr>
                    ))}
                    {!team?.rows?.length && (
                      <tr>
                        <td colSpan="3" className="py-10 text-center muted">
                          No approved team data found for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </Protected>
  );
}