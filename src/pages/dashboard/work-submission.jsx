import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import WorkLogForm from "@/components/WorkLogForm";
import { api } from "@/lib/apiClient";

function StatusBadge({ status }) {
  const cls =
    status === "Approved" ? "badge badge-ok" :
    status === "Rejected" ? "badge badge-bad" :
    "badge badge-warn";
  return <span className={cls}>{status}</span>;
}

export default function WorkSubmission() {
  const [kpis, setKpis] = useState([]);
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    const [k, wl] = await Promise.all([api("/api/kpis"), api("/api/worklogs")]);
    setKpis(k.kpis || []);
    setLogs(wl.logs || []);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

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

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_.95fr] gap-3 mt-4">
          <div>
            {kpis.length ? (
              <WorkLogForm
                kpis={kpis}
                busy={busy}
                onSubmit={async (payload) => {
                  setErr("");
                  setMsg("");
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
                description="Aapke department ke liye KPIs configured nahi hain, ya department assign nahi hua. Admin se request karein."
              />
            )}
          </div>

          <div className="card overflow-hidden">
            <div className="card-hd">
              <div className="font-extrabold tracking-tight text-slate-900">Recent Submissions</div>
              <div className="text-xs muted mt-1">Your latest work logs and approval status.</div>
            </div>

            <div className="card-bd space-y-3">
              {!logs.length ? (
                <div className="muted text-sm">No submissions yet. Submit your first work log.</div>
              ) : null}

              {logs.slice(0, 8).map((l) => (
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

                  <div className="text-sm muted mt-2 line-clamp-2">{l.taskDetails}</div>

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
      </Layout>
    </Protected>
  );
}
