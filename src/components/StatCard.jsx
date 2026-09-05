export default function StatCard({ label, value, hint }) {
  return (
    <div className="card">
      <div className="text-xs text-white/60">{label}</div>
      <div className="text-2xl font-black mt-1">{value}</div>
      {hint ? <div className="text-xs text-white/50 mt-2">{hint}</div> : null}
    </div>
  );
}