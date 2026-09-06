import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import PerformanceChart from "@/components/PerformanceChart";
import { api } from "@/lib/apiClient";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    const [s, t] = await Promise.all([
      api("/api/dashboard/summary"),
      api("/api/dashboard/trend")
    ]);
    setSummary(s);
    setTrend(t);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  return (
    <Protected>
      <Layout>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Executive Dashboard</h1>
            <p className="text-white/60 text-sm mt-1">
              Live KPIs, approvals, and audit-ready performance reporting.
            </p>
          </div>
          <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>
            Refresh
          </button>
        </div>

        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
        {!summary ? <LoadingSpinner label="Loading dashboard..." /> : null}

        {summary && (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {(summary.cards || []).map((c, idx) => (
              <StatCard key={idx} label={c.label} value={c.value} hint={c.hint} />
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-3 mt-4">
          <PerformanceChart labels={trend?.labels || []} data={trend?.series || []} />
          <div className="card">
            <div className="font-bold">Governance Notes</div>
            <div className="text-white/70 text-sm mt-2 leading-relaxed">
              • Evidence-backed work logs improve audit compliance.<br />
              • Supervisor approvals create transparent appraisal trails.<br />
              • Download CSV/PDF to attach with appraisal cycle files.
            </div>
            <div className="hr my-4" />
            <div className="text-xs text-white/55">
              Tip: For demo data, run the secure seed endpoint once (Admin only).
            </div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}