import { useState } from "react";

export default function ApprovalTable({ rows, onReview }) {
  const [busyId, setBusyId] = useState(null);

  return (
    <div className="card overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm">
        <thead>
          <tr className="text-white/70">
            <th className="text-left py-2">Employee</th>
            <th className="text-left py-2">KPI</th>
            <th className="text-left py-2">Task</th>
            <th className="text-left py-2">Period</th>
            <th className="text-left py-2">Evidence</th>
            <th className="text-left py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-t border-white/10">
              <td className="py-3">
                <div className="font-semibold">{r.employee?.name}</div>
                <div className="text-xs text-white/50">{r.employee?.employeeId}</div>
              </td>
              <td className="py-3">
                <div className="font-semibold">{r.kpi?.title}</div>
                <div className="text-xs text-white/50">{r.kpi?.weightage}%</div>
              </td>
              <td className="py-3">
                <div className="font-semibold">{r.taskTitle}</div>
                <div className="text-xs text-white/60 line-clamp-2">{r.taskDetails}</div>
              </td>
              <td className="py-3">{r.periodMonth}/{r.periodYear}</td>
              <td className="py-3">
                {r.evidenceUrl ? (
                  <a className="underline text-white/80" href={r.evidenceUrl} target="_blank" rel="noreferrer">Open</a>
                ) : (
                  <span className="text-white/40">—</span>
                )}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-ghost"
                    disabled={busyId === r._id}
                    onClick={async () => {
                      const score = prompt("Approved score (0-100):", "80");
                      if (score === null) return;
                      const remarks = prompt("Remarks (optional):", "Verified");
                      try {
                        setBusyId(r._id);
                        await onReview(r._id, { decision: "Approved", approvedScore: Number(score), remarks });
                      } finally {
                        setBusyId(null);
                      }
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
                      try {
                        setBusyId(r._id);
                        await onReview(r._id, { decision: "Rejected", approvedScore: 0, remarks });
                      } finally {
                        setBusyId(null);
                      }
                    }}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {!rows.length && (
            <tr>
              <td colSpan="6" className="py-6 text-center text-white/60">
                No pending approvals.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}