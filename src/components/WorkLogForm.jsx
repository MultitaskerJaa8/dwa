import { useState } from "react";

export default function WorkLogForm({ kpis, onSubmit, busy }) {
  const now = new Date();
  const [kpiId, setKpiId] = useState(kpis?.[0]?._id || "");
  const [periodMonth, setPeriodMonth] = useState(now.getMonth() + 1);
  const [periodYear, setPeriodYear] = useState(now.getFullYear());
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  return (
    <form
      className="card space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ kpiId, periodMonth, periodYear, taskTitle, taskDetails, evidenceUrl });
      }}
    >
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <div className="label">KPI</div>
          <select className="input" value={kpiId} onChange={(e) => setKpiId(e.target.value)}>
            {kpis.map((k) => (
              <option key={k._id} value={k._id}>
                {k.title} ({k.weightage}%)
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="label">Month</div>
            <input className="input" type="number" min="1" max="12" value={periodMonth} onChange={(e) => setPeriodMonth(e.target.value)} />
          </div>
          <div>
            <div className="label">Year</div>
            <input className="input" type="number" min="2020" max="2100" value={periodYear} onChange={(e) => setPeriodYear(e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <div className="label">Task Title</div>
        <input className="input" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g., Citizen grievance resolved within SLA" />
      </div>

      <div>
        <div className="label">Task Details</div>
        <textarea className="input min-h-[110px]" value={taskDetails} onChange={(e) => setTaskDetails(e.target.value)} placeholder="Write clear, audit-ready details (what, when, outcome, evidence)..." />
      </div>

      <div>
        <div className="label">Evidence URL (Drive/Portal/Cloud link)</div>
        <input className="input" value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} placeholder="https://..." />
        <div className="text-xs text-white/50 mt-2">
          Tip: production serverless me direct file-store nahi hota. Evidence ko Drive/Portal/Cloud me upload karke URL paste karein.
        </div>
      </div>

      <button disabled={busy} className="btn btn-primary w-full">
        {busy ? "Submitting..." : "Submit Work Log"}
      </button>
    </form>
  );
}