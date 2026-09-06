import { useState } from "react";

export default function ApprovalTable({ rows, onReview }) {
  const [busyId, setBusyId] = useState(null);

  async function act(id, payload) {
    try {
      setBusyId(id);
      await onReview(id, payload);
    } finally {
      setBusyId(null);
    }
  }

  // Mobile / small screens: card list
  return (
    <div className="space-y-3">
      {!rows.length ? (
        <div className="card">
          <div className="card-bd text-center muted">No pending approvals.</div>
        </div>
      ) : null}

      {/* Mobile cards */}
      <div className="grid gap-3 lg:hidden">
        {rows.map((r) => (
          <div key={r._id} className="card">
            <div className="card-bd space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs muted2 uppercase font-semibold tracking-wider">Employee</div>
                  <div className="font-bold text-slate-900">{r.employee?.name}</div>
                  <div className="text-xs muted2">{r.employee?.employeeId}</div>
                </div>
                <span className="badge badge-warn">Pending</span>
              </div>

              <div>
                <div className="text-xs muted2 uppercase font-semibold tracking-wider">KPI</div>
                <div className="font-semibold text-slate-900">{r.kpi?.title}</div>
                <div className="text-xs muted2">Weightage: {r.kpi?.weightage}% • {r.periodMonth}/{r.periodYear}</div>
              </div>

              <div>
                <div className="text-xs muted2 uppercase font-semibold tracking-wider">Task</div>
                <div className="font-semibold text-slate-900">{r.taskTitle}</div>
                <div className="text-sm muted mt-1">{r.taskDetails}</div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="text-sm">
                  {r.evidenceUrl ? (
                    <a className="text-blue-700 font-semibold underline" href={r.evidenceUrl} target="_blank" rel="noreferrer">
                      View Evidence
                    </a>
                  ) : (
                    <span className="muted">No evidence</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-primary"
                    disabled={busyId === r._id}
                    onClick={async () => {
                      const score = prompt("Approved score (0-100):", "80");
                      if (score === null) return;
                      const remarks = prompt("Remarks (optional):", "Verified");
                      await act(r._id, { decision: "Approved", approvedScore: Number(score), remarks });
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-ghost"
                    disabled={busyId === r._id}
                    onClick={async () => {
                      const remarks = prompt("Rejection remarks:", "Insufficient evidence");
                      if (remarks === null) return;
                      await act(r._id, { decision: "Rejected", approvedScore: 0, remarks });
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="card hidden lg:block">
        <div className="card-bd overflow-x-auto">
          <table className="table min-w-[1000px]">
            <thead>
              <tr>
                <th>Employee</th>
                <th>KPI</th>
                <th>Task</th>
                <th>Period</th>
                <th>Evidence</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="font-semibold text-slate-900">{r.employee?.name}</div>
                    <div className="text-xs muted2">{r.employee?.employeeId}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900">{r.kpi?.title}</div>
                    <div className="text-xs muted2">{r.kpi?.weightage}%</div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900">{r.taskTitle}</div>
                    <div className="text-xs muted">{r.taskDetails}</div>
                  </td>
                  <td className="font-semibold">{r.periodMonth}/{r.periodYear}</td>
                  <td>
                    {r.evidenceUrl ? (
                      <a className="text-blue-700 font-semibold underline" href={r.evidenceUrl} target="_blank" rel="noreferrer">Open</a>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-primary"
                        disabled={busyId === r._id}
                        onClick={async () => {
                          const score = prompt("Approved score (0-100):", "80");
                          if (score === null) return;
                          const remarks = prompt("Remarks (optional):", "Verified");
                          await act(r._id, { decision: "Approved", approvedScore: Number(score), remarks });
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-ghost"
                        disabled={busyId === r._id}
                        onClick={async () => {
                          const remarks = prompt("Rejection remarks:", "Insufficient evidence");
                          if (remarks === null) return;
                          await act(r._id, { decision: "Rejected", approvedScore: 0, remarks });
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!rows.length ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center muted">No pending approvals.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
