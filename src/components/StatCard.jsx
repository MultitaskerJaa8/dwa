export default function StatCard({ label, value, hint }) {
  return (
    <div className="card">
      <div className="card-bd">
        <div className="text-xs muted2 font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-2xl md:text-3xl font-black mt-2 text-slate-900">{value}</div>
        {hint ? <div className="text-xs muted mt-2">{hint}</div> : null}
      </div>
    </div>
  );
}