export default function KPICard({ kpi }) {
  return (
    <div className="card">
      <div className="card-bd">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs muted2 font-semibold uppercase tracking-wider">
              {kpi.category} • {kpi.cycle}
            </div>
            <div className="text-lg font-extrabold mt-2 text-slate-900">{kpi.title}</div>
            <div className="text-sm muted mt-2">{kpi.description || "—"}</div>
          </div>

          <div className="text-right">
            <div className="text-xs muted2 font-semibold uppercase tracking-wider">Weight</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{kpi.weightage}%</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="badge">Dept: {kpi.department?.code || "—"}</span>
          <span className="badge">Target: {kpi.targetValue}</span>
          <span className="badge">Active: {kpi.isActive ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
}