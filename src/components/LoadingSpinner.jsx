export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="min-h-[220px] grid place-items-center">
      <div className="card">
        <div className="card-bd flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <div className="text-sm muted">{label}</div>
        </div>
      </div>
    </div>
  );
}