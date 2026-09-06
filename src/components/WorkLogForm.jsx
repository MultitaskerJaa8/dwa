import { useMemo, useState } from "react";

export default function WorkLogForm({ kpis, onSubmit, busy }) {
  const now = new Date();

  const defaultKpi = useMemo(() => kpis?.[0]?._id || "", [kpis]);
  const [kpiId, setKpiId] = useState(defaultKpi);
  const [periodMonth, setPeriodMonth] = useState(now.getMonth() + 1);
  const [periodYear, setPeriodYear] = useState(now.getFullYear());
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  return (
    <form
      className="card overflow-hidden"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ kpiId, periodMonth, periodYear, taskTitle, taskDetails, evidenceUrl });
      }}
    >
      <div className="card-hd">
        <div className="font-extrabold tracking-tight text-slate-900">Submit Work Log</div>
        <div className="text-xs muted mt-1">
          Fill audit-ready details and attach evidence link (Drive/Portal URL).
        </div>
      </div>

      <div className="card-bd space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px_140px] gap-3">
          <div>
            <div className="label">KPI</div>
            <select className="input mt-1" value={kpiId} onChange={(e) => setKpiId(e.target.value)}>
              {kpis.map((k) => (
                <option key={k._id} value={k._id}>
                  {k.title} ({k.weightage}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="label">Month</div>
            <input
              className="input mt-1"
              type="number"
              min="1"
              max="12"
              value={periodMonth}
              onChange={(e) => setPeriodMonth(e.target.value)}
            />
          </div>

          <div>
            <div className="label">Year</div>
            <input
              className="input mt-1"
              type="number"
              min="2020"
              max="2100"
              value={periodYear}
              onChange={(e) => setPeriodYear(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="label">Task Title</div>
          <input
            className="input mt-1"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g., Resolved citizen requests within SLA"
          />
        </div>

        <div>
          <div className="label">Task Details</div>
          <textarea
            className="input mt-1 min-h-[140px]"
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
            placeholder="Write: what you did, timeline, outcome, reference number, evidence location..."
          />
        </div>

        <div>
          <div className="label">Evidence URL</div>
          <input
            className="input mt-1"
            value={evidenceUrl}
            onChange={(e) => setEvidenceUrl(e.target.value)}
            placeholder="https://..."
          />
          <div className="text-xs muted mt-2">
            Note: Vercel serverless me direct file upload nahi. Evidence ko Drive/Portal me upload karke URL paste karein.
          </div>
        </div>

        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? "Submitting..." : "Submit Work Log"}
        </button>
      </div>
    </form>
  );
}
