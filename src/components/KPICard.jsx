export default function KPICard({ kpi }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-white/60">{kpi.category} • {kpi.cycle}</div>
          <div className="text-lg font-bold mt-1">{kpi.title}</div>
          <div className="text-white/70 text-sm mt-2">{kpi.description || "—"}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60">Weightage</div>
          <div className="text-xl font-black">{kpi.weightage}%</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-white/60">
        Dept: <span className="text-white/80">{kpi.department?.name || "—"}</span> • Target:{" "}
        <span className="text-white/80">{kpi.targetValue}</span>
      </div>
    </div>
  );
}