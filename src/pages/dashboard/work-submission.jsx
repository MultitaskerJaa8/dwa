import { useEffect, useMemo, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import WorkLogForm from "@/components/WorkLogForm";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

function StatusBadge({ status }) {
  const cls =
    status === "Approved" ? "badge badge-ok" :
    status === "Rejected" ? "badge badge-bad" :
    "badge badge-warn";
  return <span className={cls}>{status}</span>;
}

export default function WorkSubmission() {
  const { user } = useAuth();

  const [kpis, setKpis] = useState([]);
  const [myLogs, setMyLogs] = useState([]);
  const [pending, setPending] = useState([]);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const isEmployee = user?.role === "Employee";
  const isSupervisorOrAdmin = user?.role === "Supervisor" || user?.role === "Admin";

  async function load() {
    setErr("");
    setMsg("");

    const reqs = [api("/api/worklogs")]; // my logs always ok
    if (isEmployee) reqs.unshift(api("/api/kpis"));
    if (isSupervisorOrAdmin) reqs.push(api("/api/worklogs/pending"));

    const results = await Promise.all(reqs);

    if (isEmployee) {
      setKpis(results[0]?.kpis || []);
      setMyLogs(results[1]?.logs || []);
      if (isSupervisorOrAdmin) setPending(results[2]?.pending || []);
    } else {
      // not employee
      setMyLogs(results[0]?.logs || []);
      if (isSupervisorOrAdmin) setPending(results[1]?.pending || []);
    }
  }

  useEffect(() => {
    if (!user) return;
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const latestMy = useMemo(() => (myLogs || []).slice(0, 8), [myLogs]);
  const latestPending = useMemo(() => (pending || []).slice(0, 8), [pending]);

  return (
    <Protected>
      <Layout>
        <PageHeader
          title="Work Management"
          description="Submit KPI work logs with evidence and track approval status in real time."
          right={
            <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>
              Refresh
            </button>
          }
        />

        {err ? <div className="mt-3 text-sm text-red-600 font-semibold">{err}</div> : null}
        {msg ? <div className="mt-3 text-sm text-green-700 font-semibold">{msg}</div> : null}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
          {/* LEFT */}
          <div className="space-y-3">
            {isEmployee ? (
              kpis.length ? (
                <WorkLogForm
                  kpis={kpis}
                  busy={busy}
                  onSubmit={async (payload) => {
                    try {
                      setBusy(true);
                      await api("/api/worklogs", { method: "POST", body: JSON.stringify(payload) });
                      setMsg("Submitted successfully. Status: Pending approval.");
                      await load();
                    } catch (e) {
                      setErr(e.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
              ) : (
                <EmptyState
                  title="No KPIs available"
                  description="Department KPIs configured nahi hain ya department assign nahi hua. Admin se request karein."
                />
              )
            ) : (
              <div className="card">
                <div className="card-hd">
                  <div className="font-extrabold tracking-tight text-slate-900">Note</div>
                  <div className="text-xs muted mt-1">Work submission is primarily for Employees.</div>
                </div>
                <div className="card-bd text-sm muted leading-relaxed">
                  Aap <b>{user?.role}</b> role me logged-in hain. Is page par aapko:
                  <br />• Pending approvals quick view milega
                  <br />• Reports module se department/team performance export milta hai
                </div>
              </div>
            )}

            {/* My submissions (all roles can see their own logs) */}
            <div className="card overflow-hidden">
              <div className="card-hd">
                <div className="font-extrabold tracking-tight text-slate-900">My Submissions</div>
                <div className="text-xs muted mt-1">Latest submissions created by your account.</div>
              </div>

              <div className="card-bd space-y-3">
                {!latestMy.length ? (
                  <div className="text-sm muted">No submissions yet.</div>
                ) : null}

                {latestMy.map((l) => (
                  <div key={l._id} className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">{l.taskTitle}</div>
                        <div className="text-xs muted2 mt-1">
                          {l.kpi?.title || "KPI"} • {l.periodMonth}/{l.periodYear}
                        </div>
                      </div>
                      <StatusBadge status={l.status} />
                    </div>

                    <div className="text-sm muted mt-2">{l.taskDetails}</div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-xs muted2">
                        Score: <span className="font-bold text-slate-900">{l.approvedScore || 0}</span>
                      </div>

                      {l.evidenceUrl ? (
                        <a className="text-sm text-blue-700 font-semibold underline" href={l.evidenceUrl} target="_blank" rel="noreferrer">
                          Evidence
                        </a>
                      ) : (
                        <span className="text-xs muted2">No evidence</span>
                      )}
                    </div>

                    {l.supervisorRemarks ? (
                      <div className="mt-2 text-xs muted">
                        <span className="font-semibold">Remarks:</span> {l.supervisorRemarks}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            {(isSupervisorOrAdmin) ? (
              <div className="card overflow-hidden">
                <div className="card-hd">
                  <div className="font-extrabold tracking-tight text-slate-900">Pending Approvals</div>
                  <div className="text-xs muted mt-1">
                    Quick view of pending submissions requiring review.
                  </div>
                </div>
                <div className="card-bd space-y-3">
                  {!latestPending.length ? (
                    <div className="text-sm muted">No pending approvals.</div>
                  ) : null}

                  {latestPending.map((p) => (
                    <div key={p._id} className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900">{p.employee?.name}</div>
                          <div className="text-xs muted2">{p.employee?.employeeId} • {p.periodMonth}/{p.periodYear}</div>
                          <div className="text-sm muted mt-2">
                            <span className="font-semibold text-slate-900">{p.kpi?.title}</span>
                            {" — "}
                            {p.taskTitle}
                          </div>
                        </div>
                        <StatusBadge status={p.status} />
                      </div>

                      {p.evidenceUrl ? (
                        <div className="mt-2">
                          <a className="text-sm text-blue-700 font-semibold underline" href={p.evidenceUrl} target="_blank" rel="noreferrer">
                            View Evidence
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ))}

                  <div className="text-xs muted2">
                    Full action ke liye: <b>Approvals</b> page open karein (Approve/Reject + score).
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                title="Supervisor approvals view"
                description="Agar aap Supervisor/Admin login karenge to yahan pending approvals dikhengi."
              />
            )}

            <div className="card">
              <div className="card-hd">
                <div className="font-extrabold tracking-tight text-slate-900">Guidelines</div>
                <div className="text-xs muted mt-1">Submission quality improves scoring accuracy.</div>
              </div>
              <div className="card-bd text-sm muted leading-relaxed">
                • Use measurable numbers (count, SLA %, time saved).<br />
                • Mention reference/complaint IDs where applicable.<br />
                • Provide evidence links (Drive/Portal screenshot/report).<br />
                • Keep task details audit-friendly and clear.
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}
