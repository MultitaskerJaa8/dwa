import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import PerformanceChart from "@/components/PerformanceChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

function Badge({ status }) {
  const cls =
    status === "Approved" ? "badge badge-ok" :
    status === "Rejected" ? "badge badge-bad" :
    "badge badge-warn";
  return <span className={cls}>{status}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [activity, setActivity] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    const [s, t, a] = await Promise.all([
      api("/api/dashboard/summary"),
      api("/api/dashboard/trend"),
      api("/api/dashboard/activity")
    ]);
    setSummary(s);
    setTrend(t);
    setActivity(a);
  }

  useEffect(() => {
    if (!user) return;
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const cards = useMemo(() => summary?.cards || [], [summary]);

  const governance = useMemo(() => {
    if (!user) return [];
    if (user.role === "Employee") {
      return [
        { title: "Evidence-first submissions", desc: "Work log me evidence URL zaroor add karein (Drive/Portal link) for audit." },
        { title: "Write measurable outcomes", desc: "Counts/SLA/turnaround time mention karein to scoring objective hota hai." },
        { title: "Track status in real-time", desc: "Pending/Approved/Rejected status se transparency improve hoti hai." }
      ];
    }
    if (user.role === "Supervisor") {
      return [
        { title: "Approvals within cycle", desc: "Monthly cycle close hone se pehle pending approvals clear karein." },
        { title: "Remarks = audit trail", desc: "Approve/Reject ke sath clear remarks add karein for compliance." },
        { title: "Consistent scoring", desc: "Same KPI across team ko consistent scoring criteria se evaluate karein." }
      ];
    }
    return [
      { title: "Standardize KPI catalog", desc: "Departments ke liye KPI titles + weightage + targets consistent rakhein." },
      { title: "Role governance", desc: "RBAC enforce: Admin manages setup, Supervisor approves, Employee submits." },
      { title: "Audit-ready reporting", desc: "Reports export (CSV/PDF) appraisal & audit documentation me use hota hai." }
    ];
  }, [user]);

  return (
    <Protected>
      <Layout>
        <PageHeader
          title="Executive Dashboard"
          description="Live KPIs, approvals, analytics and governance notes with role-based visibility."
          right={
            <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>
              Refresh
            </button>
          }
        />

        {err ? <div className="mt-3 text-sm text-red-600 font-semibold">{err}</div> : null}
        {!summary || !trend || !activity ? <LoadingSpinner label="Loading dashboard..." /> : null}

        {/* Top stats */}
        {summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
            {cards.map((c, idx) => (
              <StatCard key={idx} label={c.label} value={c.value} hint={c.hint} />
            ))}
          </div>
        ) : null}

        {/* Charts + Governance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
          <div>
            <PerformanceChart labels={trend?.labels || []} data={trend?.series || []} />
            <div className="mt-3 text-xs muted">
              Scope: <b className="text-slate-900">{trend?.scope || user?.role}</b>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="card-hd">
              <div className="font-extrabold tracking-tight text-slate-900">Governance Notes</div>
              <div className="text-xs muted mt-1">
                Practical guidelines for transparency, compliance and consistent evaluation.
              </div>
            </div>

            <div className="card-bd space-y-3">
              {governance.map((g, i) => (
                <div key={i} className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                  <div className="font-bold text-slate-900">{g.title}</div>
                  <div className="text-sm muted mt-1 leading-relaxed">{g.desc}</div>
                </div>
              ))}

              <div className="rounded-2xl border bg-slate-50 p-4" style={{ borderColor: "var(--border)" }}>
                <div className="text-sm font-bold text-slate-900">Quick Actions</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link className="btn btn-primary" href="/dashboard/reports">View Reports</Link>
                  {user?.role === "Employee" ? (
                    <Link className="btn btn-ghost" href="/dashboard/work-submission">Submit Work Log</Link>
                  ) : (
                    <Link className="btn btn-ghost" href="/dashboard/approvals">Open Approvals</Link>
                  )}
                  <Link className="btn btn-ghost" href="/dashboard/profile">Profile</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity / Pending */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
          {/* Left: Activity */}
          <div className="card overflow-hidden">
            <div className="card-hd">
              <div className="font-extrabold tracking-tight text-slate-900">Recent Activity</div>
              <div className="text-xs muted mt-1">
                {activity?.type === "employee"
                  ? "Your latest submissions"
                  : activity?.type === "supervisor"
                  ? "Team pending approvals (preview)"
                  : "System overview (preview)"}
              </div>
            </div>

            <div className="card-bd space-y-3">
              {activity?.type === "employee" ? (
                (activity.recentSubmissions?.length ? activity.recentSubmissions : []).map((l) => (
                  <div key={l._id} className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">{l.taskTitle}</div>
                        <div className="text-xs muted2 mt-1">
                          {l.kpi?.title || "KPI"} • {l.periodMonth}/{l.periodYear}
                        </div>
                      </div>
                      <Badge status={l.status} />
                    </div>
                    <div className="text-xs muted mt-2">
                      Score: <b className="text-slate-900">{l.approvedScore || 0}</b>
                      {l.evidenceUrl ? (
                        <>
                          {" "}•{" "}
                          <a className="text-blue-700 font-semibold underline" href={l.evidenceUrl} target="_blank" rel="noreferrer">
                            Evidence
                          </a>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : null}

              {(activity?.type === "supervisor" || activity?.type === "admin") ? (
                (activity.pendingApprovals?.length ? activity.pendingApprovals : []).map((p) => (
                  <div key={p._id} className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">{p.employee?.name}</div>
                        <div className="text-xs muted2">{p.employee?.employeeId} • {p.periodMonth}/{p.periodYear}</div>
                        <div className="text-sm muted mt-2">
                          <b className="text-slate-900">{p.kpi?.title}</b> — {p.taskTitle}
                        </div>
                      </div>
                      <Badge status={p.status} />
                    </div>

                    {p.evidenceUrl ? (
                      <div className="mt-2">
                        <a className="text-sm text-blue-700 font-semibold underline" href={p.evidenceUrl} target="_blank" rel="noreferrer">
                          View Evidence
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : null}

              {/* Empty states */}
              {activity?.type === "employee" && !activity?.recentSubmissions?.length ? (
                <EmptyState title="No submissions yet" description="Submit your first work log to generate analytics and reports." />
              ) : null}

              {(activity?.type === "supervisor" || activity?.type === "admin") && !activity?.pendingApprovals?.length ? (
                <EmptyState title="No pending approvals" description="All submissions are reviewed. Good governance compliance." />
              ) : null}
            </div>
          </div>

          {/* Right: Admin-specific quick list */}
          <div className="card overflow-hidden">
            <div className="card-hd">
              <div className="font-extrabold tracking-tight text-slate-900">
                {activity?.type === "admin" ? "Recent Registrations" : "Operational Snapshot"}
              </div>
              <div className="text-xs muted mt-1">
                {activity?.type === "admin"
                  ? "Latest users created in the system"
                  : "Use Approvals and Reports modules for detailed actions"}
              </div>
            </div>

            <div className="card-bd space-y-3">
              {activity?.type === "admin" ? (
                activity.recentUsers?.length ? (
                  activity.recentUsers.map((u) => (
                    <div key={u._id} className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-xs muted2">{u.employeeId} • {u.email}</div>
                        </div>
                        <span className="badge">{u.role}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState title="No recent users" description="Create users using Register or seed data." />
                )
              ) : (
                <div className="rounded-2xl border bg-slate-50 p-4" style={{ borderColor: "var(--border)" }}>
                  <div className="font-bold text-slate-900">Recommended Next Step</div>
                  <div className="text-sm muted mt-2 leading-relaxed">
                    • Employee: submit work log → wait for approval → download report<br />
                    • Supervisor: review pending approvals → ensure remarks & consistent scoring<br />
                    • Admin: configure departments & KPIs → map users → monitor reports
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}
